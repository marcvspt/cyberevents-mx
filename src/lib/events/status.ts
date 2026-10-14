import { SITE_LOCALE } from '@/lib/site.ts';
import type { CfpStatus, Event, EventStatus } from '@/lib/types/event.ts';

export const NEAR_EVENT_DAYS = 30;
export const RECENT_EVENT_MONTHS = 2;

export function getToday(date = new Date()): string {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: SITE_LOCALE.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
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

export function getCfpStatus(event: Event, today = getToday()): CfpStatus | undefined {
    const cfp = event.data.cfp;
    if (!cfp || event.data.cancelled) return undefined;
    if (cfp.status === 'closed' || (cfp.closes && today > cfp.closes)) return 'closed';
    if (cfp.opens && today < cfp.opens) return 'announced';
    if (cfp.opens) return 'open';
    return cfp.status ?? 'announced';
}
