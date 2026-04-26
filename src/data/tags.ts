export interface Tag {
  name: string;
  label: string;
  color?: string;
}

// Add or remove tags here. Each tag name must be URL-safe (lowercase, hyphens).
// A tag page at /tags/<name>/ is generated automatically for every entry.
export const TAGS: Tag[] = [
  { name: 'geolocation', label: 'Geolocation', color: '#2563eb' },
  { name: 'data-access', label: 'Data Access', color: '#0891b2' },
  { name: 'docker', label: 'Docker', color: '#0369a1' },
  { name: 'byos', label: 'BYOS Node Operations', color: '#7c3aed' },
  { name: 'node-configuration', label: 'Node Configuration', color: '#059669' },
  { name: 'troubleshooting', label: 'Troubleshooting', color: '#dc2626' },
  { name: 'networking', label: 'Networking', color: '#d97706' },
  { name: 'monitoring', label: 'Monitoring & Logging', color: '#db2777' },
  { name: 'rate-limits', label: 'Rate Limits', color: '#92400e' },
  { name: 'bigquery', label: 'BigQuery & SQL', color: '#1d4ed8' },
  { name: 'privacy', label: 'Privacy', color: '#6d28d9' },
  { name: 'cloud-storage', label: 'Cloud Storage', color: '#0f766e' },
];

export function getTagByName(name: string): Tag | undefined {
  return TAGS.find((t) => t.name === name);
}
