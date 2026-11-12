#!/usr/bin/env python3
"""Build feed.xml (RSS of the essays), llms-full.txt (full text of every sitemap page) and a
1200x630 social card per page (assets/og/, rendered with headless Chrome only when a card changes).

    python3 tools/build_feeds.py

Stdlib only. Run after editing any page; it also adds the RSS <link> to pages that lack it.
The text extractor is shared with visionzlab's tools/build.py.
"""
import datetime
import html
import html.parser
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
SITE = "https://architect.solutions"
FEED_LINK = '<link rel="alternate" type="application/rss+xml" title="Frank Goortani: essays" href="https://architect.solutions/feed.xml">'
e = html.escape


class _Text(html.parser.HTMLParser):
    """The readable text of a page's <main>, as light Markdown, for llms-full.txt."""
    SKIP = {"script", "style", "svg", "noscript", "template", "button", "select"}
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
    PREFIX = {"h1": "# ", "h2": "## ", "h3": "### ", "h4": "#### ", "li": "- ", "summary": "Q: "}
    BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "dt", "dd", "summary", "tr", "blockquote", "figcaption",
             "div", "label", "section", "article", "ul", "ol", "dl", "form", "header", "footer", "nav"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.buf, self.prefix = [], [], ""
        self.stack, self.skip_at = [], None  # open tags inside <main>; depth where a skipped subtree began

    def handle_starttag(self, tag, attrs):
        if tag == "main":
            self.stack = ["main"]
            return
        if not self.stack or tag in self.VOID:
            return
        self.stack.append(tag)
        a = dict(attrs)
        # aria-live regions are calculator outputs: placeholder zeros until someone uses the tool
        if self.skip_at is None and (tag in self.SKIP or a.get("aria-hidden") == "true" or "hidden" in a
                                     or "aria-live" in a):
            self.skip_at = len(self.stack)
        if self.skip_at is None and tag in self.BLOCK:
            self.flush()
            self.prefix = self.PREFIX.get(tag, "")

    def handle_endtag(self, tag):
        if not self.stack or tag not in self.stack:
            return
        while self.stack:  # pop to the matching tag (tolerates unclosed children)
            top = self.stack.pop()
            if self.skip_at is not None and len(self.stack) < self.skip_at:
                self.skip_at = None
            if top == tag:
                break
        if tag in self.BLOCK or tag == "main":
            self.flush()

    def handle_data(self, data):
        if self.stack and self.skip_at is None:
            self.buf.append(data)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def updatepos(self, i, j):  # a tag boundary separates words ("calculator" + "Book"), never joins them
        if self.stack and self.skip_at is None and self.buf and not self.buf[-1].endswith(" "):
            self.buf.append(" ")
        return super().updatepos(i, j)

    def flush(self):
        text = re.sub(r" ([.,;:!?)])", r"\1", " ".join("".join(self.buf).split()))
        if text:
            self.out.append(self.prefix + text)
        self.buf, self.prefix = [], ""


def page_text(body):
    t = _Text()
    t.feed(body)
    t.flush()
    lines, prev = [], None
    for line in t.out:
        if line != prev:  # drop repeats such as a heading echoed by a visual label
            lines.append(line)
        prev = line
    return "\n\n".join(lines)


CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CARD = """<!doctype html><html><head><meta charset="utf-8"><style>
* {{ box-sizing: border-box; margin: 0; }}
html, body {{ width: 1200px; height: 630px; overflow: hidden; }}
body {{ background: #f5f3f0; color: #2d3436; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  display: grid; grid-template-columns: 1fr 260px; gap: 64px; align-items: center; padding: 72px 84px;
  border-left: 18px solid #0a7582; }}
.eyebrow {{ color: #0a7582; font-size: 24px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
  margin-bottom: 28px; }}
h1 {{ font-family: Georgia, "Times New Roman", serif; font-size: {size}px; line-height: 1.08; font-weight: 700; }}
.by {{ margin-top: 40px; font-size: 26px; color: #636e72; }}
.by b {{ color: #2d3436; }}
img {{ width: 260px; height: 260px; border-radius: 50%; object-fit: cover; border: 8px solid #0a7582; }}
</style></head><body>
<div><p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p class="by"><b>Frank Goortani</b> · architect.solutions</p></div>
<img src="{photo}" alt="">
</body></html>"""


def render_cards(cards):
    """cards: {file name: (eyebrow, title)}. Renders changed cards into assets/og/ and returns the count."""
    import hashlib
    import subprocess
    import tempfile
    out_dir = ROOT / "assets" / "og"
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    photo = (ROOT / "assets" / "images" / "frank-headshot.webp").as_uri()
    rendered = 0
    for name, (eyebrow, title) in sorted(cards.items()):
        size = 72 if len(title) <= 34 else 60 if len(title) <= 56 else 52
        doc = CARD.format(eyebrow=e(eyebrow), title=e(title), photo=photo, size=size)
        digest = hashlib.sha256(doc.encode()).hexdigest()[:16]
        if manifest.get(name) == digest and (out_dir / name).exists():
            continue
        if not pathlib.Path(CHROME).exists():
            raise SystemExit(f"Card {name} needs rendering but Chrome is not at {CHROME}")
        with tempfile.TemporaryDirectory() as tmp:
            src = pathlib.Path(tmp) / "card.html"
            src.write_text(doc)
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                            "--allow-file-access-from-files", "--window-size=1200,630",
                            f"--screenshot={out_dir / name}", src.as_uri()], check=True, capture_output=True, timeout=60)
        manifest[name] = digest
        rendered += 1
    for stale in set(manifest) - set(cards):
        (out_dir / stale).unlink(missing_ok=True)
        del manifest[stale]
    manifest_path.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")
    return rendered


def page_file(url):
    path = url.replace(SITE, "").lstrip("/")
    return ROOT / (path + "index.html" if path == "" or path.endswith("/") else path)


def ld_nodes(body):
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', body, re.S):
        data = json.loads(raw)
        for node in data.get("@graph", [data]) if isinstance(data, dict) else data:
            yield node


def main():
    urls = re.findall(r"<loc>(.*?)</loc>", (ROOT / "sitemap.xml").read_text())
    pages, articles, cards = [], [], {}
    for u in urls:
        f = page_file(u)
        body = f.read_text()
        if FEED_LINK not in body:
            body = re.sub(r'(<link rel="canonical"[^>]*>)', r"\1\n  " + FEED_LINK.replace("\\", "\\\\"), body, 1)
            f.write_text(body)
        og_title = html.unescape(re.search(r'<meta property="og:title" content="([^"]*)"', body).group(1))
        path = u.replace(SITE, "").strip("/")
        name = (path.replace("/", "--").replace(".html", "") or "home") + ".png"
        eyebrow = ("Essay" if path.startswith("writing/") and path.endswith(".html") else
                   "Writing" if path.startswith("writing") else
                   "The Centaur CTO" if path in ("book", "centaur-cto") else "Production AI and leadership")
        card_title = re.sub(r"\s*\|\s*Frank Goortani$", "", og_title)  # the byline already names him
        card_title = re.sub(r"^Frank Goortani(?::| on) ", "", card_title)
        cards[name] = (eyebrow, card_title[:1].upper() + card_title[1:])
        card_url = f"{SITE}/assets/og/{name}"
        new = re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(")',
                     lambda m: m.group(1) + card_url + m.group(2), body)
        if new != body:
            body = new
            f.write_text(body)
        title = html.unescape(re.search(r"<title>(.*?)</title>", body, re.S).group(1).strip())
        desc = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', body).group(1))
        pages.append((u, title, page_text(body)))
        for n in ld_nodes(body):
            if n.get("@type") == "Article":
                articles.append((n["datePublished"], n["headline"], u, desc))

    head = (ROOT / "llms.txt").read_text().split("## Pages")[0].rstrip()
    parts = [head, "", f"This file holds the full text of every page on {SITE}. The index is {SITE}/llms.txt.", ""]
    for u, title, text in pages:
        parts += [f"---\n\n# {title}\n\nURL: {u}", "", text, ""]
    (ROOT / "llms-full.txt").write_text("\n".join(parts) + "\n")

    def rfc822(iso):
        return datetime.datetime.fromisoformat(iso).strftime("%a, %d %b %Y %H:%M:%S %z")
    articles.sort(reverse=True)
    items = "".join(
        f"    <item>\n      <title>{e(h)}</title>\n      <link>{u}</link>\n      <guid isPermaLink=\"true\">{u}</guid>\n"
        f"      <pubDate>{rfc822(d)}</pubDate>\n      <description>{e(desc)}</description>\n    </item>\n"
        for d, h, u, desc in articles)
    feed = ('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
            f"  <channel>\n    <title>Frank Goortani: essays</title>\n    <link>{SITE}/writing/</link>\n"
            f'    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml" />\n'
            "    <description>Essays on production AI systems and engineering leadership by Frank Goortani.</description>\n"
            f"    <language>en</language>\n{items}  </channel>\n</rss>\n")
    (ROOT / "feed.xml").write_text(feed)
    rendered = render_cards(cards)
    print(f"llms-full.txt: {len(pages)} pages; feed.xml: {len(articles)} essays; "
          f"{len(cards)} social cards ({rendered} re-rendered)")


if __name__ == "__main__":
    main()
