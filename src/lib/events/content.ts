import { getCollection } from 'astro:content';
import { SITE_LOCALE } from '@/lib/site.ts';
import { getEventUrl } from '@/lib/events/presentation.ts';
import { getCfpStatus, getEventStatus, getToday, isEventNear, isEventRecent } from '@/lib/events/status.ts';
import type { ArchivedEventGroup, Event, EventCardData } from '@/lib/types/event.ts';

export async function getPublishedEvents(): Promise<Event[]> {
    const events = await getCollection('events', ({ data }) => !data.draft);
    return events.sort((a, b) => (a.data.startDate ?? '9999').localeCompare(b.data.startDate ?? '9999') || a.data.title.localeCompare(b.data.title, SITE_LOCALE.sort));
}

export async function getPublishedEventCards(): Promise<EventCardData[]> {
    const today = getToday();
    return (await getPublishedEvents()).map((event) => ({
        event, url: getEventUrl(event), status: getEventStatus(event, today), cfpStatus: getCfpStatus(event, today), isNear: isEventNear(event, today), isRecent: isEventRecent(event, today),
    }));
}

export async function getArchivedEventGroups(): Promise<ArchivedEventGroup[]> {
    const cards = (await getPublishedEventCards())
        .filter((card) => card.status === 'finished')
        .sort((a, b) => b.event.data.startDate!.localeCompare(a.event.data.startDate!) || a.event.data.title.localeCompare(b.event.data.title, SITE_LOCALE.sort));
    const groups = new Map<string, EventCardData[]>();
    for (const card of cards) {
        const year = card.event.data.startDate!.slice(0, 4);
        const group = groups.get(year) ?? [];
        group.push(card);
        groups.set(year, group);
    }
    return [...groups.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([year, cards]) => ({ year, cards }));
}
