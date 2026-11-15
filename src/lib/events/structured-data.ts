import { getEventImageUrl, isEventRasterImage } from '@/lib/events/images.ts';
import { getEventUrl } from '@/lib/events/presentation.ts';
import type { Event } from '@/lib/types/event.ts';

export function getEventStructuredData(event: Event, site: URL): string | undefined {
    const { data } = event;
    const { startDate, venue, publicVenueAddress, city } = data;
    if (data.draft || data.verification?.status !== 'verified' || data.format === 'online' || !startDate || !venue || !publicVenueAddress || !city) {
        return undefined;
    }

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: data.title,
        description: data.description,
        url: new URL(getEventUrl(event), site).href,
        startDate,
        endDate: data.endDate,
        eventStatus: data.cancelled ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
        eventAttendanceMode: data.format === 'hybrid'
            ? 'https://schema.org/MixedEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: venue,
            address: {
                '@type': 'PostalAddress',
                streetAddress: publicVenueAddress.street,
                postalCode: publicVenueAddress.postalCode,
                addressLocality: city,
                addressRegion: data.state,
                addressCountry: data.country,
            },
        },
        image: data.image && isEventRasterImage(data.image)
            ? new URL(getEventImageUrl(data.image, 1200), site).href
            : undefined,
        organizer: data.organizer && {
            '@type': 'Organization',
            name: data.organizer.name,
            url: data.organizer.website,
        },
    };

    return JSON.stringify(structuredData).replaceAll('<', '\\u003c');
}
