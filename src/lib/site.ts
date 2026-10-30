import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { SiteData } from '@/lib/types/site.ts';

export const SITE_DATA: SiteData = {
    ...TEXTS_GENERAL.site,
    logo: '/img/logo.svg',
};

export const SITE_LOCALE = {
    html: 'es',
    date: 'es-MX',
    sort: 'es',
    rss: 'es-mx',
    timeZone: 'America/Mexico_City',
} as const;
