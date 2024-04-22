import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
    type: 'content',
    schema: z.object({
        author: z.string().default('Constant State'),
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        image: z.object({
            src: z.string(),
            alt: z.string(),
        }),
        tags: z.array(z.string()),
    }),
});

const podcastCollectiono = defineCollection({
    type: 'content',
    schema: z.object({
        author: z.string().default('Constant State'),
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        video: z.string(),
        tags: z.array(z.string()),
    })
})

export const collections = {
    posts: postCollection,
    podcast: podcastCollectiono
}
