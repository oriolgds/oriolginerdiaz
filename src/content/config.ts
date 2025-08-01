import { defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    url: z.string().optional(),
    github: z.string().optional(),
    playStore: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = {
  projects: projectsCollection,
};
