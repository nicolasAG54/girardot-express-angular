# Formularios por correo

Destinatario autorizado por el usuario: comercial@girardotexpress.com.co.
Recepción: Netlify Forms. Buzón: Zoho Mail. No se usan contraseñas de correo,
claves SMTP, claves públicas de terceros ni un mailto para entregar solicitudes.

## Implementación

- `contact-delivery.ts`: POST URL-encoded a `/__forms.html`, cancelación y rechazo
  de errores HTTP/respuestas estáticas que no acreditan procesamiento.
- `public/__forms.html`: esquemas estáticos para la detección durante despliegue
  de Angular SSR; nombres `contacto-general` y `espacios-comerciales`.
- El campo `email` permite responder al remitente. `subject` distingue las consultas.
- Honeypot `bot-field` y filtrado de Netlify. El correo destino se configura en el
  panel del sitio, no lo controla el visitante.
- La casilla de autorización sigue obligatoria y desmarcada. Texto, versión y fecha
  del navegador acompañan el registro de recepción que mantiene Netlify.
- Sin almacenamiento local. Borrar campos no borra el registro ni el correo.
- Tiempo de espera 20 s; sin reintentos automáticos. Un fallo conserva los campos.
- La copia localhost no entrega datos ni simula éxito; pruebas unitarias usan un
  transporte simulado que nunca envía correo real.

## Activación en el sitio oficial

Proyecto Netlify: girardotexpressv2. Dominio: girardotexpress.com.co.

1. Forms → Enable form detection: habilitado durante esta tarea.
2. Form submission notifications → Email notification → Any form → destinatario
   comercial@girardotexpress.com.co: guardado. Al crearse quedó pendiente de que
   el buzón pulsara Confirm en el correo que envió Netlify.
3. Publicar la versión actual y verificar que Netlify detectó ambos formularios.
4. Comprobar que la notificación ya no figura pendiente de confirmación.
5. Enviar una prueba identificada como prueba desde cada formulario publicado y
   comprobar tanto su registro como la llegada a Zoho, incluida carpeta spam.
   La prueba debe usar datos de prueba autorizados y no información de clientes.

Código probado localmente, detección habilitada y destinatario confirmado por el
usuario y verificado en el panel de Netlify. El usuario autorizó publicar esta
versión y probar ambos formularios el 12 de noviembre de 2026. El resultado del
despliegue y de las pruebas reales debe verificarse en Netlify y Zoho; habilitar
detección por sí solo no acredita que se hayan desplegado los formularios nuevos.

El equipo tiene plan Free de créditos. Forms es gratuito en los planes de
créditos según https://docs.netlify.com/manage/forms/usage-and-billing/.
Los límites generales de alojamiento y despliegues del plan siguen aplicando;
no se modificó el plan ni se añadieron servicios de pago.

Referencia: https://docs.netlify.com/manage/forms/setup/ y
https://docs.netlify.com/manage/forms/notifications/.
