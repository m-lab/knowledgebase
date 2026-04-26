export interface Tag {
  name: string;
  label: string;
  color?: string;
}

// Add or remove tags here. Each tag name must be URL-safe (lowercase, hyphens).
// A tag page at /tags/<name>/ is generated automatically for every entry.
export const TAGS: Tag[] = [
  { name: 'getting-started', label: 'Getting Started', color: '#2563eb' },
  { name: 'how-to', label: 'How To', color: '#7c3aed' },
  { name: 'reference', label: 'Reference', color: '#0891b2' },
  { name: 'tutorial', label: 'Tutorial', color: '#059669' },
  { name: 'best-practices', label: 'Best Practices', color: '#d97706' },
  { name: 'tools', label: 'Tools', color: '#dc2626' },
  { name: 'collaboration', label: 'Collaboration', color: '#db2777' },
  { name: 'advanced', label: 'Advanced', color: '#7c3aed' },
];

export function getTagByName(name: string): Tag | undefined {
  return TAGS.find((t) => t.name === name);
}
