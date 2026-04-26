---
title: Getting Started with the Knowledge Base
description: Learn how to add articles, configure tags, and customize this knowledge base for your community.
tags: [getting-started, how-to]
difficulty: beginner
---

Welcome! This knowledge base is built with [Astro](https://astro.build) and designed to be easy to
maintain. All content lives in `src/content/articles/` as plain Markdown files.

## Adding an article

Create a new `.md` file in `src/content/articles/`:

```bash
touch src/content/articles/my-new-article.md
```

Add front matter at the top of the file:

```yaml
---
title: My New Article
description: A one-sentence summary of what this article covers.
tags: [getting-started]
difficulty: beginner
---
```

Then write your content below the front matter block.

## Front matter fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Article title shown in cards and the page header |
| `description` | No | Short summary shown on index cards |
| `tags` | No | Array of tag names from `src/data/tags.ts` |
| `difficulty` | No | `beginner`, `intermediate`, or `advanced` |
| `standalone` | No | `true` hides the article from index/tags/search |

## Managing tags

Tags are defined in `src/data/tags.ts`. Add a new entry to the `TAGS` array:

```typescript
{ name: 'my-tag', label: 'My Tag', color: '#2563eb' },
```

A tag page at `/tags/my-tag/` is generated automatically — no stub files needed.

## Customizing your site

Open `src/config.ts` to change the site title, tagline, brand colors, and navigation links.

<div class="callout callout--tip">
  <span class="callout-icon">💡</span>
  <div class="callout-body">
    Set <code>githubRepo</code> in <code>src/config.ts</code> to enable "Edit on GitHub" buttons
    on every article page.
  </div>
</div>
