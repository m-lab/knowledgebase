#!/usr/bin/env node
// npm run test:queries [-- --file tcpinfo-snapshot-analysis.md] [-- --all]
//
// Validates ```sql code blocks in article markdown against BigQuery using a
// dry run. Dry runs are free, scan no data, and verify both GoogleSQL syntax
// and every column path against the live table schema — catching stale column
// references without maintaining a schema copy.
//
// Opt-in by decoration: only blocks with an HTML comment on the line above
// the fence are tested (this is what CI runs):
//   <!-- sqltest -->         validate this block with a dry run
//   <!-- sqltest: skip -->   never test this block (templates, pseudo-SQL)
// Pass --all to test every ```sql block regardless of decoration.
//
// Optional by design: requires gcloud Application Default Credentials.
//   gcloud auth application-default login
// If credentials or gcloud are missing, the script skips (exit 0) so builds
// and contributors without GCP access are unaffected.

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const articlesDir = join(__dirname, '../src/content/articles');

const reset = '\x1b[0m', bold = '\x1b[1m', dim = '\x1b[2m';
const red = '\x1b[31m', green = '\x1b[32m', yellow = '\x1b[33m', cyan = '\x1b[36m';

// ---------- CLI args ----------
const args = process.argv.slice(2);
let fileFilter = null;
const fileIdx = args.indexOf('--file');
if (fileIdx !== -1) fileFilter = args[fileIdx + 1];
const testAll = args.includes('--all');

// ---------- extract ```sql blocks ----------
function extractSqlBlocks(src, fname) {
  const lines = src.split('\n');
  const blocks = [];
  let inBlock = false, buf = [], startLine = 0, ann = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inBlock && /^```sql\s*$/.test(line.trim())) {
      inBlock = true;
      startLine = i + 2; // first SQL line (1-based)
      buf = [];
      // look back past blank lines for a <!-- sqltest --> decoration
      let j = i - 1;
      while (j >= 0 && lines[j].trim() === '') j--;
      const m = j >= 0 ? lines[j].match(/<!--\s*sqltest(?::\s*([\w-]+))?\s*-->/) : null;
      ann = m ? (m[1] || 'dry-run') : null;
      continue;
    }
    if (inBlock && /^```\s*$/.test(line.trim())) {
      inBlock = false;
      const sql = buf.join('\n').trim();
      const label = (sql.match(/^--\s*(.+)$/m) || [])[1] || `block at :${startLine}`;
      if (sql) blocks.push({ file: fname, line: startLine, sql, label, ann });
      continue;
    }
    if (inBlock) buf.push(line);
  }
  return blocks;
}

const files = readdirSync(articlesDir)
  .filter((f) => (f.endsWith('.md') || f.endsWith('.mdx')))
  .filter((f) => !fileFilter || f.includes(fileFilter))
  .sort();

const allBlocks = files.flatMap((f) =>
  extractSqlBlocks(readFileSync(join(articlesDir, f), 'utf8'), f)
);

// Default: only decorated blocks. --all: everything except sqltest: skip.
const blocks = allBlocks.filter((b) =>
  b.ann === 'skip' ? false : testAll ? true : b.ann !== null
);
const undecorated = allBlocks.length - blocks.length;

if (blocks.length === 0) {
  console.log(
    `No testable \`\`\`sql blocks found${fileFilter ? ` matching --file ${fileFilter}` : ''}` +
      (undecorated ? ` (${undecorated} undecorated — add <!-- sqltest --> or pass --all)` : '') +
      '.'
  );
  process.exit(0);
}

// ---------- credentials (optional) ----------
function gcloud(cmdArgs) {
  try {
    return execFileSync('gcloud', cmdArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

// Token sources, in order: explicit env (CI passes one from
// google-github-actions/auth), then local gcloud ADC.
const token =
  process.env.GOOGLE_OAUTH_ACCESS_TOKEN ||
  gcloud(['auth', 'application-default', 'print-access-token']);
if (!token) {
  console.log(`${yellow}⚠  Skipping query tests: no Google Cloud credentials.${reset}`);
  console.log(`${dim}   Locally: gcloud auth application-default login${reset}`);
  console.log(`${dim}   CI: set GOOGLE_OAUTH_ACCESS_TOKEN${reset}`);
  process.exit(0);
}

const project =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  process.env.CLOUDSDK_CORE_PROJECT ||
  gcloud(['config', 'get-value', 'project']);
if (!project || project === '(unset)') {
  console.log(`${yellow}⚠  Skipping query tests: no GCP project set.${reset}`);
  console.log(`${dim}   Set GOOGLE_CLOUD_PROJECT or: gcloud config set project <id>${reset}`);
  process.exit(0);
}

// ---------- dry-run each block ----------
async function dryRun(sql) {
  const res = await fetch(
    `https://bigquery.googleapis.com/bigquery/v2/projects/${project}/queries`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sql, dryRun: true, useLegacySql: false }),
    }
  );
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
  return Number(body.totalBytesProcessed || 0);
}

function fmtBytes(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + ' TB';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' GB';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + ' MB';
  return n + ' B';
}

console.log(`${bold}M-Lab KB — BigQuery query tests${reset} ${dim}(dry run, project: ${project})${reset}\n`);

let failed = 0, lastFile = null;
for (const b of blocks) {
  if (b.file !== lastFile) {
    console.log(`  ${cyan}${b.file}${reset}`);
    lastFile = b.file;
  }
  try {
    const bytes = await dryRun(b.sql);
    console.log(`    ${green}✓${reset}${dim}:${b.line}${reset}  ${b.label} ${dim}(would scan ${fmtBytes(bytes)} if run — dry run is free)${reset}`);
  } catch (err) {
    failed++;
    console.log(`    ${red}✗${reset}${dim}:${b.line}${reset}  ${b.label}`);
    console.log(`      ${red}${err.message}${reset}`);
  }
}

const passed = blocks.length - failed;
console.log(
  `\n${bold}${failed ? red : green}${passed} passed${reset}${dim}, ${failed} failed` +
    (undecorated ? `, ${undecorated} undecorated/skipped` : '') +
    reset
);
process.exit(failed ? 1 : 0);
