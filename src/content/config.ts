import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    standalone: z.boolean().default(false),
  }),
});

export const collections = { articles };
