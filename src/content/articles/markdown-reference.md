---
title: Markdown Reference
description: Quick reference for all Markdown and callout syntax supported in articles.
tags: [reference]
difficulty: beginner
---

This article is a reference for everything you can use in article files.

## Headings

```markdown
## Section heading (h2)
### Subsection heading (h3)
#### Minor heading (h4)
```

## Text formatting

```markdown
**bold**, _italic_, ~~strikethrough~~, `inline code`
```

**bold**, _italic_, ~~strikethrough~~, `inline code`

## Links and images

```markdown
[Link text](https://example.com)
![Alt text](./image.png)
```

## Lists

```markdown
- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item
```

## Tables

```markdown
| Column A | Column B |
|---|---|
| Value | Value |
```

## Code blocks

Use triple backticks with an optional language name:

````markdown
```python
print("Hello!")
```
````

Supported languages include `bash`, `python`, `javascript`, `typescript`, `yaml`, `json`, `sql`,
and [many more](https://shiki.style/languages).

## Callouts

```html
<div class="callout callout--note">
  <span class="callout-icon">ℹ️</span>
  <div class="callout-body">Note text here.</div>
</div>

<div class="callout callout--tip">
  <span class="callout-icon">💡</span>
  <div class="callout-body">Tip text here.</div>
</div>

<div class="callout callout--warn">
  <span class="callout-icon">⚠️</span>
  <div class="callout-body">Warning text here.</div>
</div>

<div class="callout callout--danger">
  <span class="callout-icon">🚨</span>
  <div class="callout-body">Danger text here.</div>
</div>

<div class="callout callout--quote">
  <span class="callout-icon">💬</span>
  <div class="callout-body">A quote or aside.</div>
</div>
```

<div class="callout callout--note">
  <span class="callout-icon">ℹ️</span>
  <div class="callout-body">Note</div>
</div>

<div class="callout callout--tip">
  <span class="callout-icon">💡</span>
  <div class="callout-body">Tip</div>
</div>

<div class="callout callout--warn">
  <span class="callout-icon">⚠️</span>
  <div class="callout-body">Warning</div>
</div>

<div class="callout callout--danger">
  <span class="callout-icon">🚨</span>
  <div class="callout-body">Danger</div>
</div>

<div class="callout callout--quote">
  <span class="callout-icon">💬</span>
  <div class="callout-body">Quote</div>
</div>
