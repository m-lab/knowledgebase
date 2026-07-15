import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isListed } from '../utils';

/**
 * GET /article-index
 *
 * Returns a plain-text article index consumed by the mlab-kb-article skill
 * as a live reference for cross-linking. Grouped by first tag, with slug,
 * title, tags, difficulty, and description for each article.
 */
export const GET: APIRoute = async () => {
  const all = await getCollection('articles', ({ data }) => isListed(data));

  // Sort: starters first (by order), then alphabetically by title
  all.sort((a, b) => {
    const aStarter = a.data.starter ?? false;
    const bStarter = b.data.starter ?? false;
    if (aStarter !== bStarter) return aStarter ? -1 : 1;
    if (a.data.order != null && b.data.order != null) return a.data.order - b.data.order;
    return a.data.title.localeCompare(b.data.title);
  });

  function slug(id: string) {
    return id.replace(/\.mdx?$/, '');
  }

  // Group by first tag (or "other")
  const groups: Record<string, typeof all> = {};
  for (const article of all) {
    const tag = article.data.tags?.[0] ?? 'other';
    (groups[tag] ??= []).push(article);
  }

  const lines: string[] = [
    '# M-Lab Knowledge Base — Article Index',
    `# Generated: ${new Date().toISOString()}`,
    '# Use slugs as relative links: ../slug',
    '',
  ];

  for (const [group, articles] of Object.entries(groups)) {
    lines.push(`## ${group}`);
    lines.push('');
    for (const article of articles) {
      const s = slug(article.id);
      const diff = article.data.difficulty ? ` [${article.data.difficulty}]` : '';
      const tags = (article.data.tags ?? []).join(', ');
      const desc = article.data.description ? ` — ${article.data.description}` : '';
      lines.push(`- ${s}${diff} | tags: ${tags}${desc}`);
      lines.push(`  title: ${article.data.title}`);
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
