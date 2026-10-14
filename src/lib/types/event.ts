import type { CollectionEntry } from 'astro:content';

export type Event = CollectionEntry<'events'>;
export type EventStatus = 'coming-soon' | 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
export type CfpStatus = 'open' | 'closed' | 'announced';

export interface EventCardData {
    event: Event;
    url: string;
    status: EventStatus;
    cfpStatus: CfpStatus | undefined;
    isNear: boolean;
    isRecent: boolean;
}

export interface ArchivedEventGroup {
    year: string;
    cards: EventCardData[];
}
