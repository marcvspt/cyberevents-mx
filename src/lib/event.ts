import { getCollection, type CollectionEntry } from 'astro:content';
import { TEXTS_GENERAL } from '@/lib/texts.ts';

export type Event = CollectionEntry<'events'>;
export type EventStatus = 'coming-soon' | 'upcoming' | 'ongoing' | 'finished' | 'cancelled';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = TEXTS_GENERAL.event.statusLabels;
export const NEAR_EVENT_DAYS = 30;
export const RECENT_EVENT_MONTHS = 2;

export function isEventRecent(event: Event, today = getToday()): boolean {
    if (getEventStatus(event, today) !== 'finished') return false;
    const [year, month, day] = today.split('-').map(Number);
    const target = new Date(Date.UTC(year, month - 1 - RECENT_EVENT_MONTHS, 1));
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(day, lastDay));
    return (event.data.endDate ?? event.data.startDate!) > target.toISOString().slice(0, 10);
}

export function isEventNear(event: Event, today = getToday()): boolean {
    const status = getEventStatus(event, today);
    if (status === 'ongoing') return true;
    if (status !== 'upcoming' || !event.data.startDate) return false;
    const limit = new Date(`${today}T00:00:00Z`);
    limit.setUTCDate(limit.getUTCDate() + NEAR_EVENT_DAYS);
    return event.data.startDate <= limit.toISOString().slice(0, 10);
}

export function getToday(date = new Date()): string {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(date);
    const part = (type: string) => parts.find((item) => item.type === type)!.value;
    return `${part('year')}-${part('month')}-${part('day')}`;
}

export function getEventStatus(event: Event, today = getToday()): EventStatus {
    const { cancelled, startDate, endDate } = event.data;
    if (cancelled) return 'cancelled';
    if (!startDate) return 'coming-soon';
    if (today > (endDate ?? startDate)) return 'finished';
    return today >= startDate ? 'ongoing' : 'upcoming';
}

export function getCfpStatus(event: Event, today = getToday()) {
    const cfp = event.data.cfp;
    if (!cfp || event.data.cancelled) return undefined;
    if (cfp.status === 'closed' || (cfp.closes && today > cfp.closes)) return 'closed';
    if (cfp.opens && today < cfp.opens) return 'announced';
    if (cfp.opens) return 'open';
    return cfp.status ?? 'announced';
}

export function getEventUrl(event: Pick<Event, 'id'>): string {
    return `/events/${event.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function formatEventDate(value: string): string {
    return new Intl.DateTimeFormat(TEXTS_GENERAL.locale.date, {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
}

export async function getPublishedEvents(): Promise<Event[]> {
    const events = await getCollection('events', ({ data }) => !data.draft);
    return events.sort((a, b) => (a.data.startDate ?? '9999').localeCompare(b.data.startDate ?? '9999') || a.data.title.localeCompare(b.data.title, TEXTS_GENERAL.locale.sort));
}

export async function getPublishedEventCards() {
    const today = getToday();
    return (await getPublishedEvents()).map((event) => ({
        event, url: getEventUrl(event), status: getEventStatus(event, today), cfpStatus: getCfpStatus(event, today), isNear: isEventNear(event, today), isRecent: isEventRecent(event, today),
    }));
}

export async function getArchivedEventGroups() {
    const cards = (await getPublishedEventCards())
        .filter((card) => card.status === 'finished')
        .sort((a, b) => b.event.data.startDate!.localeCompare(a.event.data.startDate!) || a.event.data.title.localeCompare(b.event.data.title, TEXTS_GENERAL.locale.sort));
    const groups = new Map<string, typeof cards>();
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
