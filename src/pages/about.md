---
layout: ../layouts/Article.astro
title: About This Knowledge Base
description: Learn how this knowledge base is organized and how to contribute.
standalone: true
---

## What is this?

This is a community knowledge base built with [Astro](https://astro.build). It's a place to capture
guides, how-tos, and reference material for your team or community of practice.

## How to contribute

1. Add a new `.md` file to `src/content/articles/`
2. Include front matter with `title`, `description`, and `tags`
3. Write your content in Markdown
4. Open a pull request

## Front matter reference

```yaml
---
title: My Article Title
description: A short summary shown on the index page.
tags: [getting-started, how-to]
difficulty: beginner   # beginner | intermediate | advanced
standalone: false      # true = hidden from index/tags/search
---
```

## Callout syntax

Use HTML `<div>` callouts in your markdown:

```html
<div class="callout callout--note">
  <span class="callout-icon">ℹ️</span>
  <div class="callout-body">This is a note.</div>
</div>
```

Available variants: `callout--note`, `callout--tip`, `callout--warn`, `callout--danger`, `callout--quote`.

## License

This template is MIT licensed. See `LICENSE` in the repository root.
