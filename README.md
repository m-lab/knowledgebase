# Astro KB

A clean, searchable knowledge base template built with [Astro](https://astro.build) and [Svelte](https://svelte.dev). Designed for teams and communities of practice.

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

## Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. The included workflow builds and deploys on every push to `main`

## License

MIT
