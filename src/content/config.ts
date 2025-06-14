import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
    category: z.string(),
		publishedDate: z.coerce.date(),
    featured: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional().default(false),
	}),
});

const images = defineCollection({
	type: 'data',
	schema: z.object({}),
});

export const collections = { blog, images };
