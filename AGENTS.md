# Architect Solutions Agent Instructions

This is a static website for architect.solutions. It is a small, mostly hand-authored site with HTML, CSS, JavaScript, SEO files, and a GitHub Pages deployment.

Use `CLAUDE.md` for deeper background, but this file is the Codex-facing instruction source.

## Project Structure

- `index.html` - main landing page.
- `writing/index.html` - writing/blog-style page.
- `assets/css/main.css` - site styling.
- `assets/js/main.js` - navigation and UI behavior.
- `assets/js/analytics.js` - analytics behavior.
- `assets/images/` - public image assets.
- `CNAME`, `sitemap.xml`, `robots.txt`, `llms.txt` - deployment, search, and AI discovery metadata.

## Development Rules

- Keep the site static; do not add a framework or build step without explicit user direction.
- Use two-space indentation for HTML, CSS, and JavaScript.
- Keep paths relative unless the file intentionally needs an absolute public URL.
- Preserve SEO metadata, canonical URLs, sitemap entries, and CNAME unless the change is domain-related.
- Maintain accessibility: semantic HTML, useful alt text, keyboard-friendly controls, visible focus states.
- Avoid editing `.git/`, generated verification token files, or deployment metadata unless the request requires it.

## Design Direction

- The site should feel professional, technical, and focused on agentic coding, MCP, and developer enablement.
- Use existing colors, typography, spacing, and component patterns in `assets/css/main.css`.
- Do not introduce decorative-heavy or marketing-template sections that clash with the current compact consulting-site structure.

## Verification

There is no automated test suite. For site changes, serve locally and inspect affected pages:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Check desktop and mobile widths, navigation, links, forms/CTAs, console errors, and obvious layout regressions.
