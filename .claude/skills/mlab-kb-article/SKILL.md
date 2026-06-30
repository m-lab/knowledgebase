---
name: mlab-kb-article
description: This skill should be used when the user asks to "write a knowledgebase article", "create a KB article", "draft an M-Lab article", "add an article to the knowledge base", "write documentation for M-Lab", or asks to document any M-Lab feature, dataset, test, or workflow for the m-lab-kb site.
version: 0.1.0
---

# M-Lab Knowledgebase Article Writing

This skill guides writing and editing articles for the M-Lab Knowledge Base, an Astro-based site at `m-lab-kb/`. Articles live in `m-lab-kb/src/content/articles/` as Markdown files.

## Article Frontmatter Schema

Every article requires this frontmatter (from `m-lab-kb/src/content/config.ts`):

```yaml
---
title: "Title in Title Case"
description: One-sentence summary shown on index cards and in search results.
tags: [tag1, tag2]          # see tag list below
difficulty: beginner         # beginner | intermediate | advanced
standalone: false            # true = hidden from index/tags/search (e.g. about page)
starter: true                # true = featured on home page as a starting point
order: 1                     # integer, controls sort order for starter articles
date: 2024-01-15             # optional, ISO date
---
```

**Required:** `title`. Everything else is optional but `description` and `tags` should always be set.

## Available Tags

Only use tags from this fixed set (defined in `m-lab-kb/src/data/tags.ts`):

| Tag name | Label | When to use |
|---|---|---|
| `data-access` | Data Access | BigQuery queries, GCS access, schemas, API access |
| `measurement` | Measurement Tools | Individual test descriptions, how tests work |
| `node-operations` | Node Operations | BYOS hosting, node registration, Docker stack |
| `internet-quality` | Internet Quality | IQB framework, interpreting results, policy use |
| `research` | Research & Analysis | Research patterns, statistical guidance, academic use |

Most articles get 1–2 tags. An article about NDT BigQuery queries would get `[measurement, data-access]`.

## File Naming

Use kebab-case slugs matching the article's topic:

- Test articles: `test-ndt.md`, `test-msak.md`, `test-wehe.md`
- Getting started: `getting-started-researchers.md`, `getting-started-bigquery.md`
- Core services: `core-service-traceroute.md`, `core-service-tcp-info.md`
- FAQ / explainer: `ip-address-mismatch.md`, `mlab-annotations-explained.md`
- How-to: `accessing-data-buckets.md`, `integrating-mlab-tests.md`

The filename becomes the URL slug.

## Article Structure

### Heading hierarchy

- `##` for top-level sections within the article
- `###` for subsections
- No `#` H1 — the title from frontmatter renders as H1

### Common section patterns

**For test reference articles** (`test-*.md`):
1. Lead paragraph: what the test is, why it exists, how long M-Lab has run it
2. `## How [Test] Works` — mechanism, step-by-step, protocol versions if relevant
3. `## What [Test] Measures` — metrics table
4. `## Known Limitations`
5. `## Accessing [Test] Data` — BigQuery views + example query; GCS path
6. `## How People Use [Test] Data` — concrete use cases
7. `## Further Reading` — links to related articles and external docs

**For getting-started articles** (`getting-started-*.md`):
1. Brief context for the audience
2. Curated link list to relevant KB articles, grouped by what to do first
3. External resources section at the end

**For how-to articles**:
1. What the article covers and who it's for
2. Prerequisites or required access
3. Numbered steps (use `## Step 1: ...`, `## Step 2: ...` for multi-step flows)
4. Code examples inline
5. Troubleshooting section if the process is error-prone

### Code examples

Use fenced code blocks with language hints:

```sql
-- BigQuery SQL
SELECT ...
FROM `measurement-lab.ndt.ndt7_union`
WHERE DATE(a.TestTime) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
```

```bash
# Shell commands
curl "https://locate.measurementlab.net/v2/nearest/ndt/ndt7"
```

Always include the partition-pruning note when showing BigQuery queries: filter by `DATE(a.TestTime)`, not `a.TestTime >`, to avoid full-table scans.

### Tables

Use Markdown tables for metrics/schema references, dataset comparisons, and requirements:

```markdown
| Field | Description |
|-------|-------------|
| `a.MeanThroughputMbps` | Download speed in Mbps |
| `a.MinRTT` | Minimum RTT in milliseconds |
```

### Callouts (HTML in Markdown)

For important warnings or tips:

```html
<div class="callout callout--warn">
  <span class="callout-icon">⚠️</span>
  <div class="callout-body">Always filter by <code>DATE(a.TestTime)</code> to use partition pruning.</div>
</div>
```

Available variants: `callout--note`, `callout--tip`, `callout--warn`, `callout--danger`, `callout--quote`.

## Cross-Article Links

Use relative paths with `../slug` (no `.md` extension):

```markdown
See [Getting Started with M-Lab Data in BigQuery](../getting-started-bigquery)
See [NDT (Network Diagnostic Tool)](../test-ndt)
```

Use `#` placeholder links only when the target article doesn't exist yet: `[Article Title](#)`. Convert these to real links once the target article is written.

## TODO / FIXME Convention

Leave deferred work as HTML comments at the bottom of the file:

```html
<!-- TODO: Add diagram showing NDT7 test flow. -->
<!-- FIXME: Add link to ISP comparison query article once created. -->
```

`TODO` = enhancement that would improve the article.  
`FIXME` = something currently incomplete or broken (missing link, placeholder text).

## Writing Tone and Style

- **Audience**: primarily researchers, data scientists, ISP technical staff, policy analysts, and developers — not end users running speed tests
- **Voice**: direct, technically precise, no marketing language; state facts, not value judgments
- **Jargon**: define acronyms on first use (e.g., "ASN (Autonomous System Number)"); link to explainer articles rather than re-explaining everything inline
- **Numbers**: use Mbps not Mbit/s; milliseconds not ms in prose (but `ms` in code/tables); ISO country codes where applicable
- **M-Lab name**: "M-Lab" in text, never "MLab" or "mlab"
- **BigQuery table refs**: always backtick-quoted: `` `measurement-lab.ndt.ndt7_union` ``
- **Links in prose**: avoid bare URLs in prose; use descriptive link text

## Accuracy Checkpoints

Before finalizing any article:

1. BigQuery table/view names match current schema — cross-check against `test-ndt.md` for NDT tables
2. Port numbers and protocol details match `byos-overview.md` for node-related articles
3. Locate API URL is `https://locate.measurementlab.net/v2/nearest/...`
4. Support email is `support@measurementlab.net`
5. Discuss group URL is `https://groups.google.com/a/measurementlab.net/g/discuss`
6. M-Lab BigQuery project is `measurement-lab` (not `mlab` or `m-lab`)

## Article Types and Difficulty Levels

| Type | Difficulty | Starter? | Example |
|---|---|---|---|
| Platform overview | beginner | yes | `welcome-to-mlab.md` |
| Getting started by audience | beginner | yes | `getting-started-researchers.md` |
| Test reference | beginner–intermediate | no | `test-ndt.md`, `test-msak.md` |
| Data access how-to | beginner | no | `getting-started-bigquery.md` |
| Research patterns | intermediate | no | `research-guide.md` |
| Node operations | intermediate | no | `byos-overview.md` |
| Core service reference | intermediate–advanced | no | `core-service-traceroute.md` |
| FAQ / explainer | beginner–intermediate | no | `ip-address-mismatch.md` |
| Troubleshooting | beginner | no | `troubleshooting-tests.md` |

## Additional Resources

### Reference Files

- **`references/mlab-context.md`** — M-Lab domain knowledge: datasets, key concepts, external URLs, audience types
- **`references/article-index.md`** — all existing articles with slugs and summaries for cross-linking

### Existing Articles to Study as Templates

- `test-ndt.md` — gold-standard test reference article
- `getting-started-bigquery.md` — gold-standard how-to with step flow
- `research-guide.md` — intermediate article with SQL patterns
- `welcome-to-mlab.md` — beginner overview with table of datasets
