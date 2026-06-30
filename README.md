# M-Lab Knowledge Base

This repository houses the source for the https://kb.measurementlab.net website. We use this website to share information about datasets, software and tools that help M-Lab community members get the most out of experimental data, tools and the global infrastructure we manage.


## Quick start

```bash
npm install
npm run dev
```

## Adding content

**To add an article**, create a `.md` file in `src/content/articles/`:

```markdown
---
title: My Article
description: What this article covers.
tags: [getting-started]
difficulty: beginner
---

Your content here.
```

That's it — the article appears on the home page automatically.

**To add a tag**, edit `src/data/tags.ts` and add an entry to the `TAGS` array. A tag page is generated automatically.

**To customize branding**, edit `src/config.ts` — change the site title, tagline, colors, and navigation.

## Front matter

| Field | Type | Description |
|---|---|---|
| `title` | string | **Required.** Article title |
| `description` | string | Short summary shown on cards |
| `tags` | string[] | Tag names from `src/data/tags.ts` |
| `difficulty` | string | `beginner` \| `intermediate` \| `advanced` |
| `standalone` | boolean | `true` hides the article from index/tags/search |

## Callout boxes

Use callout boxes to highlight tips, important notes, warnings, or caveats. Write them as raw HTML in your markdown file — Astro's markdown renderer doesn't process markdown syntax inside HTML blocks, so write links and emphasis as HTML:

```html
<div class="callout callout--tip">
<span class="callout-icon">💡</span>
<div class="callout-body"><p>Content here. Use <strong>bold</strong> and <a href="...">links</a> as HTML.</p></div>
</div>
```

Four variants:

| Class | Color | Icon | Use for |
|---|---|---|---|
| `callout--note` | Blue | ℹ️ | Definitions, context, cross-references |
| `callout--tip` | Green | 💡 | "Try it yourself", helpful shortcuts, Binder links |
| `callout--warn` | Yellow | ⚠️ | Caveats, gotchas, things that may surprise |
| `callout--danger` | Red | ❗ | Data quality issues, breaking changes, errors |

**Do not use markdown `>` blockquotes for callouts.** Reserve `>` for actual quoted text (citations, attribution).

## Inline code

Wrap terms, column names, file paths, and short code snippets in backticks: `` `download_p50` ``, `` `country_code` ``. The site renders them as gray rounded pills — no extra decoration needed.

## Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. The included workflow builds and deploys on every push to `main`

## License

MIT
