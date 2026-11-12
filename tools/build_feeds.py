#!/usr/bin/env python3
"""Build feed.xml (RSS of the essays) and llms-full.txt (full text of every sitemap page).

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
    pages, articles = [], []
    for u in urls:
        f = page_file(u)
        body = f.read_text()
        if FEED_LINK not in body:
            body = re.sub(r'(<link rel="canonical"[^>]*>)', r"\1\n  " + FEED_LINK.replace("\\", "\\\\"), body, 1)
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
    print(f"llms-full.txt: {len(pages)} pages; feed.xml: {len(articles)} essays")


if __name__ == "__main__":
    main()
