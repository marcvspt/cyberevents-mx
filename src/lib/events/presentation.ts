import { SITE_LOCALE } from '@/lib/site.ts';
import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { Event, EventStatus } from '@/lib/types/event.ts';

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = TEXTS_GENERAL.event.statusLabels;

export function getEventUrl(event: Pick<Event, 'id'>): string {
    return `/events/${event.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function formatEventDate(value: string): string {
    return new Intl.DateTimeFormat(SITE_LOCALE.date, {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`));
}
