#!/usr/bin/env node
// npm run todo — lists all <!-- FIXME: --> and <!-- TODO: --> comments in article source files.

import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const articlesDir = join(__dirname, '../src/content/articles');

const MARKER = /<!--\s*(FIXME|TODO):\s*(.*?)\s*-->/g;

const results = { FIXME: [], TODO: [] };

for (const fname of readdirSync(articlesDir).sort()) {
  if (!fname.endsWith('.md') && !fname.endsWith('.mdx')) continue;
  const path = join(articlesDir, fname);
  const src = readFileSync(path, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    let m;
    MARKER.lastIndex = 0;
    while ((m = MARKER.exec(line)) !== null) {
      results[m[1]].push({ file: fname, line: i + 1, text: m[2] });
    }
  });
}

const total = results.FIXME.length + results.TODO.length;

if (total === 0) {
  console.log('✅  No TODOs or FIXMEs found.');
  process.exit(0);
}

const reset  = '\x1b[0m';
const bold   = '\x1b[1m';
const dim    = '\x1b[2m';
const red    = '\x1b[31m';
const yellow = '\x1b[33m';
const cyan   = '\x1b[36m';

function section(label, color, items) {
  if (!items.length) return;
  console.log(`\n${bold}${color}${label} (${items.length})${reset}`);
  let lastFile = null;
  for (const { file, line, text } of items) {
    if (file !== lastFile) {
      console.log(`\n  ${cyan}${file}${reset}`);
      lastFile = file;
    }
    console.log(`    ${dim}:${line}${reset}  ${text}`);
  }
}

console.log(`${bold}M-Lab KB — open items${reset}  ${dim}(${total} total)${reset}`);
section('FIXME', red, results.FIXME);
section('TODO',  yellow, results.TODO);
console.log();
