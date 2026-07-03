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

## Testing BigQuery examples

SQL code blocks in articles can be validated against the live BigQuery schemas using free dry-run queries — no data is scanned and nothing is billed. This catches syntax errors and stale column paths (e.g. a field that moved between the `ndt.tcpinfo` view and raw tables) before an article ships.

**Annotating a block.** Testing is opt-in per block. Put an HTML comment on the line directly above the fence:

````markdown
<!-- sqltest -->
```sql
SELECT ... FROM `measurement-lab.ndt.ndt7` ...
```
````

A decorated block must be a complete, runnable GoogleSQL query. To permanently exclude a block that looks like SQL but isn't runnable (templates, pseudo-code, deliberately broken examples), use `<!-- sqltest: skip -->` instead. Undecorated blocks are ignored.

**Running locally.** You need gcloud Application Default Credentials and a default project (queries are dry-run only, so any project with the BigQuery API enabled works):

```bash
gcloud auth application-default login
npm run test:queries                      # all decorated blocks, all articles
npm run test:queries -- --file tcpinfo    # one article (filename substring)
npm run test:queries -- --all             # every ```sql block, decorated or not
```

Each block reports pass/fail with its file, line number, and estimated bytes the query would scan. Without credentials the script skips with a warning and exits 0, so it never blocks contributors or builds.

**In CI.** `.github/workflows/query-tests.yml` runs the decorated-block validation on any PR touching `src/content/articles/`. It authenticates with the `GCP_SA_KEY` repository secret (a service-account JSON key needing only `roles/bigquery.jobUser` on its own project plus read access to the `measurement-lab` datasets). When the secret is unavailable — e.g. PRs from forks — the job skips instead of failing.

## Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → GitHub Actions**
3. The included workflow builds and deploys on every push to `main`

## License

MIT
