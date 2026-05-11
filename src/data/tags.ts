export interface Tag {
  name: string;
  label: string;
  color?: string;
}

// Five theme tags aligned with M-Lab's core activities.
// Colors from the M-Lab design palette.
export const TAGS: Tag[] = [
  { name: 'data-access',      label: 'Data Access',         color: '#0069A8' }, // primary-700
  { name: 'measurement',      label: 'Measurement Tools',   color: '#0084D1' }, // primary-600
  { name: 'node-operations',  label: 'Node Operations',     color: '#007A55' }, // supporting1-700
  { name: 'internet-quality', label: 'Internet Quality',    color: '#A65F00' }, // secondary-700
  { name: 'research',         label: 'Research & Analysis', color: '#8200DA' }, // speed-700
];

export function getTagByName(name: string): Tag | undefined {
  return TAGS.find((t) => t.name === name);
}
