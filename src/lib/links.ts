import { TEXTS_GENERAL } from '@/lib/texts.ts';
import type { LinkItem } from '@/lib/types/site.ts';

export const EXTERNAL_RESOURCES: LinkItem[] = [
    {
        id: 'developer',
        label: TEXTS_GENERAL.externalResources.developer,
        href: 'https://www.marcvspt.tech/',
    },
    {
        id: 'cyber-threat',
        label: TEXTS_GENERAL.externalResources.cyberThreat,
        href: 'https://ctai.marcvspt.tech/',
    },
];

export const LICENSE_LINK: LinkItem = {
    id: 'license',
    label: TEXTS_GENERAL.footer.licenseName,
    href: 'https://github.com/marcvspt/cyberevents-mx/blob/master/LICENSE',
};

export const SUPPORT_LINKS: LinkItem[] = [
    {
        id: 'buy-me-a-coffee',
        label: TEXTS_GENERAL.support.buyMeACoffee,
        href: 'https://buymeacoffee.com/marcvspt',
    },
    {
        id: 'github-sponsors',
        label: TEXTS_GENERAL.support.githubSponsors,
        href: 'https://github.com/sponsors/marcvspt',
    },
];
