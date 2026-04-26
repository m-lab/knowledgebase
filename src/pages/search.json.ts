import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.standalone);

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const index = articles.map(article => ({
    id: `${base}/${article.id.replace(/\.mdx?$/, '')}/`,
    title: article.data.title,
    description: article.data.description ?? '',
    tags: (article.data.tags ?? []).join(' '),
    content: article.body?.replace(/[#*`>[\]|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 5000) ?? '',
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
