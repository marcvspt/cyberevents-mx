# CyberEvents.MX

Directorio y archivo histórico de eventos de ciberseguridad en México. La intención del producto está en `DATA.md`; las fechas mencionadas allí necesitan confirmación antes de publicarse.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para preparar contribuciones de código o fichas de eventos y seguir la convención de mensajes de commit.

## Tecnología y despliegue

Astro 7.3.5, TypeScript, Tailwind CSS 4.3.3 y `@tailwindcss/typography` 0.5.20. Usa `output: 'server'` con el adaptador de Netlify 8.2.6. Inicio, Eventos, Archivo y fichas generan HTML por petición (SSR); acerca de, RSS, robots y el sitemap de fichas se generan durante el build. No requiere base de datos. El dominio se define únicamente en la propiedad `site` de `astro.config.mjs`. Las páginas lo obtienen mediante `Astro.site` y las rutas mediante `context.site`; canónicas, RSS y robots requieren esa configuración. `src/lib/texts.ts` centraliza los textos en español en `TEXTS_GENERAL`; `src/lib/site.ts` configura la marca, el logo y el idioma; `src/lib/navigation.ts` define páginas y navegación; `src/lib/links.ts` define los enlaces externos. Cada consumidor importa el módulo concreto.

## Estados por petición

Los estados, la cercanía, el archivo y el CFP se calculan con el día de `America/Mexico_City` al atender cada petición. `src/middleware.ts` envía `Cache-Control: private, no-store` en inicio y eventos para evitar estados antiguos en caché. Al pasar los días, los eventos cambian de sección en la siguiente petición; una página ya abierta requiere recargarse o navegar de nuevo.

No hace falta una tarea diaria ni un build hook. Se retiró la función programada de actualización. Si la habías activado en Netlify, elimina su hook y variable privados cuando publiques esta versión. `netlify.toml` conserva el comando de build y el directorio de publicación.

La colección usa `glob`: los Markdown se incorporan durante el build. Añadir, editar o eliminar fichas e imágenes sigue requiriendo build y despliegue. SSR actualiza su clasificación temporal, no carga archivos nuevos del repositorio en producción.

## Estructura

- `src/content.config.ts`: esquema de la colección `events`.
- `src/data/events/`: fichas Markdown.
- `src/lib/texts.ts`: textos de interfaz, accesibilidad, metadatos y mensajes, agrupados por sección.
- `src/lib/site.ts`: `SITE_DATA` (marca y logo) y `SITE_LOCALE` (idioma y zona horaria), sin duplicar el dominio de Astro.
- `src/lib/navigation.ts`: `SITE_PAGES` y `MAIN_NAVIGATION`.
- `src/lib/links.ts`: recursos externos y enlace de licencia.
- `src/lib/types/site.ts`: contratos de enlaces (`id`, `label`, `href`), metadatos (`title`, `description`) y marca.
- `src/lib/types/event.ts`: tipos derivados de la colección y datos de tarjetas y archivo.
- `src/lib/events/content.ts`: selección de publicados, datos de tarjetas y archivo por año.
- `src/lib/events/status.ts`: estados, cercanía, ventana de eventos recientes y CFP.
- `src/lib/events/presentation.ts`: URL de fichas, etiquetas de estado y formato de fechas.
- `src/components/EventCard.astro`: tarjeta compartida entre inicio y catálogo.
- `src/components/EventVisual.astro`: imagen oficial o ilustración SVG compartida entre tarjetas y fichas.
- `src/layouts/EventSummaryLayout.astro`: ficha y recursos del evento.
- `src/pages/events/index.astro`: sección Eventos: cercanos, próximos, sin fecha, recientes y cancelados.
- `src/pages/events/archive/index.astro`: eventos pasados agrupados por año en `/events/archive/`.
- `src/pages/events/[...slug].astro`: fichas SSR de eventos publicados; devuelve 404 para IDs desconocidos o borradores.
- `src/pages/rss.xml.ts`: RSS en `/rss.xml`, ordenado por última actualización editorial (`updatedAt`).
- `src/styles/global.css`: Tailwind y tipografía Markdown.
- `public/`: recursos públicos.
- `public/img/events/shared/`: identidad visual reutilizable entre ediciones.
- `netlify.toml`: build y directorio de publicación de Netlify.
- `src/middleware.ts`: política de caché de las páginas con estados temporales.
- `src/pages/sitemap-events.xml.ts`: sitemap estático de fichas publicadas, incluidas las rutas SSR.
- `src/pages/404.astro`: página para rutas inexistentes y borradores.

Se mantienen las rutas existentes `/events/` y `/about`, con el archivo histórico en `/events/archive/`. La integración `@astrojs/sitemap` genera `/sitemap-index.xml` y el sitemap de páginas de ruta fija. `/sitemap-events.xml` se genera por separado y enumera las fichas publicadas, con `updatedAt` como `lastmod`; se registra en el índice mediante `customSitemaps`, usando el dominio de `site`. Robots y `BaseLayout.astro` anuncian el índice, que permite descubrir ambos sitemaps. La integración no enumera por sí sola las fichas SSR con parámetros. Consulta la [opción oficial customSitemaps](https://docs.astro.build/en/guides/integrations-guide/sitemap/#customsitemaps).

## Publicar un evento

La colección contiene 56 fichas habilitadas para publicación. La revisión editorial del 18 de octubre de 2026 añade cinco encuentros de CISOCLUB, incluido TechSummit 2027, y corrige el inicio de MCyRA 2026 al 10 de noviembre. También revisa Hacktitud Summit, OEA Cyber Challenge México, Cybersecurity Week, Mexico Cybersecurity Summit y BSides Querétaro. Consulta [las fuentes y los enlaces de imágenes de esta revisión](docs/investigacion-eventos-2026-10-18.md). Las cinco fichas nuevas omiten `image` y usan la ilustración predeterminada; las imágenes existentes se conservan. Las fuentes y la fecha de revisión están en el frontmatter de cada ficha. HACKMEX tiene fichas separadas para clasificatoria y final; 8.8 tiene una por ciudad.

El archivo incluye HackGDL e Infosecurity Mexico de 2024; HackGDL, Infosecurity Mexico, FIRST MX y Security BSides CDMX de 2025. Es una selección inicial, no un registro exhaustivo. Las fechas de cada ficha se contrastaron con sitios o documentos oficiales.

Actualmente no hay fichas con `draft: true`. Para preparar nuevas candidatas, conserva ese indicador hasta confirmar la información necesaria para publicarlas. No confundir un anuncio sin fecha con información verificada de sede o modalidad.

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
updatedAt: '2026-10-05'
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

Campos obligatorios: `title`, `description`, `updatedAt`, `format` y al menos una categoría. `format` acepta `in-person`, `online` o `hybrid`. Categorías: `conference`, `congress`, `meetup`, `ctf`, `hackathon`, `bsides`, `workshop`, `summit`, `forum`, `academic`, `community`. `hackathon` se muestra como «Hackatón». Los temas son etiquetas libres.

Las fechas son cadenas `YYYY-MM-DD` entre comillas. Omite campos desconocidos; no uses `null`. Sin `startDate`, la ficha muestra «Próximamente / Fecha por anunciar». `endDate` requiere un inicio y no puede precederlo; si se omite, se considera un evento de un día. Cada edición puede tener su propio archivo para conservar el histórico.

Redacta el cuerpo público con información confirmada y útil sobre el evento. Omite los datos desconocidos sin comentar su ausencia ni explicar decisiones sobre los campos de la ficha. Las notas de investigación y los pendientes editoriales se conservan en la documentación o en borradores excluidos de publicación.

Para CTFs y hackatones, explica en el cuerpo los requisitos de edad, estudios, país o región, tamaño del equipo y restricciones para premios cuando estén confirmados. Distingue las fechas de registro de las fechas de competición. Si la fuente publica horas en UTC, conviértelas a `America/Mexico_City` para los campos de calendario: el CTF MetaRed 2026 del 9 de octubre a las 14:00 UTC al 10 de octubre a las 02:00 UTC corresponde al 9 de octubre, de 08:00 a 20:00 en CDMX. Conserva fases independientes en fichas distintas, como la clasificatoria y la final de HACKMEX.

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

Las fichas nuevas se crean siempre sin `image` ni `imageAlt` y usan la ilustración predeterminada de `EventVisual.astro`. Al entregarlas, incluye los enlaces oficiales de descarga de las imágenes que encuentres, identificados por evento. No descargues ni incorpores imágenes salvo petición expresa del propietario; si no encuentras una imagen oficial, indícalo sin inventar enlaces. Conserva las imágenes de las fichas existentes salvo que se solicite cambiarlas.

Cuando el propietario solicite incorporar una imagen, guárdala en `public/img/events/` con el nombre de la ficha o en `shared/` si es reutilizable. Usa rutas como `/img/events/2026-cybermid.webp` o `/img/events/shared/hackgdl.png`. `imageAlt` permite describirla. Conserva las marcas originales y evita reutilizar carteles fechados para otra edición. Las tarjetas llevan a la ficha; el CTA «Busca el evento en redes» está en su aside y reúne los enlaces de búsqueda.

El estado general se calcula a partir de las fechas y `cancelled`. El registro abierto se muestra como indicador adicional en tarjetas futuras o sin fecha. El CFP respeta un cierre editorial explícito, cierra después de `closes` y abre desde `opens`; antes de la apertura aparece por anunciar. Sin `opens`, utiliza su estado editorial o por anunciar. El último día se incluye. Una cancelación oculta el CFP.

Los borradores validan el esquema, pero quedan fuera del inicio, catálogo, fichas públicas, RSS y sitemap. Acceder al ID de un borrador devuelve 404. `updatedAt` es la última actualización editorial de la ficha y alimenta el orden y la fecha del RSS, aunque el evento todavía no tenga fecha. Las URL de tarjetas, RSS y canónicas usan `getEventUrl`.

El inicio muestra hasta seis eventos próximos o en curso. La sección Eventos (`/events/`) muestra primero «En curso y muy pronto»: eventos en marcha o que comienzan en los próximos 30 días, incluyendo el día límite. A continuación aparecen «Próximos», con inicio posterior a ese plazo, «Fechas por anunciar», «Descubre cómo fue» y «Cancelados». «Descubre cómo fue» conserva los finalizados hace menos de dos meses de calendario, ordenados por fecha de finalización descendente. `isEventRecent` usa `endDate` o `startDate`, excluye la fecha límite exacta y ajusta al último día del mes si corresponde. Estos eventos también permanecen en el archivo. Las secciones sin eventos se ocultan. La cercanía se define en `NEAR_EVENT_DAYS` y `isEventNear`, en `src/lib/events/status.ts`, y se calcula por petición con días de calendario de `America/Mexico_City`.

Los eventos finalizados están en `/events/archive/`, agrupados por el año de inicio, con los años y las fechas más recientes primero. Un evento que cruza de año pertenece al año de `startDate`. El archivo tiene enlaces para saltar a cada año y usa las mismas tarjetas. Se accede desde Eventos y la navegación principal. Todavía no hay filtros interactivos ni relaciones automáticas entre ediciones.

## Editar la interfaz

La UI es exclusivamente oscura, con azul y turquesa como acentos. Los colores se editan en `@theme` de `src/styles/global.css`, con nombres semánticos como `--color-primary`, `--color-secondary`, `--color-background` y `--color-surface`. Los componentes consumen esas utilidades de Tailwind. No hay selector de tema ni depende del tema del sistema. `BaseLayout.astro` usa utilidades de Tailwind para el esquema oscuro, fondo, tipografía, selección y scroll con reducción de movimiento. El Markdown conserva `prose prose-invert` y usa modificadores `prose-*` para el blanco y los enlaces. `global.css` mantiene el gradiente radial, los patrones compartidos mediante `@apply`, el foco de teclado y la desactivación global de animaciones y transiciones cuando se solicita movimiento reducido.

Edita `TEXTS_GENERAL` en `src/lib/texts.ts` para cambiar los textos de inicio, Eventos, archivo, acerca de, 404, tarjetas, fichas, navegación y pie, incluido el aviso de licencia. El mismo objeto contiene `pages` (metadatos con `title` y `description`), `site` (nombre y descripción globales), `externalResources` (etiquetas de enlaces), `validation` y `errors` (mensajes propios de validación y configuración). La configuración técnica de idioma del HTML, RSS, fechas, ordenación alfabética y zona horaria vive en `SITE_LOCALE` de `src/lib/site.ts`. Todavía no hay selector, diccionarios por idioma ni rutas localizadas.

`SITE_PAGES` en `src/lib/navigation.ts` combina metadatos y enlaces con `id`, `label` y `href`; `MAIN_NAVIGATION` fija su orden. Los identificadores no dependen de etiquetas traducibles. `SITE_DATA` se importa directamente desde `src/lib/site.ts`. Los títulos, descripciones y cuerpos editoriales de los eventos siguen en `src/data/events/`. Usa alias `@/` y la extensión real explícita en imports internos, importando el archivo concreto sin reexportaciones de conveniencia.

La sección `/events/` se llama «Eventos» en navegación, breadcrumbs y acciones; conserva ese nombre. El footer muestra marca y descripción a la izquierda con su estilo original, espacio central vacío en escritorio y Recursos Externos a la derecha y una franja inferior centrada con el año y el texto del proyecto. En móvil las secciones siguen el flujo vertical. Sus enlaces se editan en `EXTERNAL_RESOURCES` dentro de `src/lib/links.ts` y abren en otra pestaña. El enlace de licencia vive en `LICENSE_LINK` del mismo módulo. El footer no muestra enlace RSS; `/rss.xml` sigue disponible.

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

Comprueba también breadcrumbs, estado y categorías sobre el título, el texto blanco en tarjetas y Markdown, 404 para IDs desconocidos y borradores, y ambos sitemaps: `/sitemap-index.xml` debe incluir el sitemap de páginas de ruta fija y la URL absoluta de `/sitemap-events.xml`; este último debe enumerar fichas sin borradores y usar `updatedAt` como `lastmod`. `/robots.txt` debe anunciar el índice. En un despliegue de Netlify, verifica la cabecera `Cache-Control` de inicio y eventos.

El build y la revisión visual de esta adaptación están pendientes de ejecución por el propietario. No hay script de pruebas ni `@astrojs/check` configurado en `package.json`. No edites `dist/`, `.astro/` ni `node_modules/`.
