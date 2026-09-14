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

## Datos provisionales

El número de WhatsApp y los enlaces de redes sociales son temporales. Se editan en `src/app/core/site-content.ts`.

Antes de publicar se deben reemplazar:

- Número y enlace oficial de WhatsApp.
- Perfiles oficiales de Instagram y Facebook.
- Material audiovisual definitivo.
- Disponibilidad y condiciones comerciales vigentes.

El tour 360, la electrolinera y el módulo de avance de obra no se anuncian en esta versión. Pueden incorporarse cuando exista material oficial aprobado.
