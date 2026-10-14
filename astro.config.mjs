// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

const site = 'https://cemx.marcvspt.tech';

// https://astro.build/config
export default defineConfig({
    integrations: [sitemap({
        customSitemaps: [new URL('/sitemap-events.xml', site).href],
    })],

    site,
    output: 'server',

    vite: {
        plugins: [tailwindcss()]
    },

    adapter: netlify()
});
