import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const infoCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/info' }),
  schema: z.object({
    name: z.string(),
    nickname: z.string(),
    username: z.string(),
    status: z.string(),
    role: z.string(),
    location: z.string(),
    goal: z.string(),
    tagline: z.string(),
    availability: z.string(),
    currentFocus: z.array(z.string()),
    learning: z.array(z.string()),
    interests: z.array(z.string()),
    motto: z.string(),
    teamQuote: z.string(),
    rightNow: z.array(z.string()),
    email: z.string(),
    phone: z.string().optional(),
    socials: z.array(z.object({
      label: z.string(),
      url: z.url(),
    })),
    stack: z.array(z.object({
      group: z.string(),
      items: z.array(z.string()),
      learning: z.boolean().default(false),
    })),
    education: z.object({
      school: z.string(),
      degree: z.string(),
      year: z.string(),
      location: z.string(),
    }).optional(),
    highlights: z.array(z.object({
      title: z.string(),
      org: z.string(),
      period: z.string(),
      description: z.string(),
    })).default([]),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Short label shown inside the project's device mock, e.g. "TAMS". Defaults to the title. */
    shortName: z.string().optional(),
    kind: z.string(),
    summary: z.string(),
    role: z.string().optional(),
    team: z.string().optional(),
    tags: z.array(z.string()),
    status: z.enum(['completed', 'upcoming', 'in-progress']),
    liveUrl: z.url().nullable().optional(),
    repoUrl: z.url().nullable().optional(),
    order: z.number(),
  }),
});

export const collections = {
  'info': infoCollection,
  'projects': projectsCollection,
};
