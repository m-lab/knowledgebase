import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Strip markdown syntax from article body text so the lunr index contains
 * only natural-language terms. Order matters: remove fenced code blocks first
 * so their contents are excluded, then strip inline markup.
 */
export function stripMarkdown(body: string): string {
  return body
    // Remove fenced code blocks (``` ... ```)
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code
    .replace(/`[^`]*`/g, ' ')
    // Remove markdown link URLs but keep link text: [text](url) → text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove bare URLs
    .replace(/https?:\/\/\S+/g, ' ')
    // Remove image syntax: ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Remove headings markers, bold/italic, blockquotes, pipes (tables)
    .replace(/[#*_>|\\]/g, ' ')
    // Remove HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000);
}

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.standalone);

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const index = articles.map(article => ({
    id: `${base}/${article.id.replace(/\.mdx?$/, '')}/`,
    title: article.data.title,
    description: article.data.description ?? '',
    tags: (article.data.tags ?? []).join(' '),
    content: stripMarkdown(article.body ?? ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
