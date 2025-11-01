import { defineCollection, z } from 'astro:content';

const infoCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    username: z.string(),
    status: z.string(),
    location: z.string(),
    goal: z.string(),
    currentFocus: z.array(z.string()),
    learning: z.array(z.string()),
    interests: z.array(z.string()),
    motto: z.string(),
  }),
});

export const collections = {
  'info': infoCollection,
};
