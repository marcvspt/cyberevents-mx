import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { APIRoute } from 'astro';

export const prerender = true;

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
    if (!site) {
        throw new Error(TEXTS_GENERAL.errors.robotsSite);
    }
    const sitemapURL = new URL('sitemap-index.xml', site);
    return new Response(getRobotsTxt(sitemapURL));
};
