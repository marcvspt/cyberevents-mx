import { SITE_LOCALE } from '@/lib/site.ts';
import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { Event } from '@/lib/types/event.ts';

export const EVENT_SEARCH_MAX_LENGTH = 100;

export interface EventFilters {
    q: string;
    category: string;
    format: string;
    year: string;
}

export function readEventFilters(params: URLSearchParams, years: readonly string[] = []): EventFilters {
    const q = (params.get('q') ?? '').slice(0, EVENT_SEARCH_MAX_LENGTH).trim();
    const category = params.get('category') ?? '';
    const format = params.get('format') ?? '';
    const year = params.get('year') ?? '';
    return {
        q,
        category: Object.hasOwn(TEXTS_GENERAL.event.categories, category) ? category : '',
        format: Object.hasOwn(TEXTS_GENERAL.event.formats, format) ? format : '',
        year: years.includes(year) ? year : '',
    };
}

function normalizeSearch(value: string): string {
    return value.toLocaleLowerCase(SITE_LOCALE.sort).normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function matchesEventFilters({ data }: Event, filters: EventFilters): boolean {
    if (filters.category && !data.categories.some((category) => category === filters.category)) return false;
    if (filters.format && data.format !== filters.format) return false;
    if (filters.year && data.startDate?.slice(0, 4) !== filters.year) return false;
    if (!filters.q) return true;

    const text = normalizeSearch([data.title, data.city].filter(Boolean).join(' '));
    return normalizeSearch(filters.q).split(/\s+/).every((term) => text.includes(term));
}
