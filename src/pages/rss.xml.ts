import { TEXTS_GENERAL } from '@/lib/texts.ts';
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { SITE_DATA } from '@/lib/data.ts'
import { getEventUrl, getPublishedEvents } from '@/lib/event.ts'

export const prerender = true;

export const GET: APIRoute = async (context) => {
    if (!context.site) {
        throw new Error(TEXTS_GENERAL.errors.rssSite);
    }

    return rss({
        title: SITE_DATA.name,
        description: SITE_DATA.description,
        site: context.site,
        items: (await getPublishedEvents()).sort((a, b) => b.data.updateAt.localeCompare(a.data.updateAt)).map((event) => ({
            title: event.data.title,
            description: event.data.description,
            pubDate: new Date(`${event.data.updateAt}T00:00:00Z`),
            link: getEventUrl(event),
        })),
        customData: `<language>${TEXTS_GENERAL.locale.rss}</language>`,
    })
}
