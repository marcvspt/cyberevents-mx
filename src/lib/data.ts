import { TEXTS_GENERAL } from '@/lib/texts.ts';

export { SITE_DATA } from '@/lib/site.ts';

export const SITE_PAGES = {
    Home: { ...TEXTS_GENERAL.pages.Home, url: '/' },
    Events: { ...TEXTS_GENERAL.pages.Events, url: '/events' },
    About: { ...TEXTS_GENERAL.pages.About, url: '/about' },
    Archive: { ...TEXTS_GENERAL.pages.Archive, url: '/events/archive/' },
};

export const currentYear = new Date().getFullYear();

export const EXTERNAL_RESOURCES = [
    {
        name: TEXTS_GENERAL.externalResources.developer,
        url: 'https://www.marcvspt.tech/',
    },
    {
        name: TEXTS_GENERAL.externalResources.cyberThreat,
        url: 'https://ctai.marcvspt.tech/',
    },
];
