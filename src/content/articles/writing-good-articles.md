---
title: Writing Good Knowledge Base Articles
description: Tips for writing clear, useful articles that are easy to find and maintain.
tags: [best-practices, how-to]
difficulty: beginner
---

A knowledge base is only useful if people can find what they need and trust what they read. Here are
a few principles that help.

## Write for the reader, not yourself

Before writing, ask: who is reading this and what do they need to do after reading it?

- **Beginners** need more context and explicit steps.
- **Experienced practitioners** need quick reference and edge-case notes.
- **Everyone** benefits from a short summary at the top.

## Structure with headings

Use `##` and `###` headings to break your article into scannable sections. The table of contents on
the right is generated automatically from your headings.

## Use callouts for important information

<div class="callout callout--warn">
  <span class="callout-icon">⚠️</span>
  <div class="callout-body">
    Use warning callouts sparingly — if everything is a warning, nothing is.
  </div>
</div>

<div class="callout callout--note">
  <span class="callout-icon">ℹ️</span>
  <div class="callout-body">
    Notes are good for information that is helpful but not critical.
  </div>
</div>

## Code blocks

Fenced code blocks with a language hint get syntax highlighting:

````markdown
```python
def hello(name: str) -> str:
    return f"Hello, {name}!"
```
````

## Keep articles focused

One article per concept. If you find yourself adding a section that would make a good standalone
article, split it out and link between them.

## Maintenance

Set a calendar reminder to review articles quarterly. Outdated articles are worse than no articles
because they erode trust.
