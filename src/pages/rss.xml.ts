import { TEXTS_GENERAL } from '@/lib/texts.ts';
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { SITE_DATA, SITE_LOCALE } from '@/lib/site.ts'
import { getEventUrl } from '@/lib/events/presentation.ts'
import { getPublishedEvents } from '@/lib/events/content.ts'

export const prerender = true;

export const GET: APIRoute = async (context) => {
    if (!context.site) {
        throw new Error(TEXTS_GENERAL.errors.rssSite);
    }

    return rss({
        title: SITE_DATA.name,
        description: SITE_DATA.description,
        site: context.site,
        items: (await getPublishedEvents()).sort((a, b) => b.data.updatedAt.localeCompare(a.data.updatedAt)).map((event) => ({
            title: event.data.title,
            description: event.data.description,
            pubDate: new Date(`${event.data.updatedAt}T00:00:00Z`),
            link: getEventUrl(event),
        })),
        customData: `<language>${SITE_LOCALE.rss}</language>`,
    })
}
