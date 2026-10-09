# Girardot Express

Sitio institucional y comercial construido con Angular standalone, renderizado en servidor y prerenderizado para sus dos rutas públicas.

## Rutas

- `/`: experiencia para visitantes, oferta general, misión, visión, ubicación y contacto.
- `/espacios-comerciales`: información proyectada y captación de interés para marcas.

## Desarrollo

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## Verificación

```bash
npm test -- --watch=false
npm run build
```

## Datos y material pendientes

WhatsApp, Instagram y dirección corresponden al material recibido del cliente y se centralizan en `src/app/core/site-content.ts`. El correo comercial queda pendiente de verificar tras el cambio de dominio.

Antes de publicar se deben confirmar:

- Responsable legal, política de tratamiento y canales operativos.
- Buzón comercial del dominio confirmado. Facebook solo se muestra cuando exista un enlace oficial.
- Permisos de publicación del material audiovisual y de marca.
- Disponibilidad y condiciones comerciales vigentes.

El tour 360 y el avance de obra esperan material oficial. La carga eléctrica se presenta como servicio previsto, sin afirmar operación en la primera etapa.

## Privacidad y transparencia · 9 de octubre de 2026

Rutas nuevas: `/privacidad`, `/cookies` y `/terminos`, enlazadas desde el footer. Privacidad se entrega como **borrador visible y con `noindex`**, no como política aprobada. Su configuración está en `src/app/core/legal-content.ts`.

Antes de publicar una política final, el cliente debe confirmar razón social/NIT, domicilio de notificaciones, correo de privacidad operativo, procedimiento y área responsable de consultas/reclamos, criterios de conservación y aprobación del contenido. El dominio adquirido es `girardotexpress.com.co`; el correo anterior `comercial@girardotexpress.com` quedó oculto en contacto, footer, FAQ, chatbot y datos estructurados hasta verificar un buzón operativo. No se inventó un correo nuevo. La dirección del mall no se utiliza como domicilio legal sin confirmación.

El formulario sigue siendo local y prepara un enlace a WhatsApp. Al abrirlo, WhatsApp recibe el borrador en la URL; el equipo solo recibe el mensaje si la persona lo envía. Se informa de esta diferencia antes de continuar. La casilla empieza desmarcada y es obligatoria; el borrador lleva el texto y versión de autorización, pero puede ser editado por el usuario. **No hay un registro de consentimientos en servidor**: el responsable deberá conservar y gestionar las autorizaciones efectivamente recibidas. No usar el contacto para campañas sin gestionar su autorización correspondiente.

«Borrar formulario» y «Borrar conversación» eliminan únicamente datos locales de la página. No borran WhatsApp, el historial del navegador ni los registros de la empresa. La solicitud de supresión se explica en `/privacidad#solicitudes`; el WhatsApp ofrece orientación mientras se confirma el canal formal, sin simular un radicado o una eliminación automática.

Aplicación del listado compartido por el usuario:

| Punto | Estado y alcance |
| --- | --- |
| 1. Privacidad | Borrador factual implementado. Falta identificación y operación del responsable. |
| 2. Términos | Condiciones del sitio informativo; no sustituyen un contrato de arrendamiento. |
| 3. Reembolsos | No aplica al flujo actual: el sitio no cobra, vende ni reserva. |
| 4–5. Cookies y banner | Aviso implementado. Sin cookies propias, analítica ni publicidad en el código actual; no se presenta un consentimiento ficticio. Revisar nuevamente si se añaden servicios o cambia el despliegue. |
| 6. Consentimiento | No preseleccionado, validado y explicado; texto/versionado en borrador de WhatsApp. Conservación de la prueba por la empresa pendiente. |
| 7. Minimización | Se conservan los campos pedidos por el cliente; sin cédula, datos bancarios, edad ni cargas de documentos. Límites de longitud y borrado local. |
| 8. Terceros | Revisados dependencias y peticiones del código: Angular, Leaflet local, tiles OSM y enlaces externos; fuentes y medios propios. La configuración y registros del alojamiento requieren revisión del despliegue real. |
| 9–12. Transparencia | Sin reseñas inventadas, tarifas, ventas ni confirmaciones falsas de recepción. Proyecciones, renders y escenas ilustrativas identificados; sin promesas de rentabilidad. |
| 13–15. Accesibilidad | Se preservan textos alternativos y teclado; páginas legales semánticas, foco visible y bordes del formulario/chat con mayor contraste. No equivale a certificación WCAG de todo el sitio. |
| 16. Datos de empresa | Pendientes del cliente; no inferidos del nombre comercial. |
| 17. Menores | Sin registro infantil; formularios dirigidos a adultos y aviso de no incluir datos de menores/sensibles. Si se crea un flujo infantil habrá que diseñar sus autorizaciones antes de activarlo. |
| 18. Baja de correos | No aplica: no hay newsletter ni inscripción a campañas. |
| 19. Licencias | Poppins OFL, Leaflet BSD y Bootstrap Icons MIT conservadas. La entrega de medios por el cliente no verifica derechos de terceros; debe confirmar permisos de publicación de logos, imágenes y videos. |
| 20. Supresión | Borrado local implementado; procedimiento y canal formal para copias en poder de la empresa pendientes. |

Origen del material: logo definitivo y manual de identidad entregados por el cliente (`public/assets/brand/README.md`); dos videos de hero y cinco frames derivados de los tres MP4 entregados en octubre (`public/assets/media-2026-10/`, sin audio); escenas ilustrativas preexistentes en `public/assets/generated/`; videos lifestyle preexistentes en `public/assets/vida-*.mp4`. No se atribuye una licencia de publicación a esos medios sin confirmación del cliente. Los archivos antiguos se mantienen para comparación y también deben revisarse antes de desplegarlos.

Referencia para consentimiento, finalidad, información al titular y sus derechos: [Ley 1581 de 2012, artículos 4, 8, 9, 12, 14 y 15](https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/ley_1581_2012.htm). Agregar páginas no completa por sí solo los procedimientos de tratamiento de la empresa.
