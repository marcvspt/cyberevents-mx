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

export const CONTACT_LINK: LinkItem = {
    id: 'contact',
    label: TEXTS_GENERAL.footer.contact,
    href: 'https://github.com/marcvspt/adventsec-issues',
};
