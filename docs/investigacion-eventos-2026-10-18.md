# Revisión editorial del 18 de octubre de 2026

Los avisos aportados se contrastaron con fuentes oficiales. Se añaden cinco fichas de CISOCLUB y se revisan seis fichas existentes, conservando sus IDs. No se incorporan campos ajenos al esquema, como `name`, `slug`, `access`, `audience` o `registration`; el acceso y la elegibilidad se explican en Markdown.

## Fichas nuevas

| Ficha | Fecha | Lugar | Fuente oficial |
| --- | --- | --- | --- |
| `2026-cisoclub-tendencias-ia` | 22 de octubre de 2026 | Ciudad de México | [Calendario CISOCLUB](https://cisoclub.mx/eventos-cisoclub/) |
| `2026-cisoclub-hybrid-mesh-strategy` | 27 de octubre de 2026 | Ciudad de México | [Calendario CISOCLUB](https://cisoclub.mx/eventos-cisoclub/) |
| `2026-cisoclub-winter-gathering` | 7 de noviembre de 2026 | Cuautla, Morelos | [Gatherings](https://cisoclub.mx/gatherings/) y [calendario](https://cisoclub.mx/eventos-cisoclub/) |
| `2026-cisoclub-ia-avanza-seguridad` | 14 de noviembre de 2026 | Ciudad de México | [Calendario CISOCLUB](https://cisoclub.mx/eventos-cisoclub/) |
| `2027-cisoclub-techsummit` | 18–20 de marzo de 2027 | Acapulco, Guerrero | [TechSummit](https://cisoclub.mx/techsummit/) |

Son encuentros presenciales por invitación. Se omiten sede específica y precio. Winter Gathering permite solicitar acceso mediante el formulario enlazado por el organizador, sujeto a selección y confirmación. TechSummit ofrece solicitar un aviso sobre el registro; no se marca como inscripción abierta.

## Fichas existentes

- **Hacktitud Summit:** se mantienen el 25 de noviembre y el Campus Ciudad de México del Tec. [El host oficial](https://hacktitud.org/host/) describe al Cybersecurity Hub como impulsor de la colaboración, sin identificarlo como un recinto concreto. [El registro](https://hacktitud.org/summit/registro/) confirma modalidad presencial y cupo limitado. No se publica gratuidad general: [Sessionize](https://sessionize.com/httds26/) solo confirma participación gratuita para ponentes. El CFP cerró el 16 de octubre a las 23:59, hora del centro de México; se conserva la fecha para que el estado se calcule automáticamente y se actualiza la redacción.
- **MCyRA:** el resultado indexado del [sitio oficial de UNAM](https://mcyra2026.unam.mx/) indica el 10–13 de noviembre, en Ciudad Universitaria. La extracción directa de la página solo devolvió el aviso de Microsoft CMT. Se corrige el inicio del 9 al 10 de noviembre; esto no acredita una reprogramación del organizador.
- **OEA Cyber Challenge México:** [la OEA](https://www.oas.org/ext/es/principal/calendario/evento/id/1878) confirma el 23 y 24 de octubre, modalidad virtual y edades de 18 a 25 años. La ficha ya contenía estos datos: solo se renueva `verification.checkedAt`; `updatedAt` conserva su fecha editorial anterior. Se mantiene `ctf`, sin añadir la categoría no admitida `competition`.
- **Cybersecurity Week:** [Tec de Monterrey](https://conecta.tec.mx/es/noticias/eventos/nacional/institucion/cybersecurity-week-2026-del-19-al-23-de-octubre) confirma el 19–23 de octubre en el título y en el programa de lunes a viernes. El campo estructurado «Termina» indica septiembre y contradice ese programa. Se conserva el rango de octubre ya publicado y se incorpora la sede compuesta al frontmatter. Se mantiene modalidad híbrida por la asistencia presencial y la transmisión anunciada.
- **Mexico Cybersecurity Summit:** [Mexico Business Events](https://mexicobusiness.events/cybersecurity/2026/10) confirma el 21 de octubre, octava edición y Marriott Mexico City Reforma Hotel. Se amplían programa, dirección, horario de 08:00 a 18:00 y tarifa general de MX$10,500 más IVA. El importe permanece en el cuerpo para expresar el impuesto junto al precio.
- **BSides Querétaro:** [el organizador](https://bsidesqueretaro.org.mx/) confirma talleres el 23 y conferencias el 24 de octubre. [La página de talleres](https://bsidesqueretaro.org.mx/workshops.html) precisa Campus Juriquilla, pase oficial y computadora propia. [Passline](https://www.passline.com/eventos/bsides-queretaro-2026) confirma BLOQUE y acceso para mayores de 18 años. Se sustituye la nota pública sobre discrepancias de investigación por información práctica de sedes y acceso.

## Imágenes para descarga manual

Las cinco fichas nuevas no tienen `image` ni `imageAlt`: usan la ilustración SVG predeterminada. No se descargaron imágenes ni se modificaron las existentes. Estos enlaces proceden de las imágenes enlazadas en el calendario oficial de CISOCLUB; el servicio de consulta no pudo recuperar los archivos binarios.

| Evento | Imagen oficial | Nombre local sugerido |
| --- | --- | --- |
| Tendencias de IA para 2027 | [JPG](https://cisoclub.mx/wp-content/uploads/cisoclub-eventos/20261009-29dd9ba5e9e1.jpg) | `2026-cisoclub-tendencias-ia.jpg` |
| Hybrid Mesh Strategy Round Table | [PNG](https://cisoclub.mx/wp-content/uploads/cisoclub-eventos/20260928-ef51a9f81cb2.png) | `2026-cisoclub-hybrid-mesh-strategy.png` |
| Winter Gathering | [PNG](https://cisoclub.mx/wp-content/uploads/cisoclub-eventos/20261014-74194ce1d0fb.png) | `2026-cisoclub-winter-gathering.png` |
| La IA avanza, tu seguridad también | [JPG](https://cisoclub.mx/wp-content/uploads/cisoclub-eventos/20261012-7d02eb638766.jpg) | `2026-cisoclub-ia-avanza-seguridad.jpg` |
| TechSummit 2027 | [PNG](https://cisoclub.mx/wp-content/uploads/cisoclub-eventos/20261015-77682c802f4b.png) | `2027-cisoclub-techsummit.png` |

## Validación

Se revisaron los cambios frente al esquema existente y se ejecutó `git diff --check`. El build y la revisión visual están pendientes del propietario. Desde `C:\Users\marco\Desktop\Dev\cyberevents-mx`, ejecutar:

1. `pnpm build`: validar la colección y generar la salida, RSS y sitemaps.
2. `pnpm preview`: revisar inicio, Eventos y las fichas afectadas en móvil y escritorio, incluida la ilustración predeterminada de las cinco nuevas.

Tras el build, comprobar las nuevas URL en `/rss.xml` y `/sitemap-events.xml`, con `updatedAt` como fecha editorial, y que `/sitemap-index.xml` siga incluyendo el sitemap de fichas.
