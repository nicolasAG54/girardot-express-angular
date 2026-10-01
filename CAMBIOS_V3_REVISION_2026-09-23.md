# Revisión de la versión 3 solicitada por el cliente

Esta revisión responde a la devolución posterior a V3: el logo seguía pequeño, las preguntas frecuentes resultaban dispersas y la selección de referencias mediante botones no comunicaba el entorno del proyecto. Se tomó como antecedente exclusivamente el bloque VERSION #3 de `Comentarios Página Web (3).docx`, junto con la precisión actual del usuario. El usuario confirmó la dirección del mapa: amplio, con las referencias visibles al mismo tiempo.

## Cambios

- Logo horizontal oficial de 300 px en escritorio, frente a 200 px en V3. En tablet ocupa 260 px y en teléfonos entre 208 y 244 px, frente a 176 px. Se mantienen la imagen y sus proporciones. La cabecera adapta su altura y cambia a menú desplegable a 1360 px para evitar cruces. Logo del pie de 224 px, frente a 164 px, conservando el tratamiento negativo existente.
- Las 21 consultas se reúnen en ocho temas. Los enunciados originales siguen siendo reconocibles en la búsqueda y en el asistente. Se conserva una fuente común de respuestas y el contexto visitante/marca del chat.
- Mapa a todo el ancho del contenido en Home y Espacios comerciales. La dirección y las acciones de llegada se sitúan encima; el mapa deja de compartir una columna estrecha con el título. Home usa un fondo claro para facilitar la lectura.
- Girardot Express, el estadio, las dos universidades y la terminal se representan en la misma vista. Vía Nariño se muestra como un corredor, con geometría real. Se elimina la botonera que sustituía un lugar por otro. Los enlaces Google Maps y Waze continúan dirigidos a la coordenada del mall entregada por el cliente.

## Datos cartográficos

Coordenada del proyecto sin cambios: `4.299272, -74.819122`. Los siguientes puntos representan los polígonos cartográficos de los hitos; no son accesos peatonales ni rutas calculadas.

| Referencia | Latitud | Longitud | Fuente |
| --- | --- | --- | --- |
| Estadio Luis Antonio Duque Peña | 4.3049559 | -74.8117856 | [OSM 258584855](https://www.openstreetmap.org/way/258584855) |
| Universidad de Cundinamarca | 4.3066068 | -74.8069768 | [OSM 305379991](https://www.openstreetmap.org/way/305379991) |
| Universidad Piloto | 4.3008830 | -74.8113288 | [OSM 130096473](https://www.openstreetmap.org/way/130096473) |
| Terminal de Transportes | 4.3027277 | -74.8052843 | [OSM 228906088](https://www.openstreetmap.org/way/228906088) |

Consulta de coordenadas: [Nominatim](https://nominatim.openstreetmap.org/lookup?osm_ids=W258584855,W305379991,W130096473,W228906088&format=jsonv2). Vía Nariño corresponde a `alt_name` de Carrera 24 en [OSM 289682868](https://www.openstreetmap.org/way/289682868); el trazado procede de su [geometría publicada](https://www.openstreetmap.org/api/0.6/way/289682868/full.json). No se publican distancias o tiempos estimados.

El mapa usa Leaflet 1.9.4 cargado en el cliente y cartografía OpenStreetMap con atribución visible. Las imágenes cartográficas requieren conexión al proveedor; los enlaces externos de llegada permanecen disponibles. No se necesita una clave de Google Maps. No se incorporan registro de contactos, portafolio descargable, inventario comercial ni otros materiales pendientes de V3.

## Verificación

- Compilación de producción correcta, con cuatro rutas prerenderizadas. Leaflet permanece en un paquete diferido. Angular informa su formato CommonJS; el adaptador Netlify informa variables ausentes en la compilación local.
- 92 pruebas unitarias aprobadas. Incluyen el reconocimiento de las 21 consultas originales, las respuestas compartidas y los formularios existentes.
- Navegación: 24 recorridos por anclas y cinco tamaños adicionales, sin errores. Verificación adicional del menú abierto y cierre con Escape a 320, 600, 601, 700, 701, 1360 y 1361 px, sin desbordamientos ni cruce con el logo.
- Flujos V3 comprobados en escritorio y móvil: categorías, mapa, historiales del asistente, búsqueda de FAQ, ausencia de resultados y formulario comercial. Cinco anchos de pantalla sin desbordamiento.
- Mapa: ocho combinaciones de Home/Espacios comerciales y 320/390/768/1440 px, con las cinco etiquetas dentro del mapa y sin solaparse. Pruebas de carga diferida, teclado, zoom, recuperación del encuadre, cambio de ruta, conexión lenta y fallo de red con reintento. Los recorridos funcionales usan cartografía simulada para no descargar teselas innecesarias; las capturas visuales usan la cartografía real.
- Revisión visual del logo, mapa, FAQ y pie en escritorio y móvil. Capturas finales: `../.codex_artifacts/v3-client-refinement/`. Informes de flujos y navegación: `../.codex_artifacts/v3-client-flows/` y `../.codex_artifacts/v3-client-navigation/`.
- Detector de diseño ejecutado: avisos sobre escalas y colores no registrados en DESIGN.md y falsos positivos de imágenes con binding `[src]` de Angular. Las imágenes se comprobaron cargadas en navegador. No se cambió el diseño existente para silenciar esos avisos.
- `git diff --check` correcto. Cambios locales; no se publicaron.
