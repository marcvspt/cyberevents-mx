# Revisión editorial del 26 de octubre de 2026

Los avisos recibidos corresponden a cinco fichas ya publicadas. Se conservan sus IDs, fechas e imágenes; no se añaden fichas duplicadas ni campos fuera del esquema. Los cambios editoriales actualizan `updatedAt` al 26 de octubre; las comprobaciones sin cambios públicos renuevan solo `verification.checkedAt`.

## Cambios y fuentes

| Ficha | Resultado de la revisión | Fuentes oficiales |
| --- | --- | --- |
| `2026-bugcon` | Talleres el 24–25 de noviembre, villages el 26 y Main Track el 27. Frontón Bucareli es la sede principal; el registro de cada taller tiene sus propias condiciones. Se añaden tarifas de conferencias para estudiantes ($250 MXN) y público general ($700 MXN), con IVA incluido y cargos por servicio adicionales. | [Sitio oficial](https://bugcon.org/) y [datos que utiliza la página para mostrar programa, boletos y talleres](https://bugcon.org/assets/app.js). |
| `2026-cybersecurity-summit-punta-mita` | Se mantienen el 28–31 de octubre. Se incorporan Hotel Armony, organizadores, temas y acceso de pago con hospedaje. Se usa Punta de Mita como nombre de ciudad, conservando el ID. | [Cybersecurity Summit](https://www.cybersecuritysummit-cpt.com/), secciones de acceso, agenda y registro. |
| `2026-hacktitud-summit` | Se conservan el 25 de noviembre, Tec Campus Ciudad de México, registro abierto y CFP fechado. Se añade `HTTDS26`, publicado en el registro oficial. | [Summit](https://hacktitud.org/summit/), [registro](https://hacktitud.org/summit/registro/) y [CFP](https://sessionize.com/httds26/). |
| `2026-cyber-case-challenge` | Fecha, hora de inicio, sala y registro ya coinciden con la fuente. Solo se renueva la fecha de verificación. | [Eventos de AMECS](https://amecsmexico.org/eventos). |
| `2026-congreso-nacional-ciberseguridad-guardia-nacional` | El comunicado confirma el 6–7 de octubre y los temas ya publicados. Solo se renueva la fecha de verificación. | [Comunicado de la Guardia Nacional](https://www.gob.mx/guardianacional/prensa/guardia-nacional-realiza-congreso-nacional-de-ciberseguridad-inteligencia-artificial-en-la-seguridad-publica). |

## Criterios y pendientes de investigación

- **BugCON:** la web construye el programa y las tarifas en el navegador desde `assets/app.js`; la extracción de HTML sin ese recurso omite estos datos. La tabla pública distingue villages y Main Track, resolviendo la discrepancia de los avisos. No se atribuye la sede principal a todos los talleres. La consulta de Boletia no estuvo disponible; las tarifas proceden del organizador.
- **Cybersecurity Summit:** el encabezado y la agenda de octubre respaldan las fechas existentes. La sección antigua «Pre-Agenda» conserva días de noviembre; no se usan. No se incorpora «sexta edición» porque no se corroboró en el texto consultado. Las tarifas y habitaciones varían por paquete y disponibilidad: se remite al formulario y a los asesores, sin afirmar disponibilidad general de registro.
- **Hacktitud:** el registro confirma asistencia presencial con cupo limitado. Las fuentes consultadas no confirman gratuidad general; Sessionize especifica gratuidad para ponentes. No se añade `price.type: free` ni un panel de CISOs sin evidencia adicional. El CFP conserva su cierre del 16 de octubre, que permite calcular el estado cerrado automáticamente.
- **Cyber Case Challenge:** AMECS publica el 27 de octubre a las 08:30 y un formulario de registro. No se corroboraron en esa página el término a las 13:30, el acceso exclusivo por invitación, el programa detallado ni los ponentes mencionados en el aviso; se omiten. El contenido público existente se conserva.
- **Guardia Nacional:** la consulta directa devolvió HTTP 403; el contenido indexado del comunicado oficial permitió contrastar fechas y temas. La datación «Ciudad de México» corresponde al comunicado y no acredita por sí sola la sede del evento; no se añade ubicación.

## Imágenes

No se descargaron ni cambiaron imágenes. Las fichas existentes conservan sus recursos y BugCON sigue usando la ilustración predeterminada. El sitio de BugCON ofrece su [logo oficial](https://bugcon.org/assets/logo.png) para una eventual descarga manual; no se incorpora al proyecto.

## Validación

Se revisaron los campos modificados frente a `src/content.config.ts` y se comprobó que RSS y sitemap consumen las fichas publicadas y su `updatedAt` mediante los módulos existentes. `git diff --check` pasó para los archivos rastreados. No fue necesario cambiar el esquema, los consumidores ni las reglas del proyecto.

El build y la revisión visual quedan pendientes del propietario. Desde `C:\Users\marco\Desktop\Dev\cyberevents-mx`:

1. Ejecutar `pnpm build` para validar la colección y generar la salida, RSS y sitemaps.
2. Ejecutar `pnpm preview` para revisar inicio, Eventos, Archivo y las cinco fichas en móvil y escritorio, incluyendo teclado, precios, enlaces y búsquedas de conversación.

Tras el build, comprobar las tres fechas editoriales actualizadas en `/rss.xml` y `/sitemap-events.xml`, y que `/sitemap-index.xml` siga incluyendo ambos sitemaps. Cyber Case Challenge y el congreso conservan su `updatedAt` previo porque solo se revisó su verificación.
