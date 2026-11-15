import type { Event } from '../../src/lib/types/event.ts';

export function makeEvent(id: string, data: Partial<Event['data']> = {}): Event {
    return {
        id,
        collection: 'events',
        data: {
            title: id,
            description: 'Ficha de prueba',
            updatedAt: '2026-11-15',
            format: 'in-person',
            categories: ['conference'],
            country: 'MX',
            topics: [],
            hashtags: [],
            registrationOpen: false,
            cancelled: false,
            featured: false,
            draft: false,
            ...data,
        },
    };
}

const fixtures = [
    makeEvent('evento-publicado', { startDate: '2026-11-20' }),
    makeEvent('evento-borrador', { startDate: '2026-11-19', draft: true }),
];

export async function getCollection(_collection: 'events', filter: (event: Event) => boolean): Promise<Event[]> {
    return fixtures.filter(filter);
}
