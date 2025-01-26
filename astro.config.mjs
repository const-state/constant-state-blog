import { defineConfig } from 'astro/config';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
    prefetch: true,
    vite: {
        ssr: {
            noExternal: ['open-props'],
        },
    },
    markdown: {
        rehypePlugins: [
            rehypeHeadingIds
        ],
    }
});
