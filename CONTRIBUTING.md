# Guía de contribución

Gracias por contribuir a CyberEvents.MX, el directorio y archivo histórico de eventos de ciberseguridad en México. Esta guía describe cómo preparar tus cambios y escribir mensajes de commit consistentes.

## Preparar una contribución

1. Consulta [README.md](README.md) para configurar el proyecto, [package.json](package.json) para los requisitos de Node.js y scripts disponibles y [AGENTS.md](AGENTS.md) para conocer sus convenciones técnicas.
2. Si colaboras desde un fork, crea una rama para tu cambio y mantén cada contribución enfocada en un objetivo.
3. Implementa el cambio siguiendo la estructura, los componentes y los estilos existentes.
4. Para cambios de código, configuración o contenido publicado, ejecuta `pnpm build`. Si modificas la interfaz o el contenido, revisa también el resultado con `pnpm preview` en móvil y escritorio, incluyendo navegación por teclado. Los cambios únicamente de documentación no requieren una compilación.
5. Abre un pull request que explique qué cambia, por qué y cómo lo verificaste. Incluye capturas si modificas la interfaz y enlaza el issue relacionado cuando exista.

Usa pnpm y conserva `pnpm-lock.yaml` y `pnpm-workspace.yaml` coherentes con las dependencias. No edites salidas generadas en `dist/`, `.astro/`, `.netlify/` ni dependencias en `node_modules/`. No incluyas archivos `.env`, credenciales ni datos personales en commits, capturas o registros.

Cuando trabajes con un agente, el propietario ejecuta las instalaciones y los comandos del proyecto; el agente prepara los cambios e indica los comandos necesarios, según [AGENTS.md](AGENTS.md). Indica siempre qué comprobaste y qué quedó pendiente. Actualmente no hay scripts de test, lint ni check en `package.json`; la compilación no sustituye esas comprobaciones.

## Convenciones del proyecto

- Mantén Astro con salida de servidor y el adaptador Netlify. Inicio, Eventos, Archivo y fichas calculan estados por petición; el contenido Markdown se incorpora durante el build.
- Las fichas viven en `src/data/events/` y su esquema está en `src/content.config.ts`. Usa nombres `YYYY-nombre.md`, con mes o sufijo de ciudad/fase cuando haga falta distinguir ediciones. No inventes un año sin confirmar ni uses el ID reservado `archive`.
- Cada ficha requiere `title`, `description`, `updatedAt`, `format` y `categories`. Conserva el nombre exacto `updatedAt` y las fechas de calendario entre comillas en formato `YYYY-MM-DD`. Omite datos desconocidos; no uses fechas ficticias ni `null`.
- Verifica la información editorial en fuentes oficiales. `DATA.md` aporta contexto del producto, pero no confirma fechas. Para usar `verification.status: verified`, incluye `checkedAt` y al menos una URL oficial en `sources`. Mantén `draft: true` mientras la ficha no esté lista para publicarse.
- Guarda imágenes de una edición en `public/img/events/` con el nombre base de su ficha; los recursos reutilizables van en `public/img/events/shared/`. No presentes carteles de otra edición como actuales.
- Reutiliza `src/lib/events/content.ts` para publicados, tarjetas y archivo; `status.ts` para estados y CFP en `America/Mexico_City`; y `presentation.ts` para URL y formato de fechas. Los tipos de eventos derivan de la colección en `src/lib/types/event.ts`. Conserva el filtro de borradores y los enlaces coherentes en tarjetas, fichas, RSS, canónicas y sitemap.
- Los textos de interfaz viven en `TEXTS_GENERAL` de `src/lib/texts.ts`; el contenido editorial permanece en Markdown. Configuración e idioma en `src/lib/site.ts`, páginas y navegación en `src/lib/navigation.ts` y enlaces externos en `src/lib/links.ts`. Los enlaces usan `id`, `label` y `href`; los metadatos, `title` y `description`. Usa los alias de `tsconfig.json` con extensión real explícita, los componentes compartidos y los tokens del tema oscuro de `src/styles/global.css`.

## Qué comprobar según el cambio

- **Fichas e imágenes:** revisa tarjeta, ficha, fuentes, fechas, imagen o alternativa SVG y enlaces de registro, CFP, redes y recursos. Comprueba que un borrador no aparezca en páginas públicas ni en RSS o sitemap.
- **Estados y fechas:** comprueba eventos en curso, próximos a 30 y 31 días, sin fecha, cancelados y finalizados. Los finalizados pertenecen al archivo por año de inicio; los de hace menos de dos meses aparecen también en «Descubre cómo fue».
- **Interfaz y navegación:** revisa inicio, Eventos, Archivo, acerca de y una ficha; comprueba el menú, el aside en pantallas bajas y los enlaces externos después de navegar con `ClientRouter`.
- **SEO y feeds:** revisa `/rss.xml`, `/robots.txt`, `/sitemap-index.xml` y `/sitemap-events.xml` tras el build. El índice debe incluir el sitemap de fichas mediante `customSitemaps`; robots anuncia el índice. Comprueba que no haya borradores y que `lastmod` corresponda a `updatedAt`.

Actualiza [README.md](README.md) si cambian la configuración o las instrucciones para publicar eventos, y [AGENTS.md](AGENTS.md) si cambian las convenciones, la arquitectura o el flujo de trabajo.

## Mensajes de commit

Usa un prefijo con inicial mayúscula, seguido de dos puntos, un espacio y una descripción breve en español:

```text
Prefijo: descripción del cambio
```

Conservamos `Fix:` para corregir errores y `Feature:` para añadir funcionalidad. Usa los siguientes prefijos según el propósito principal del cambio:

| Prefijo | Cuándo usarlo | Ejemplo |
| --- | --- | --- |
| `Fix:` | Corregir un error de comportamiento o presentación. | `Fix: corrige el estado de los eventos sin fecha` |
| `Feature:` | Añadir una funcionalidad. | `Feature: agrega un filtro de eventos` |
| `Refactor:` | Reorganizar código sin cambiar su comportamiento. | `Refactor: centraliza las URL de las fichas` |
| `Style:` | Ajustar el formato del código, como espacios o indentación. | `Style: unifica la indentación de componentes` |
| `UI:` | Modificar el diseño o la presentación visual. | `UI: ajusta el espaciado del encabezado` |
| `Docs:` | Añadir o actualizar documentación. | `Docs: agrega la guía de contribución` |
| `Test:` | Añadir o modificar pruebas. | `Test: cubre los límites de fechas de eventos` |
| `Perf:` | Mejorar el rendimiento. | `Perf: reduce el tamaño de las imágenes` |
| `Build:` | Modificar dependencias o configuración de compilación. | `Build: actualiza las dependencias de Astro` |
| `CI:` | Modificar automatizaciones de integración o despliegue. | `CI: agrega la validación de producción` |
| `Chore:` | Realizar mantenimiento que no encaje en los anteriores. | `Chore: actualiza los archivos ignorados` |
| `Revert:` | Deshacer un cambio anterior. | `Revert: revierte el cambio del menú` |

Puedes indicar el área entre paréntesis cuando ayude a identificar el cambio:

```text
Feature(events): agrega enlaces al CFP
Fix(events): corrige la clasificación de cancelados
Docs(readme): actualiza los requisitos de Node
```

- Escribe descripciones concretas, como «corrige la validación del correo», en lugar de «varios cambios».
- Usa verbos como «agrega», «corrige», «actualiza» o «elimina» y evita el punto final en el título.
- Usa `Style:` para formato del código y `UI:` para cambios visuales. Si corriges un defecto visual, usa `Fix:`.
- Separa cambios independientes en commits distintos. Si un cambio necesita varios archivos, pueden formar parte del mismo commit.
- Para explicar una decisión o un cambio incompatible, añade detalles en el cuerpo del commit después de una línea en blanco.

Estos prefijos son la convención del proyecto. Mantén `Fix:` y `Feature:` en lugar de alternarlos con `fix:` y `feat:`.
