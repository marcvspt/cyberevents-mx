import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import type { APIContext } from 'astro';
import { makeEvent } from './fixtures/astro-content.ts';

// Astro resuelve los alias y la colección virtual en el sitio. Node usa las fichas de prueba.
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier === 'astro:content') {
            return nextResolve(new URL('./fixtures/astro-content.ts', import.meta.url).href, context);
        }
        if (specifier.startsWith('@/')) {
            return nextResolve(new URL('../src/' + specifier.slice(2), import.meta.url).href, context);
        }
        return nextResolve(specifier, context);
    },
});

const { getPublishedEvent, getPublishedEventCards } = await import('../src/lib/events/content.ts');
const { matchesEventFilters, readEventFilters } = await import('../src/lib/events/filters.ts');
const { getCfpStatus, getEventRegistration, getEventStatus, getToday, isEventNear, isEventRecent } = await import('../src/lib/events/status.ts');
const { getEventStructuredData } = await import('../src/lib/events/structured-data.ts');
const { GET: getRss } = await import('../src/pages/rss.xml.ts');
const { GET: getEventsSitemap } = await import('../src/pages/sitemap-events.xml.ts');

const site = new URL('https://example.com/');

test('el día cambia a medianoche de Ciudad de México', () => {
    assert.equal(getToday(new Date('2026-11-15T05:59:59Z')), '2026-11-14');
    assert.equal(getToday(new Date('2026-11-15T06:00:00Z')), '2026-11-15');
});

test('el inicio y el fin son inclusivos y prevalece la cancelación', () => {
    const event = makeEvent('evento', { startDate: '2026-11-15', endDate: '2026-11-17' });
    assert.equal(getEventStatus(event, '2026-11-14'), 'upcoming');
    assert.equal(getEventStatus(event, '2026-11-15'), 'ongoing');
    assert.equal(getEventStatus(event, '2026-11-17'), 'ongoing');
    assert.equal(getEventStatus(event, '2026-11-18'), 'finished');
    assert.equal(getEventStatus(makeEvent('sin-fecha'), '2026-11-15'), 'coming-soon');
    assert.equal(getEventStatus(makeEvent('cancelado', { cancelled: true }), '2026-11-15'), 'cancelled');
});

test('el evento a 30 días es cercano y el de 31 días queda en Próximos', () => {
    assert.equal(isEventNear(makeEvent('a-30', { startDate: '2026-12-15' }), '2026-11-15'), true);
    assert.equal(isEventNear(makeEvent('a-31', { startDate: '2026-12-16' }), '2026-11-15'), false);
});

test('el corte de eventos recientes baja al último día del mes y lo excluye', () => {
    const today = '2026-04-30';
    const atCutoff = makeEvent('corte', { startDate: '2026-02-20', endDate: '2026-02-28' });
    const afterCutoff = makeEvent('después', { startDate: '2026-02-20', endDate: '2026-03-01' });
    assert.equal(isEventRecent(atCutoff, today), false);
    assert.equal(isEventRecent(afterCutoff, today), true);
});

test('el CFP incluye el último día y respeta el cierre editorial', () => {
    const cfp = { url: 'https://example.com/cfp', opens: '2026-11-15', closes: '2026-11-20' };
    const event = makeEvent('evento', { cfp });
    assert.equal(getCfpStatus(event, '2026-11-14'), 'announced');
    assert.equal(getCfpStatus(event, '2026-11-15'), 'open');
    assert.equal(getCfpStatus(event, '2026-11-20'), 'open');
    assert.equal(getCfpStatus(event, '2026-11-21'), 'closed');
    assert.equal(getCfpStatus(makeEvent('cierre', { cfp: { ...cfp, status: 'closed' } }), '2026-11-15'), 'closed');
    assert.equal(getCfpStatus(makeEvent('cancelado', { cfp, cancelled: true }), '2026-11-15'), undefined);
});

test('el registro necesita destino y se oculta para eventos finalizados o cancelados', () => {
    const url = 'https://example.com/registro';
    const event = makeEvent('evento', { tickets: url, registrationOpen: true });
    assert.deepEqual(getEventRegistration(event, 'upcoming'), { url, open: true });
    assert.deepEqual(getEventRegistration(event, 'ongoing'), { url, open: true });
    assert.deepEqual(getEventRegistration(makeEvent('sin-confirmar', { tickets: url }), 'upcoming'), { url, open: false });
    assert.equal(getEventRegistration(makeEvent('sin-enlace', { registrationOpen: true }), 'upcoming'), undefined);
    assert.equal(getEventRegistration(event, 'finished'), undefined);
    assert.equal(getEventRegistration(event, 'cancelled'), undefined);
});

test('la búsqueda combina texto sin acentos, categoría, modalidad y año', () => {
    const event = makeEvent('evento', {
        title: 'Ciberseguridad industrial',
        city: 'Querétaro',
        startDate: '2026-11-20',
        categories: ['workshop'],
    });
    const params = new URLSearchParams({ q: '  QUERETARO industrial  ', category: 'workshop', format: 'in-person', year: '2026' });
    const filters = readEventFilters(params, ['2026', '2025']);
    assert.equal(matchesEventFilters(event, filters), true);
    assert.equal(matchesEventFilters(event, { ...filters, year: '2025' }), false);
    assert.equal(matchesEventFilters(event, { ...filters, category: 'conference' }), false);
    assert.equal(matchesEventFilters(event, { ...filters, format: 'online' }), false);
    assert.equal(matchesEventFilters(event, { ...filters, q: 'Mérida' }), false);
    assert.deepEqual(readEventFilters(new URLSearchParams('category=constructor&format=otro&year=2020'), ['2026']), {
        q: '', category: '', format: '', year: '',
    });
});

test('el JSON-LD incluye la dirección pública y solo se emite para fichas elegibles', () => {
    const event = makeEvent('evento', {
        title: 'Encuentro <México>',
        startDate: '2026-11-20',
        venue: 'Centro de convenciones',
        city: 'Ciudad de México',
        publicVenueAddress: { street: 'Calle del Centro 15', postalCode: '06700' },
        verification: { status: 'verified', sources: ['https://example.com/organizador'], checkedAt: '2026-11-15' },
    });
    const json = getEventStructuredData(event, site);
    assert.ok(json);
    assert.equal(json.includes('<'), false);
    const data = JSON.parse(json);
    assert.equal(data.name, event.data.title);
    assert.equal(data.url, 'https://example.com/events/evento/');
    assert.equal(data.location.address.postalCode, '06700');
    assert.equal(getEventStructuredData(makeEvent('borrador', { ...event.data, draft: true }), site), undefined);
    assert.equal(getEventStructuredData(makeEvent('virtual', { ...event.data, format: 'online' }), site), undefined);
    assert.equal(getEventStructuredData(makeEvent('sin-sede', { ...event.data, publicVenueAddress: undefined }), site), undefined);
});

test('la ficha y las tarjetas excluyen IDs de borradores', async () => {
    assert.equal((await getPublishedEvent('evento-publicado'))?.id, 'evento-publicado');
    assert.equal(await getPublishedEvent('evento-borrador'), undefined);
    assert.equal(await getPublishedEvent('desconocido'), undefined);
    assert.deepEqual((await getPublishedEventCards()).map(({ event }) => event.id), ['evento-publicado']);
});

test('RSS y sitemap incluyen fichas públicas y excluyen borradores', async () => {
    const context = { site } as APIContext;
    const [rss, sitemap] = await Promise.all([getRss(context), getEventsSitemap(context)]);
    for (const response of [rss, sitemap]) {
        assert.equal(response.status, 200);
        const xml = await response.text();
        assert.ok(xml.includes('/events/evento-publicado/'));
        assert.equal(xml.includes('/events/evento-borrador/'), false);
    }
});
