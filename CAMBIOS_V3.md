# Versión 3 · Implementación del 14 de septiembre de 2026

Base: commit `0d248ad` (`version 2 finalizada`). Trabajo en la rama `V3`, sin modificar el respaldo de V2.

## Implementado

- Header compartido: logo horizontal oficial de 200 px en escritorio y 176 px en móvil; menú de 14 px en escritorio. Se conserva la alineación compacta a la derecha y el botón de Inicio reducido. El menú móvil entra a 1280 px para dar espacio al nuevo tamaño.
- Home: eslogan exacto «Todo lo que necesitas, más cerca.» y apertura en dos niveles de lectura, con «Finales de 2026» destacado y su condición de apertura prevista de primera etapa.
- Quiénes somos: explica el concepto de mall de conveniencia, su propuesta de recorridos abiertos y el público al que se dirige. La identificación de promotores continúa pendiente.
- Explora el mall reúne experiencias y facilidades; el enlace existente `/#servicios` sigue funcionando dentro del mismo bloque. Los iconos usan un acento azul del manual.
- Cinco fichas desplegables de categorías, con descripción, condición de oferta proyectada y acceso al formulario comercial. No se inventaron marcas confirmadas.
- Sección propia de sostenibilidad en Home con render a todo el ancho, el texto solicitado y los cuatro atributos previstos. Se retiraron esos atributos del cierre dirigido a marcas para evitar repetirlos en el lugar equivocado.
- Hero comercial más breve y texto de arquitectura orientado a la operación del negocio.
- Formularios: correo obligatorio en ambos; empresa/marca, cargo, categoría y área requerida obligatorios en el comercial. Se puede indicar que se necesita orientación sobre el área. La consulta preparada de WhatsApp incluye esos datos. Nuevos motivos de consulta: isla, portafolio y planos/disponibilidad.
- Página `/preguntas-frecuentes`: las 21 preguntas del entregable, búsqueda sin distinción de tildes, filtros para visitantes/marcas, respuestas desplegables y acciones. Usa las mismas respuestas del motor del bot. Accesos desde el pie y el asistente.
- Bot: perfiles «Soy visitante» y «Tengo una marca», con saludos y preguntas rápidas específicos. Conserva por separado los dos historiales y borradores durante la sesión. El primer perfil sugerido depende de la página donde se abre; el usuario puede cambiarlo. Los enlaces a WhatsApp incluyen el contexto de la conversación.
- Mapa compartido para ambas páginas con selección de seis referencias: mall, Vía Nariño, estadio, dos universidades y terminal. Cada selección localiza ese punto y permite abrirlo en Google Maps; no muestra una capa simultánea de seis marcadores. Se conservan Google Maps y Waze para llegar al mall. No se estimaron tiempos, distancias ni coordenadas de terceros.
- `SITE_CONTENT` centraliza contacto, coordenadas, logos, eslogan y apertura; el marcado estructurado del sitio se genera desde esa fuente en vez de duplicarlos en `index.html`.
- Más presencia de azul/cian y verde en interacciones y sostenibilidad. Se conserva la cortina amarilla/negra con composición de marca, dirección inversa y ensamblado previamente aprobados. El manual sí contiene el amarillo `#F3B71A`; el cambio de predominio de color debe valorarse con el cliente sobre esta versión.

## Material o definición que aún falta

| Solicitud | Dependencia concreta |
| --- | --- |
| Quién está detrás del proyecto | Nombres, roles y texto autorizado de promotores/desarrollador. |
| Cifras comerciales adicionales | Cantidad/área de islas y oficinas, metros de fachada, área de desarrollo futuro y confirmación de GLA por piso. Persiste la diferencia de 1 m² entre materiales anteriores; no se publicó un ajuste supuesto. |
| Planos e inventario | Archivos aprobados, disponibilidad vigente y responsable de su actualización. |
| Renders nuevos y avance real de obra | Material original de mayor resolución y fotos autorizadas. Se usan los renders existentes, rotulados como visualizaciones. |
| Portafolio descargable tras registro | PDF final y destino real para recibir/guardar los registros. El formulario actual prepara WhatsApp y no simula recepción ni registro en un sistema. |
| Política de datos, términos y aviso legal | Textos aprobados e identidad del responsable del tratamiento. No se publicaron textos legales inventados ni enlaces vacíos. La casilla actual conserva su autorización para responder la consulta, pendiente de vincular la política. |

No se adquirieron servicios de IA ni se generaron videos nuevos. No hay autorización de compra en V3.

## Fuentes de los puntos de referencia

Nombres institucionales comprobados el 14 de septiembre de 2026. La ubicación de Girardot Express se conserva exactamente como fue suministrada por el cliente; las búsquedas de otros puntos son resueltas por el proveedor del mapa.

- [Alcaldía: estadio Luis A. Duque Peña](https://www.girardot-cundinamarca.gov.co/NuestraAlcaldia/SaladePrensa/Paginas/Avanza-la-renovaci%C3%B3n-del-Estadio-Luis-A--Duque-Pe%C3%B1a.aspx).
- [Universidad de Cundinamarca: campus Girardot](https://www.ucundinamarca.edu.co/documents/sedes/girardot/libro_digital_girardot.pdf).
- [Universidad Piloto: contacto de la Seccional Alto Magdalena](https://repository.unipiloto.edu.co/contact) y [campus](https://girardot.unipiloto.edu.co/unipiloto/el-campus/).
- [Terminal de Transportes de Girardot](https://terminalgirardot.com/).

## Validación

- 89 pruebas unitarias: base existente, correo requerido, requisitos comerciales y cambio de contexto, mensaje preparado, FAQ compartidas y búsqueda por perfil.
- `scripts/check-v3.cjs`: 320, 390, 1024, 1290 y 1440 px sin desbordamientos. Flujos de fichas, mapa, historiales, FAQ y validación comercial en escritorio y móvil.
- Revisión visual de Home, Quiénes somos, experiencias, sostenibilidad, categorías, mapas, bot, FAQ y formulario. El mapa carga de forma diferida y depende del proveedor externo; siempre conserva el enlace para abrirlo.
- Detector mecánico de layout de Impeccable: sin hallazgos en los archivos revisados.
- Navegación: 24 recorridos por anclas y cinco tamaños adicionales, sin errores; clic repetido, historial, alias y menú móvil incluidos. Informe: `../.codex_artifacts/v3-navigation/results.json`.
- Subrayado: selección directa, clics rápidos e interrupción con rueda en las dos páginas, escritorio y móvil. Informe: `../.codex_artifacts/v3-nav-indicator/`.
- Video y CTA: 14 casos correctos, incluyendo pausa/reproducción, visibilidad, cambios repetidos de página, reducción de movimiento y recuperación tras fallo real de carga del recurso. Informe: `../.codex_artifacts/v3-video/results.json`.
- Compilación de producción correcta; cuatro rutas prerenderizadas. Paquete inicial: 348,85 kB, transferencia estimada 95,31 kB. No se agregaron dependencias.
- Capturas e informes de la revisión visual: `../.codex_artifacts/v3-qa/`. `git diff --check` sin problemas de espacios.

## Revisión de diseño

Se preserva la identidad existente: Poppins, fotografía amplia, alto contraste y cortina diagonal. El ajuste añade contenido útil y acentos del isotipo sin sustituir la navegación aprobada. La tipografía y los controles mantienen jerarquía, contraste y acceso por teclado; los desplegables son nativos y el movimiento respeta la preferencia de reducción de animaciones.
## Ajuste posterior: cortina con logo

Trabajo sobre la rama `V3` creada por el usuario. La cortina diagonal conserva su ensamblado y dirección inversa, con el logo vertical oficial en lugar de las palabras sueltas. El negro se sustituye por naranja intenso y el amarillo pasa a un degradado luminoso inspirado en la referencia. Marcas de agua discretas completan las esquinas; cambian de lado al volver a Inicio. El archivo del logo permanece intacto.

Se precarga y decodifica el logo al iniciar la aplicación. La navegación no espera por un recurso lento o fallido: omite la cortina si aún no está listo. Las imágenes quedan integradas en las piezas desde el primer fotograma. Pruebas reproducibles: `scripts/check-route-curtain.cjs`, con escritorio/móvil, ambas direcciones, historial, cancelación, redimensionado, teclado, reducción de movimiento, ausencia de WAAPI y fallo de imagen. Capturas en `../.codex_artifacts/v3-curtain-logo/`.
