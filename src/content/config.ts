import { z, defineCollection, reference } from 'astro:content'

const postCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            author: z.string().default('Constant State'),
            title: z.string(),
            description: z.string(),
            pubDate: z.date(),
            imageSrc: image(),
            tags: z.array(z.string()),
            relatedPost: z.array(reference('posts')).optional()
        }),
})

const podcastCollection = defineCollection({
    type: 'content',
    schema: z.object({
        author: z.string().default('Constant State'),
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        video: z.string(),
        thumbnail: z.string(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
    posts: postCollection,
    podcast: podcastCollection,
}
