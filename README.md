# CyberEvents.MX

Directorio y archivo histórico de eventos de ciberseguridad en México. La intención del producto está en `DATA.md`; las fechas mencionadas allí necesitan confirmación antes de publicarse.

## Tecnología y despliegue

Astro 7.3.5, TypeScript, Tailwind CSS 4.3.3 y `@tailwindcss/typography` 0.5.20. Usa `output: 'server'` con el adaptador de Netlify 8.2.6. Inicio, Eventos, Archivo y fichas generan HTML por petición (SSR); acerca de, RSS, robots y el sitemap de fichas se generan durante el build. No requiere base de datos. El dominio se define únicamente en la propiedad `site` de `astro.config.mjs`. Las páginas lo obtienen mediante `Astro.site` y las rutas mediante `context.site`; canónicas, RSS y robots requieren esa configuración. `src/lib/texts.ts` centraliza los textos en español en `TEXTS_GENERAL`; `src/lib/site.ts` combina los textos de marca con la ruta opcional del logo, y `src/lib/data.ts` combina los textos de las páginas con sus rutas y reexporta los datos del sitio.

## Estados por petición

Los estados, la cercanía, el archivo y el CFP se calculan con el día de `America/Mexico_City` al atender cada petición. `src/middleware.ts` envía `Cache-Control: private, no-store` en inicio y eventos para evitar estados antiguos en caché. Al pasar los días, los eventos cambian de sección en la siguiente petición; una página ya abierta requiere recargarse o navegar de nuevo.

No hace falta una tarea diaria ni un build hook. Se retiró la función programada de actualización. Si la habías activado en Netlify, elimina su hook y variable privados cuando publiques esta versión. `netlify.toml` conserva el comando de build y el directorio de publicación.

La colección usa `glob`: los Markdown se incorporan durante el build. Añadir, editar o eliminar fichas e imágenes sigue requiriendo build y despliegue. SSR actualiza su clasificación temporal, no carga archivos nuevos del repositorio en producción.

## Estructura

- `src/content.config.ts`: esquema de la colección `events`.
- `src/data/events/`: fichas Markdown.
- `src/lib/event.ts`: selección de publicados, URL, fechas, estados, cercanía, archivo por año y CFP.
- `src/components/EventCard.astro`: tarjeta compartida entre inicio y catálogo.
- `src/components/EventVisual.astro`: imagen oficial o ilustración SVG compartida entre tarjetas y fichas.
- `src/layouts/EventSummaryLayout.astro`: ficha y recursos del evento.
- `src/pages/events/index.astro`: sección Eventos: encuentros cercanos, próximos, sin fecha, recientes y cancelados.
- `src/pages/events/archive/index.astro`: eventos pasados agrupados por año en `/events/archive/`.
- `src/pages/events/[...slug].astro`: fichas SSR de eventos publicados; devuelve 404 para IDs desconocidos o borradores.
- `src/pages/rss.xml.ts`: RSS en `/rss.xml`, ordenado por última actualización editorial (`updateAt`).
- `src/styles/global.css`: Tailwind y tipografía Markdown.
- `public/`: recursos públicos.
- `public/img/events/shared/`: identidad visual reutilizable entre ediciones.
- `netlify.toml`: build y directorio de publicación de Netlify.
- `src/middleware.ts`: política de caché de las páginas con estados temporales.
- `src/pages/sitemap-events.xml.ts`: sitemap estático de fichas publicadas, incluidas las rutas SSR.
- `src/pages/404.astro`: página para rutas inexistentes y borradores.

Se mantienen las rutas existentes `/events/` y `/about`, con el archivo histórico en `/events/archive/`. La configuración utiliza `integrations: [sitemap()]` para generar `/sitemap-index.xml` y el sitemap de páginas de ruta fija. Robots y `BaseLayout.astro` apuntan a ese índice; el enlace del layout solo lo anuncia, no lo genera ni añade otros sitemaps. `/sitemap-events.xml` se genera por separado y enumera las fichas publicadas, con `updateAt` como `lastmod`. Actualmente no está registrado en el índice ni en robots: la integración no descubre automáticamente las rutas SSR con parámetros ni incorpora este XML sin configuración adicional.

## Publicar un evento

La carga inicial revisada el 5 de octubre de 2026 contiene 43 fichas reales o candidatas: 35 están habilitadas para publicación y 8 permanecen como borradores. Las fuentes y la fecha de revisión están en el frontmatter de cada ficha. HACKMEX tiene fichas separadas para clasificatoria y final; 8.8 tiene una por ciudad.

El archivo incluye HackGDL e Infosecurity Mexico de 2024; HackGDL, Infosecurity Mexico, FIRST MX y Security BSides CDMX de 2025. Es una selección inicial, no un registro exhaustivo. Las fechas de cada ficha se contrastaron con sitios o documentos oficiales.

Los borradores pendientes son FIRST MX 2027, HackGDL 2027, Cyber Range 2026, BugCON 2026, Segurinfo México, Cybersecurity Week 2026, Inception 2026 y el Foro Internacional de Seguridad y Justicia. El cuerpo de cada archivo explica qué debe confirmarse. En algunos borradores la modalidad es provisional porque el esquema la requiere: confírmala antes de publicar. No confundir un anuncio sin fecha con información verificada de sede o modalidad.

Crea un Markdown en `src/data/events/`, usando el ejemplo de abajo como plantilla. El nombre comienza por el año de celebración: `2027-nombre-evento.md` genera la URL `/events/2027-nombre-evento/`. Completa la información y el cuerpo Markdown, verifica los datos oficiales y cambia `draft` a `false` cuando esté listo.

Usa `YYYY-nombre` para una edición anual. Para varias ediciones del mismo evento en el año, usa `YYYY-MM-nombre`, y añade el día (`YYYY-MM-DD-nombre`) si hace falta distinguirlas dentro del mes. Para ciudades o fases distintas, conserva un sufijo descriptivo: `2026-8-8-unreal-cdmx` o `2026-hackmex-final`. Las fechas exactas permanecen en `startDate` y `endDate`; no hacen falta en el nombre cuando ya es único. Sin año confirmado, conserva el nombre sin prefijo, como `segurinfo-mexico.md`, hasta verificar la edición.

Las imágenes específicas de una edición comparten el nombre base del Markdown, con su extensión real: `2026-cybermid.md` y `/img/events/2026-cybermid.webp`. Las marcas e ilustraciones reutilizables se guardan en `public/img/events/shared/`, por ejemplo `shared/hackgdl.png`, y pueden ser referenciadas por varias fichas. Renombrar una extensión no convierte el formato de la imagen.

Las tarjetas, RSS, canónicas y sitemap utilizan los IDs con el año al inicio. Al renombrar una ficha, actualiza sus enlaces internos. No se conservan redirecciones de los nombres anteriores.

No uses `archive` ni nombres bajo `archive/` como ID de una ficha: están reservados para las páginas del archivo.

Ejemplo ficticio con fechas anunciadas (mantener como borrador):

```yaml
---
title: 'Conferencia de ejemplo 2027'
description: 'Descripción breve del evento.'
updateAt: '2026-10-05'
startDate: '2027-06-16'
endDate: '2027-06-17'
city: 'Ciudad de México'
country: MX
format: in-person
categories: [conference]
topics: [appsec, blue-team]
price:
  type: unknown
hashtags: [EventoEjemplo]
verification:
  status: unconfirmed
draft: true
---
```

Campos obligatorios: `title`, `description`, `updateAt`, `format` y al menos una categoría. `format` acepta `in-person`, `online` o `hybrid`. Categorías: `conference`, `congress`, `meetup`, `ctf`, `bsides`, `workshop`, `summit`, `forum`, `academic`, `community`. Los temas son etiquetas libres.

Las fechas son cadenas `YYYY-MM-DD` entre comillas. Omite campos desconocidos; no uses `null`. Sin `startDate`, la ficha muestra «Próximamente / Fecha por anunciar». `endDate` requiere un inicio y no puede precederlo; si se omite, se considera un evento de un día. Cada edición puede tener su propio archivo para conservar el histórico.

Otros campos opcionales:

| Campo | Uso |
| --- | --- |
| `edition`, `city`, `state`, `venue` | Edición y sede, sin asumir información no anunciada. |
| `website`, `tickets` | URL HTTP/HTTPS del sitio oficial y registro. |
| `price` | `type`: `free`, `paid` o `unknown`; importe opcional `amount` y moneda `currency` (MXN por defecto). |
| `organizer` | `name` y `website` opcional. |
| `registrationOpen`, `cancelled` | Indicadores editoriales, falsos por defecto. |
| `cfp` | `url`, `opens`, `closes` y `status` opcional: `announced`, `open` o `closed`. |
| `social` | URL oficiales en `x`, `instagram`, `linkedin`, `youtube`. |
| `hashtags` | Etiquetas sin `#` ni espacios; generan enlaces de búsqueda en X, Instagram, YouTube y LinkedIn. Si faltan hashtags, el CTA del aside busca el nombre del evento en X, Instagram, YouTube y LinkedIn, sin inventar etiquetas. |
| `resources` | URL en `photos`, `videos`, `slides`, `aftermovie`. Se muestran cuando existen. |
| `verification` | `status`: `verified`, `needs-verification` o `unconfirmed`; `checkedAt` y `sources`. |
| `image`, `imageAlt` | Ruta local desde `public/` y texto alternativo para tarjetas y fichas. |
| `featured` | Metadata reservada; todavía no determina la selección de destacados. |
| `draft` | Borrador, falso por defecto. |

Para marcar un evento como `verified`, incluye fecha de revisión y al menos una fuente oficial en `sources`. No copies fechas dudosas de agregadores o de `DATA.md` como confirmadas.

Guarda las imágenes en `public/img/events/` con el nombre de la ficha o en `shared/` si son reutilizables. Usa rutas como `/img/events/2026-cybermid.webp` o `/img/events/shared/hackgdl.png`. `imageAlt` permite describirlas. Si no hay imagen adecuada, `EventVisual.astro` muestra una ilustración de ciberseguridad. Conserva las marcas originales y evita reutilizar carteles fechados para otra edición. Las tarjetas llevan a la ficha; el CTA «Busca el evento en redes» está en su aside y reúne los enlaces de búsqueda.

El estado general se calcula a partir de las fechas y `cancelled`. El registro abierto se muestra como indicador adicional en tarjetas futuras o sin fecha. El CFP respeta un cierre editorial explícito, cierra después de `closes` y abre desde `opens`; antes de la apertura aparece por anunciar. Sin `opens`, utiliza su estado editorial o por anunciar. El último día se incluye. Una cancelación oculta el CFP.

Los borradores validan el esquema, pero quedan fuera del inicio, catálogo, fichas públicas, RSS y sitemap. Acceder al ID de un borrador devuelve 404. `updateAt` es la última actualización editorial de la ficha y alimenta el orden y la fecha del RSS, aunque el evento todavía no tenga fecha. Las URL de tarjetas, RSS y canónicas usan `getEventUrl`.

El inicio muestra hasta seis eventos próximos o en curso. La sección Eventos (`/events/`) muestra primero «En curso y muy pronto»: eventos en marcha o que comienzan en los próximos 30 días, incluyendo el día límite. A continuación aparecen «Próximos», con inicio posterior a ese plazo, «Fechas por anunciar», «Descubre cómo fue» y «Cancelados». «Descubre cómo fue» conserva los finalizados hace menos de dos meses de calendario, ordenados por fecha de finalización descendente. `isEventRecent` usa `endDate` o `startDate`, excluye la fecha límite exacta y ajusta al último día del mes si corresponde. Estos eventos también permanecen en el archivo. Las secciones sin eventos se ocultan. La cercanía se define en `NEAR_EVENT_DAYS` y `isEventNear`, en `src/lib/event.ts`, y se calcula por petición con días de calendario de `America/Mexico_City`.

Los eventos finalizados están en `/events/archive/`, agrupados por el año de inicio, con los años y las fechas más recientes primero. Un evento que cruza de año pertenece al año de `startDate`. El archivo tiene enlaces para saltar a cada año y usa las mismas tarjetas. Se accede desde Eventos y la navegación principal. Todavía no hay filtros interactivos ni relaciones automáticas entre ediciones.

## Editar la interfaz

La UI es exclusivamente oscura, con azul y turquesa como acentos. Los colores se editan en `@theme` de `src/styles/global.css`, con nombres semánticos como `--color-primary`, `--color-secondary`, `--color-background` y `--color-surface`. Los componentes consumen esas utilidades de Tailwind. No hay selector de tema ni depende del tema del sistema. `BaseLayout.astro` usa utilidades de Tailwind para el esquema oscuro, fondo, tipografía, selección y scroll con reducción de movimiento. El Markdown conserva `prose prose-invert` y usa modificadores `prose-*` para el blanco y los enlaces. `global.css` mantiene el gradiente radial, los patrones compartidos mediante `@apply`, el foco de teclado y la desactivación global de animaciones y transiciones cuando se solicita movimiento reducido.

Edita `TEXTS_GENERAL` en `src/lib/texts.ts` para cambiar los textos de inicio, Eventos, archivo, acerca de, 404, tarjetas, fichas, navegación y pie. El mismo objeto contiene `pages` (títulos y descripciones de las páginas), `site` (nombre y descripción globales), `externalResources` (etiquetas de enlaces), `validation` y `errors` (mensajes propios de validación y configuración). `locale` centraliza el idioma del HTML, RSS, fechas y ordenación alfabética. Es una base para i18n futuro; todavía no hay selector, diccionarios por idioma ni rutas localizadas. `SITE_PAGES` y `SITE_DATA` consumen estos textos y conservan las rutas y configuración en `data.ts` y `site.ts`. Los títulos, descripciones y cuerpos de los eventos siguen en `src/data/events/`. La sección `/events/` se llama «Eventos» en navegación, breadcrumbs y acciones; conserva ese nombre. El footer muestra marca y descripción a la izquierda con su estilo original, espacio central vacío en escritorio y Recursos Externos a la derecha y una franja inferior centrada con el año y el texto del proyecto. En móvil las secciones siguen el flujo vertical. Sus enlaces se editan en `EXTERNAL_RESOURCES` dentro de `src/lib/data.ts` y abren en otra pestaña. El footer no muestra enlace RSS; `/rss.xml` sigue disponible.

Para sustituir escudo y texto por un logo horizontal, guarda el archivo en `public/img/` y asigna su ruta a `SITE_DATA.logo`, por ejemplo `/img/logo.svg`. La cabecera reserva 36 px de alto y hasta 200 px de ancho, mantiene la proporción y usa el nombre de marca como texto alternativo. Se recomienda SVG transparente o PNG de 400 × 72 px. Mientras `logo` esté vacío, se conserva la marca actual.

`Header.astro`, `Footer.astro` y `EventCard.astro` comparten el estilo entre vistas. El catálogo incluye enlaces a cada sección; son navegación por anclas, no filtros interactivos. Se incluye foco visible, enlace para saltar al contenido y respeto a la preferencia de movimiento reducido.

Se eliminaron los textos decorativos de entrada (eyebrows). Cada ficha comienza con Inicio / Eventos o Archivo / título, seguido de su estado y categorías. El texto es blanco puro; tamaños y pesos distinguen títulos, descripciones y metadata. Los enlaces y etiquetas mantienen los acentos azul y turquesa.

En cada ficha, el bloque de título y descripción está por encima de la cuadrícula. El aside empieza a la altura de la imagen y permanece visible al desplazarse en escritorio mediante `sticky`. Su altura se ajusta al viewport y admite scroll interno; en móvil aparece debajo del contenido. Los enlaces externos abren otra pestaña con `target="_blank"` y `rel="noopener noreferrer"`. Los del cuerpo Markdown reciben esos atributos mediante el script de la plantilla, también al navegar con `ClientRouter`; la navegación interna permanece en la misma pestaña.

Para revisar este comportamiento, comprueba una ficha larga y otra corta, el aside en escritorio y móvil, una pantalla baja y la navegación por teclado. Revisa un enlace externo del Markdown y los enlaces de registro, redes, recursos y sitio oficial después de navegar entre fichas.

## Migración futura a Node

La lógica de eventos y la política HTTP de caché no dependen de Netlify. Para migrar, el propietario debe ejecutar `pnpm add @astrojs/node` desde la raíz y sustituir el adaptador en `astro.config.mjs`:

```js
import node from '@astrojs/node';
// Dentro de defineConfig, manteniendo output: 'server':
adapter: node({ mode: 'standalone' }),
```

Después, el propietario ejecuta `pnpm build` y arranca el servidor con `node ./dist/server/entry.mjs`. Configura dominio, HTTPS y proceso persistente en el alojamiento elegido. Esta migración no está aplicada; el adaptador actual sigue siendo Netlify. Consulta el [adaptador oficial de Node](https://docs.astro.build/en/guides/integrations-guide/node/).

## Comandos y validación

El propietario ejecuta todos los comandos de pnpm desde `C:\Users\marco\Desktop\Dev\cyberevents-mx`. Los agentes no ejecutan estos comandos ni sus equivalentes con otras herramientas.

| Comando | Propósito |
| --- | --- |
| `pnpm install` | Instalar las dependencias del proyecto cuando sea necesario. |
| `pnpm dev` | Abrir el servidor de desarrollo para revisar las vistas. |
| `pnpm build` | Validar contenido, salida del servidor, páginas prerenderizadas, RSS y sitemaps y producir `dist/`. |
| `pnpm preview` | Revisar localmente el resultado del build. |

Revisa inicio, Eventos, Archivo, acerca de y una ficha en móvil y escritorio, incluyendo navegación por teclado, botones y contraste. Comprueba que un evento en curso o a 30 días aparezca en la primera sección y uno a 31 días en «Próximos», sin duplicados. Todos los finalizados deben aparecer en el archivo por año de inicio, incluidos 2024 y 2025. Los que terminaron hace menos de dos meses deben aparecer también en «Descubre cómo fue»; los de la fecha de corte exacta y anteriores, solo en el archivo. Revisa imágenes, alternativa SVG y búsquedas de conversación, incluido LinkedIn. Comprueba una ficha pasada con recursos, BSides CDMX 2027 con su CFP y León Cybersecurity Conference sin fecha. Para probar otros estados con el ejemplo, modifica una copia de forma local, publícala temporalmente y revisa rango de fechas, cancelación y recursos. Retira el contenido ficticio antes de desplegar.

Comprueba también breadcrumbs, estado y categorías sobre el título, el texto blanco en tarjetas y Markdown, 404 para IDs desconocidos y borradores, y ambos sitemaps: `/sitemap-index.xml` para páginas de ruta fija y `/sitemap-events.xml` para fichas sin borradores. No se espera que el índice incluya el sitemap de fichas con la configuración actual. En un despliegue de Netlify, verifica la cabecera `Cache-Control` de inicio y eventos.

El build y la revisión visual de esta adaptación están pendientes de ejecución por el propietario. No hay script de pruebas ni `@astrojs/check` configurado en `package.json`. No edites `dist/`, `.astro/` ni `node_modules/`.
