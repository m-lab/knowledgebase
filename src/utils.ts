import type { CollectionEntry } from 'astro:content';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return `${base}${path}`;
}

type ArticleData = CollectionEntry<'articles'>['data'];

/** True unless the article opts out with `published: false`. Controls whether a page is built at all. */
export function isPublished(data: ArticleData): boolean {
  return data.published;
}

/** True for articles that should appear on index/tags/search/browse — published and not standalone. */
export function isListed(data: ArticleData): boolean {
  return isPublished(data) && !data.standalone;
}
