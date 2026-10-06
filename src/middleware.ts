import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url }, next) => {
    const response = await next();
    if (url.pathname === '/' || url.pathname === '/events' || url.pathname.startsWith('/events/')) {
        response.headers.set('Cache-Control', 'private, no-store');
    }
    return response;
});
