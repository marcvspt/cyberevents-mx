import { TEXTS_GENERAL } from '@/lib/texts.ts';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

import { glob } from 'astro/loaders';

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, TEXTS_GENERAL.validation.dateFormat).refine(
    (value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    },
    TEXTS_GENERAL.validation.calendarDate,
);
const webUrl = z.string().url().refine((value) => /^https?:\/\//.test(value), TEXTS_GENERAL.validation.webUrl);

const events = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/data/events" }),
    schema: z.object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        updateAt: calendarDate,
        edition: z.number().int().positive().optional(),
        startDate: calendarDate.optional(),
        endDate: calendarDate.optional(),
        city: z.string().trim().min(1).optional(),
        state: z.string().trim().min(1).optional(),
        country: z.literal('MX').default('MX'),
        venue: z.string().trim().min(1).optional(),
        format: z.enum(['in-person', 'online', 'hybrid']),
        categories: z.array(z.enum(['conference', 'congress', 'meetup', 'ctf', 'bsides', 'workshop', 'summit', 'forum', 'academic', 'community'])).min(1),
        topics: z.array(z.string().trim().min(1)).default([]),
        price: z.object({
            type: z.enum(['free', 'paid', 'unknown']),
            amount: z.number().nonnegative().optional(),
            currency: z.string().regex(/^[A-Z]{3}$/).default('MXN'),
        }).optional(),
        website: webUrl.optional(),
        tickets: webUrl.optional(),
        registrationOpen: z.boolean().default(false),
        cancelled: z.boolean().default(false),
        cfp: z.object({
            url: webUrl,
            status: z.enum(['open', 'closed', 'announced']).optional(),
            opens: calendarDate.optional(),
            closes: calendarDate.optional(),
        }).refine((cfp) => !cfp.opens || !cfp.closes || cfp.closes >= cfp.opens, TEXTS_GENERAL.validation.cfpDates).optional(),
        social: z.object({
            x: webUrl.optional(),
            instagram: webUrl.optional(),
            linkedin: webUrl.optional(),
            youtube: webUrl.optional(),
        }).optional(),
        hashtags: z.array(z.string().regex(/^[\p{L}\p{N}_]+$/u, TEXTS_GENERAL.validation.hashtag)).default([]),
        resources: z.object({
            photos: webUrl.optional(),
            videos: webUrl.optional(),
            slides: webUrl.optional(),
            aftermovie: webUrl.optional(),
        }).optional(),
        organizer: z.object({ name: z.string().trim().min(1), website: webUrl.optional() }).optional(),
        verification: z.object({
            status: z.enum(['verified', 'needs-verification', 'unconfirmed']),
            checkedAt: calendarDate.optional(),
            sources: z.array(webUrl).default([]),
        }).refine((verification) => verification.status !== 'verified' || (!!verification.checkedAt && verification.sources.length > 0), TEXTS_GENERAL.validation.verification).optional(),
        image: z.string().refine((value) => value.startsWith('/') && !value.startsWith('//'), TEXTS_GENERAL.validation.image).optional(),
        imageAlt: z.string().trim().min(1).optional(),
        featured: z.boolean().optional().default(false),
        draft: z.boolean().optional().default(false),
    }).refine((event) => !event.endDate || (!!event.startDate && event.endDate >= event.startDate), TEXTS_GENERAL.validation.eventDates),
});

export const collections = { events };
