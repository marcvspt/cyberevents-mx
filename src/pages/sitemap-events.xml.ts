import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { APIRoute } from 'astro';
import { getEventUrl, getPublishedEvents } from '@/lib/event.ts';

export const prerender = true;

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
    return entities[character]!;
});

export const GET: APIRoute = async ({ site }) => {
    if (!site) throw new Error(TEXTS_GENERAL.errors.sitemapSite);
    const urls = (await getPublishedEvents()).map((event) =>
        `<url><loc>${escapeXml(new URL(getEventUrl(event), site).href)}</loc><lastmod>${event.data.updateAt}</lastmod></url>`,
    ).join('\n');
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
};
