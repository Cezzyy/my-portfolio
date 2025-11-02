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

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    techIcons: z.array(z.string()),
    status: z.enum(['completed', 'upcoming', 'in-progress']),
    demoUrl: z.string().nullable().optional(),
    demoLabel: z.string().optional(),
    demoNote: z.string().optional(),
    githubUrl: z.string().nullable().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = {
  'info': infoCollection,
  'projects': projectsCollection,
};
