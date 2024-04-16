import { z, defineCollection } from 'astro:content';

const postCollection = ({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.object({
			src: z.string(),
			alt: z.string(),
		}),
		tags: z.array(z.string()),
	}),
});

export const collections = {
	posts: postCollection
}
