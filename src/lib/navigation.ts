import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { LinkItem, SitePage } from '@/lib/types/site.ts';

export const SITE_PAGES = {
    Home: { id: 'home', label: TEXTS_GENERAL.navigation.home, href: '/', ...TEXTS_GENERAL.pages.Home },
    Events: { id: 'events', label: TEXTS_GENERAL.navigation.events, href: '/events', ...TEXTS_GENERAL.pages.Events },
    About: { id: 'about', label: TEXTS_GENERAL.navigation.about, href: '/about', ...TEXTS_GENERAL.pages.About },
    Archive: { id: 'archive', label: TEXTS_GENERAL.navigation.archive, href: '/events/archive/', ...TEXTS_GENERAL.pages.Archive },
} satisfies Record<'Home' | 'Events' | 'About' | 'Archive', SitePage>;

export const MAIN_NAVIGATION: LinkItem[] = [
    SITE_PAGES.Home,
    SITE_PAGES.Events,
    SITE_PAGES.Archive,
    SITE_PAGES.About,
];
