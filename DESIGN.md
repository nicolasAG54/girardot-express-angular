---
name: Girardot Express
description: "Un mall de conveniencia contado con fotografía amplia, contraste editorial y un filo amarillo inconfundible."
colors:
  paper: "#ffffff"
  ink: "#101010"
  ink-soft: "#525154"
  ink-faint: "#767676"
  line: "#ddddda"
  surface: "#f2f1ee"
  yellow: "#f3b71a"
  yellow-strong: "#f5c54b"
  orange: "#f4a51c"
  teal: "#2199b3"
  teal-deep: "#176e78"
  dark: "#11100f"
  dark-teal: "#214d4a"
  error: "#9f3030"
  project-yellow: "#f3b71a"
  project-muted: "#656565"
  project-line: "#dcdcd7"
  mall-explorer-stage: "#e5e4df"
typography:
  display-home:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(3.4rem, 6.8vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  display-project:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.8rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline-home:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(2.7rem, 5vw, 5.4rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline-project:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(2.7rem, 5vw, 5.4rem)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  metric:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(3.5rem, 6vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1
  micro:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    lineHeight: 1.5
  footer-wordmark:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(4rem, 11.2vw, 10.7rem)"
    fontWeight: 600
    lineHeight: 0.84
    letterSpacing: "-0.04em"
  mall-explorer-headline:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 4.7vw, 4.7rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  mall-explorer-launch:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "clamp(1.65rem, 2.6vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  mall-explorer-body:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
  mall-explorer-caption:
    fontFamily: "Poppins, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: "8px"
  sm: "12px"
  edge-media: "14px"
  md: "16px"
  pill: "999px"
  round: "50%"
spacing:
  micro: "0.25rem"
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  page: "clamp(1.25rem, 5vw, 5rem)"
  section: "clamp(5.5rem, 10vw, 9rem)"
components:
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "100px"
    width: "1320px"
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.76rem 1.25rem"
    height: "44px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.76rem 1.25rem"
    height: "44px"
  button-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.76rem 1.25rem"
    height: "44px"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.76rem 1.25rem"
    height: "44px"
  button-project-yellow:
    backgroundColor: "{colors.project-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.35rem"
    height: "48px"
  video-control:
    backgroundColor: "rgb(16 16 16 / 0.46)"
    textColor: "{colors.paper}"
    rounded: "{rounded.round}"
    size: "46px"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "0.9rem 0.95rem"
  visit-card:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "2rem"
    height: "300px"
  activity-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "1rem"
    width: "310px"
  project-metric:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.metric}"
    padding: "1.5rem 0"
  service-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "2rem 0"
    height: "230px"
  footer:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.paper}"
    typography: "{typography.footer-wordmark}"
    padding: "clamp(4rem, 7vw, 6rem) 0 1.5rem"
  mall-explorer-stage:
    backgroundColor: "{colors.mall-explorer-stage}"
    height: "clamp(420px, 46vw, 660px)"
  mall-explorer-stage-mobile:
    backgroundColor: "{colors.mall-explorer-stage}"
    height: "460px"
---

# Design System: Girardot Express

## Overview

**Creative North Star: "Todo Más Cerca"**

Girardot Express convierte la conveniencia cotidiana en una experiencia editorial de mall contemporáneo. El sistema es directo, fotográfico y urbano: una cabecera blanca con un filo amarillo abre el recorrido; los campos blancos dan aire a la información; los capítulos negros concentran experiencias y arquitectura; y el cierre negro monumental devuelve el protagonismo a la marca. La referencia CityPlaza define la escala y el ritmo, pero la voz, los activos y las señales de color pertenecen a Girardot Express.

La portada expresa este mundo con la composición A aprobada y el teaser de Proyecto de la composición B: hero lifestyle a sangre, relato cotidiano, mosaico oscuro 2×2 de planes, programación futura, marcas por anunciar, proyecto, servicios, novedades, ubicación y contacto. La ruta `/proyecto` usa la composición C: video arquitectónico, cifras de gran escala y una mezcla 1+3 —un medio protagonista seguido por tres escenas— antes de arquitectura, servicios técnicos, ubicación y conversación B2B. Ambas rutas comparten tipografía, navegación, contraste, radios, botones y movimiento; difieren en audiencia y densidad informativa.

**Key Characteristics:**

- Poppins como única voz tipográfica, con titulares compactos y cuerpo sereno.
- Blanco, negro y amarillo como lenguaje activo; los demás colores de la identidad se reservan.
- Fotografía y video amplios, tratados como arquitectura del layout y no como miniaturas decorativas.
- Capítulos rectos a sangre combinados con medios de curvas contenidas.
- Botones cápsula, acciones circulares y líneas finas como señales de navegación.
- Servicios sin cajas en Home y matrices lineales en Proyecto; las tarjetas se reservan para contenido con medio.
- Home fija su capítulo de planes en 2×2; Proyecto usa una jerarquía 1+3 para la mezcla comercial.
- Revelados editoriales de 600ms, indicador continuo con scrollspy, transición direccional de marca entre rutas, marquee pausable y equivalencia con movimiento reducido.

## Colors

La paleta se comporta como señalética: los neutros construyen la mayor parte de la página y el amarillo indica qué mirar, dónde actuar y cómo avanzar.

### Primary

- **Blanco de Recorrido:** fondo de navegación, campos editoriales, formularios y tarjetas de contenido. `paper` también cubre el rol semántico de blanco empleado por la implementación.
- **Tinta Girardot:** texto principal, botones oscuros, iconografía y estructura lineal.
- **Negro de Capítulo:** experiencias, ubicación, footer y fondos que necesitan una pausa inmersiva.
- **Amarillo de Ruta:** filo superior, CTA principal, flechas, puntos, etiquetas, subrayados y divisores de cifras.
- **Amarillo Proyecto:** variante ligeramente más cálida y luminosa usada de forma local en `/proyecto`; no reemplaza el amarillo compartido fuera de esa ruta.

### Secondary

- **Amarillo Activo:** estado hover de la acción amarilla; se usa como respuesta, no como una nueva banda de marca.
- **Naranja Girardot:** reserva cálida de identidad para recursos autorizados o información con una razón semántica clara.
- **Turquesa Girardot / Turquesa Profundo:** reserva fresca derivada del logo; no compite con el amarillo en controles principales.
- **Verde Petróleo:** reserva oscura para futuras superficies de identidad. No está habilitado como fondo genérico del rediseño actual.

### Tertiary

- **Rojo de Error:** mensajes de validación y estados que requieren corrección; nunca funciona como acento promocional.

### Neutral

- **Tinta Suave:** párrafos secundarios y explicaciones sobre blanco.
- **Tinta Lejana:** notas, metadatos y ayudas de menor jerarquía.
- **Gris de Sala:** sección de novedades y superficie suave de formularios B2B.
- **Línea Editorial:** separadores, placeholders de marcas y matrices técnicas.
- **Neutros de Proyecto:** `project-muted` y `project-line` afinan el contraste de lectura en la ruta técnica sin crear otra identidad.
- **Neutro del visor:** `mall-explorer-stage` pertenece únicamente al lienzo 3D de MallExplorer; acompaña el modelo sobre la sección Gris de Sala y no amplía la paleta general.

**The Yellow Route Rule.** El amarillo guía; no tapiza. Debe aparecer en acciones, focos, flechas, subrayados o detalles pequeños, nunca como un fondo de sección completa ni como degradado decorativo.

**The Identity Reserve Rule.** Naranja, turquesa y verde petróleo solo entran cuando un activo de marca o una categoría confirmada los justifique. No se reparten por tarjetas para “dar variedad”.

## Typography

**Display Font:** Poppins, con Segoe UI y sans-serif como fallback.  
**Body Font:** Poppins, con Segoe UI y sans-serif como fallback.

**Character:** Poppins sostiene una voz geométrica, accesible y contemporánea. La implementación carga pesos 400, 500, 600 y 700; la jerarquía nace sobre todo de la escala, las líneas cortas y el contraste entre campos, no de alternar familias.

### Hierarchy

- **Display Home:** peso 500, interlineado muy compacto y tracking de -0.04em; abre el hero con una medida máxima aproximada de 13ch. El énfasis interno sube a 600.
- **Display Proyecto:** peso 500, tracking de -0.035em y medida de 11–15ch; centra la promesa en escritorio y se alinea a la izquierda en móvil.
- **Headline Home:** peso 600 para capítulos públicos, desde el relato cotidiano hasta ubicación y contacto.
- **Headline Proyecto:** peso 500 para una lectura más técnica y arquitectónica; evita convertir la ruta B2B en un brochure pesado.
- **Metric:** peso 500, interlineado de 0.9 y cifras de una sola línea; la escala hace el énfasis.
- **Body:** peso 400, base de 1rem e interlineado de 1.65–1.75; mantener párrafos entre 34ch y 58ch según el contexto.
- **Label:** peso 600 para navegación, formularios y acciones. El peso 700 queda reservado a la marca, CTA compartidos y microetiquetas amarillas.
- **Microcopy:** 0.58–0.82rem para fechas, categorías, notas y estados; nunca se usa para información esencial sin una alternativa legible.
- **Escalas locales de MallExplorer:** `mall-explorer-headline` corresponde al título del capítulo; `mall-explorer-launch`, a la invitación y los estados del visor; `mall-explorer-body`, al cuerpo del panel de activación y su CTA; y `mall-explorer-caption`, a las ayudas y notas de referencia. Conservan Poppins y solo se aplican a este componente, sin sustituir los titulares, cuerpos ni etiquetas compartidos.

**The One Grotesk Rule.** No introducir serif, display ornamental ni una segunda sans serif. El carácter se obtiene con escala, composición y fotografía.

**The Compact Headline Rule.** Los titulares principales usan tracking entre -0.035em y -0.04em, interlineado cercano a 1 y líneas deliberadamente cortas; no se estrechan los cuerpos de lectura.

## Layout

El contenedor compartido tiene un máximo de 1320px con padding lateral fluido (`clamp(1.25rem, 5vw, 5rem)`). Las secciones usan un ritmo vertical amplio (`clamp(5.5rem, 10vw, 9rem)`), mientras la navegación se mantiene compacta: 73px en escritorio y 67px en vistas menores. Los capítulos grandes llegan a los bordes del viewport; su contenido vuelve al contenedor.

Home alterna cinco formas de composición para evitar la sensación de catálogo: hero a sangre; campo editorial de cinco puntos con un núcleo central; mosaico oscuro 2×2 de cuatro planes con filas de 300px; teaser de Proyecto en dos columnas con una imagen secundaria superpuesta; y listas de servicios sin contenedor. Novedades sí usa tarjetas porque cada elemento combina imagen, categoría, texto y enlace. La franja de acceso vuelve a ocupar todo el ancho antes del contacto.

Proyecto organiza una lectura más técnica: hero a sangre, cifras asimétricas alrededor de una síntesis central y un capítulo negro 1+3 con un medio protagonista y tres escenas de mezcla en una fila. Después siguen la composición arquitectónica por capas, la matriz de servicios, la ubicación negra con mapa y el contacto blanco. La información técnica nunca se traslada a Home para llenar espacio.

La respuesta móvil preserva la secuencia, no la miniaturiza. A 1100px se reordena la arquitectura de Proyecto y la navegación se convierte en panel; a 980px se apilan los layouts principales de Home; a 900px la fila de tres escenas de Proyecto pasa a 2+1; entre 700px y 720px el mosaico de Home y los encabezados pasan a una columna; a 620px los campos dobles se apilan; y entre 430px y 540px servicios, métricas, mezcla técnica y footer quedan en una sola columna. Los carruseles horizontales usan `scroll-snap`; los CTA principales ocupan todo el ancho cuando la lectura táctil lo requiere.

MallExplorer se integra en Espacios comerciales (/proyecto), inmediatamente después de la portada y antes de Cifras, dentro del contenedor y el ritmo de sección compartidos. El botón Explorar los espacios de la portada y el enlace de la galería de Inicio llevan a /proyecto#explorar-3d. Su cabecera enfrenta título y explicación; el visor ocupa todo el ancho disponible y usa la altura local `mall-explorer-stage`. A 700px o menos, la cabecera y los pies de figura se apilan y el visor usa `mall-explorer-stage-mobile`. La vista exterior ajusta la distancia de cámara a la proporción del lienzo; el recorrido interior mantiene una altura de mirada de 1.65m en seis puntos conectados por planta. En el segundo piso, la losa está a 4.75m y la cámara a 6.40m; la ruta dibuja una U alrededor del atrio y conserva el vacío central.

**The Chapter Rhythm Rule.** Una pantalla nueva debe alternar composición, tono y escala. No repetir la misma cuadrícula de tarjetas de principio a fin.

**The Audience Split Rule.** Home persuade a visitantes con usos, acceso y contacto general; `/proyecto` concentra cifras, mezcla, arquitectura y conversación comercial.

## Elevation & Depth

El sistema es plano por defecto. La profundidad proviene de fotografía a sangre, overlays negros de legibilidad, recortes, imágenes superpuestas y el cambio decidido entre blanco y negro. No hay sombras decorativas en tarjetas, botones, footer ni bloques de contenido.

La única elevación estructural es el panel móvil de navegación, que usa una sombra amplia y suave para separarse del contenido. El formulario usa un halo amarillo de foco; es una señal de accesibilidad, no una sombra de superficie. Las imágenes secundarias se separan de la principal con un borde blanco grueso, no con drop-shadow.

### Shadow Vocabulary

- **Panel de navegación:** sombra suave de 16px/40px al desplegarse sobre el contenido móvil.
- **Foco de campo:** halo amarillo de 3px alrededor del control activo.

**The Flat by Default Rule.** Si una superficie puede distinguirse por tono, borde, recorte o espaciado, no recibe sombra.

## Shapes

Los grandes capítulos son rectos y a sangre. Los medios, tarjetas de novedades y paneles usan curvas contenidas: 12px para piezas compactas y 16px para composiciones protagonistas. Las imágenes laterales de cifras emplean 14px solo en el borde que entra al lienzo. Los campos usan 8px para sentirse precisos y operativos.

Las acciones textuales son cápsulas completas; flechas, accesos rápidos y marcadores son círculos. Las microetiquetas amarillas usan una curva mínima de 3px, lo bastante pequeña para leerse como señal y no como chip blando. Las imágenes superpuestas llevan un borde blanco de 5–8px que produce un collage arquitectónico limpio.

**The Contained Curve Rule.** Redondear controles y medios, no secciones enteras. Evitar cápsulas en contenido estático y radios grandes que conviertan el mall editorial en una interfaz de app genérica.

## Components

### Buttons

- **Shape:** cápsula completa con altura mínima de 44px; los botones propios de Proyecto usan 48px. Los accesos circulares interactivos nunca bajan de 44×44px.
- **Primary Yellow:** amarillo con texto tinta; pasa al amarillo activo y sube 2px únicamente con puntero fino.
- **Dark / White:** bloques sólidos de alto contraste para superficies claras o fotográficas.
- **Outline:** borde oscuro sobre blanco o borde blanco translúcido sobre negro y fotografía.
- **State:** compresión a 0.97 al activar. Todos los botones reciben un outline amarillo de 3px con offset de 3px; con movimiento reducido se elimina la transformación y se conserva una respuesta de opacidad/color.

### Navigation

Cabecera sticky blanca con filo amarillo de 3px. El layout de escritorio reparte marca, navegación y utilidades en tres columnas; `Inicio` permanece como enlace estable y el grupo central cambia con el contexto. Home ofrece Experiencias, Servicios, Novedades, Visítanos y Proyecto; `/proyecto` ofrece Proyecto, Cifras, Experiencia, Arquitectura, Servicios, Ubicación y Contacto. La puerta hacia la otra página siempre se eleva como CTA amarillo con una flecha circular negra: `Proyecto` mientras se recorre Home e `Inicio` mientras se recorre `/proyecto`. `Proyecto` nunca recibe subrayado: en Home funciona como puerta a otra página y en `/proyecto` nombra la vista; el scrollspy visual de esa página comienza en `Cifras`. Un scrollspy observa los capítulos rotulados con `data-nav-section`, selecciona el más próximo a la línea de activación bajo la cabecera y desplaza una única línea amarilla de 2px entre enlaces durante 250ms con `ease-in-out`; en escritorio esta es la única línea que pueden dibujar los enlaces contextuales, mientras sus estados hover usan solo un baño amarillo tenue. En móvil, donde el indicador flotante se oculta, el subrayado vuelve al enlace activo salvo en `Proyecto`. `aria-current="location"` acompaña el estado y, en la cabecera de Home, `Inicio` usa `aria-current="page"`. El foco por teclado recibe un baño amarillo tenue en lugar de un marco rígido.

Al navegar entre Inicio y Proyecto, la cabecera permanece estable y la página expresa dirección con una cortina amarilla. Hacia Proyecto, la vista anterior se desplaza `-6vw`, baja a 0.18 de opacidad y se contrae a 0.985 en 500ms; la nueva se descubre desde la derecha con un recorte del 100% y `translateX(4vw)` durante 600ms. Al volver a Inicio se invierten izquierda y derecha. Las opciones contextuales salen en 180ms y las nuevas entran en 250ms tras 50ms; su indicador se separa del snapshot para evitar líneas dobles. La transición se omite en la carga inicial y dentro de una misma ruta. Los anclajes conservan desplazamiento suave únicamente dentro de su propia página; durante un cambio real de ruta, la posición se restaura de inmediato bajo la cortina para que Proyecto e Inicio nunca parezcan capítulos de una sola landing. Cuando no existe soporte nativo de View Transitions, la vista nueva conserva la cortina amarilla y el mismo recorte direccional durante 600ms; así el cambio sigue teniendo intención en la vista integrada y navegadores antiguos. A 1100px aparece el botón Menú, se conserva el acceso disponible como utilidad y la navegación se despliega en una placa blanca de 16px. Menú y utilidades miden al menos 44px; el panel comunica su estado con `aria-expanded`, se cierra con Escape, devuelve el foco al disparador y limita su altura con scroll propio para mantener accesibles todas las opciones en pantallas apaisadas.

### Media Cards

Las tarjetas de visita forman un 2×2 de piezas equivalentes de 300px con overlay negro, título, explicación y flecha circular amarilla de 44px. El texto se ancla abajo; la imagen escala solo 1.035 en hover con puntero fino y la flecha rota -24°. Proyecto usa la misma gramática en un bloque 1+3: un render protagonista y tres escenas de 300px. Las tarjetas de novedades y actividades combinan medio arriba y contenido blanco debajo, sin sombra.

Las escenas generadas o conceptuales se identifican de forma visible cerca del medio y también en su texto alternativo cuando corresponde. El disclosure no se oculta en metadata ni se sustituye por un `alt` ambiguo.

**The Visible Evidence Rule.** Una escena conceptual nunca se presenta como evidencia fotográfica del inmueble; debe estar rotulada sin romper la composición.

### Services

Home presenta servicios como una rejilla de iconos lineales, títulos y cuerpo sin cajas. Proyecto usa una matriz con bordes compartidos para comunicar estructura técnica. En ambos casos la iconografía tiene trazo fino y el espacio negativo reemplaza la decoración.

### Imágenes arquitectónicas · cubierta recta

Las vistas arquitectónicas de ambas páginas deben corresponder al modelo actual,
con cubierta recta. No reutilizar las imágenes anteriores de cubierta ondulada.
`SITE_MEDIA` centraliza cinco renders originales del cliente en
`assets/techo-recto`: fachada, pasillo, acceso, plazoleta y vista general elevada.
Las galerías, secciones editoriales y póster de MallExplorer comparten estas fuentes;
la imagen Open Graph también usa la fachada actualizada. Los textos alternativos
describen las vistas actuales y su cubierta recta. Los videos de portada
con cubierta recta y las escenas ilustrativas de experiencia se conservan.

Las copias web se preparan localmente a 1920×1080 con
`scripts/prepare-straight-roof-media.py`; procedencia y hashes en
`public/assets/techo-recto/PROVENANCE.json`. No hay edición generativa del diseño.

### MallExplorer · Experience

Los cambios de exterior a interior, de planta y de regreso al exterior usan una cubierta neutra con fundido de opacidad de 180ms y una etiqueta que identifica el destino. La cámara cambia bajo la cubierta tras 180ms; 80ms después empieza el fundido de salida. Los selectores se bloquean durante el cambio, Cerrar sigue disponible y cancelar o destruir elimina los temporizadores. No se recarga el modelo ni se añade otra pasada de WebGL. En movimiento reducido el fundido dura 120ms; los desplazamientos entre puntos conservan el comportamiento reducido existente. La carga inicial es indeterminada hasta recibir progreso medible y el recorrido anuncia «En movimiento…» mientras avanza.

Extensión de la identidad existente para explorar el modelo real suministrado en SKP y convertido a GLB para la web. El modo Experience combina una vista exterior orbital con recorridos interiores por puntos conectados de planta baja y segundo piso. La planta baja recorre acceso, pasillo y plazoleta; el segundo piso enlaza llegada de escaleras, galería superior, vista al atrio, zona de mesas, balcón y fachada. Conserva Poppins, blanco, neutros y amarillo; el encabezado «Míralo desde otro ángulo.» y la invitación «Elige tu punto de vista.» sostienen la jerarquía sin kickers redundantes.

El lienzo es rectangular, de borde fino y sin sombra; sobre el póster arquitectónico, un overlay oscuro concentra la invitación y el CTA amarillo «Explorar en 3D». Three.js, el modelo y los recursos de ambientación se cargan solo tras esa activación explícita, nunca al entrar a Home. El panel informa del uso de datos y la compatibilidad requerida; durante la carga muestra progreso y Cancelar. Ante un error ofrece «Reintentar vista 3D» y conserva la galería como alternativa.

Una vez listo, el selector superior permite alternar «Vista exterior» y «Recorrer interior», con amarillo para la opción activa. En exterior, arrastrar gira el modelo y la rueda o dos dedos controlan el zoom; los botones de acercar, alejar y «Vista inicial» ocupan la barra blanca inferior izquierda. En interior, el select nativo «Planta del recorrido» ofrece «Planta baja» y «Segundo piso»; la planta baja sigue siendo la opción inicial. Cambiar al segundo piso sitúa directamente al visitante en la llegada de escaleras, sin animar una subida. La barra inferior identifica el punto y su posición entre seis en la planta elegida; «Avanzar» y «Retroceder», o W/S con el lienzo enfocado, conectan los puntos de `MALL_ROUTES`. Arrastrar y las flechas cambian la mirada. Los límites y los desplazamientos en curso deshabilitan las acciones correspondientes. Con `prefers-reduced-motion`, el cambio de punto es instantáneo. «Vista exterior» recupera el encuadre orbital.

«Ambientación» permite mostrar u ocultar ocho autos y catorce personas estáticas CC0, junto con follaje reutilizado del SKP; son referencias ilustrativas de escala y ocupación. Dos figuras del segundo piso reutilizan los recursos existentes: ampliar el recorrido no añade dependencias ni descargas de assets. Los recursos añadidos de ambientación siguen sumando aproximadamente 0.67MB y conservan intacto el modelo de 29.1MB. No hay movimiento autónomo de personajes ni giro automático del modelo. El render funciona por demanda, las sombras se recalculan al cargar o alternar la ambientación y se conservan estáticas durante el movimiento de cámara; el render se pausa fuera de pantalla o con la pestaña oculta.

El refinamiento local de materiales se aplica en runtime según los nombres de material del modelo, sin deducir acabados a partir del color de una fachada. Conserva geometría, colores de albedo, mapas y UV originales; cambia la respuesta superficial, sin sustituir texturas ni añadir envejecimiento. El vidrio usa material físico con rugosidad de 0.075, IOR de 1.5 y capa de barniz, sin transmisión ni una pasada adicional de refracción. Conserva el tinte y solo limita la opacidad a 0.32 cuando el vidrio original ya es transparente, neutro y no tiene mapa.

| Acabado local | Rugosidad | Metalicidad |
| --- | --- | --- |
| Acero y otros metales identificados por nombre | 0.30 | 0.82 |
| Piedra, terrazo y baldosa | 0.38 | 0 |
| Concreto y estuco | 0.88 | 0 |
| Asfalto | 0.96 | 0 |
| Madera y laminado | 0.52 | 0 |
| Tela y cuero | 0.94 | 0 |
| Follaje | 0.82 | 0 |
| Pintura y materiales sin otra clasificación | 0.72 | 0 |

En piedra, concreto, asfalto y madera con mapa de albedo pero sin mapas normales ni bump, el mismo albedo aporta un relieve sutil: escala de 0.008 en asfalto y 0.003 en las demás superficies. La anisotropía se limita a 4 o al máximo soportado por el dispositivo, si es menor. Estos valores pertenecen al visor y no son nuevos tokens de marca.

La iluminación diurna se genera localmente una vez por escena con `Sky` y PMREM, sin HDRI remoto, créditos ni servicio D5. El entorno tiene intensidad de 0.12; el sol cálido, 3.1; la luz hemisférica, 0.35; y la exposición con mapeo tonal ACES, 0.95. El mapa de sombras estáticas es de 2048×2048. Una única sonda local de 128px por cara captura solo la arquitectura al cargar, excluyendo personas y autos para respetar el control de ambientación, y aplica su reflejo a los vidrios con intensidad de 0.7. Es una aproximación fija compartida por todo el edificio: no se actualiza al mover la cámara o alternar la ambientación, no es reflexión dinámica ni ray tracing. El carácter low poly y las texturas originales siguen visibles; el acabado no se presenta como un render fotorrealista de D5. Se mantienen la activación lazy y el dibujo por demanda.

Los controles heredan superficies blancas, bordes finos, iconos lineales y respuesta amarilla. Las acciones exteriores y Cerrar mantienen un mínimo de 46×46px; los botones del selector de vista y del recorrido tienen una altura mínima de 44px. El select de planta mide al menos 46px de alto, con ancho máximo de 150px y fuente local de 0.78rem en escritorio; a 700px o menos pasa a un máximo de 140px y 0.75rem. La etiqueta del punto usa una escala local de 0.85rem en escritorio y 0.78rem a 700px o menos; en ese mismo corte, los botones superiores pasan a 0.72rem. Estas medidas pertenecen a MallExplorer y no redefinen las etiquetas globales. En móvil, los controles superiores se ordenan en dos filas y la barra del recorrido apila el nombre y las dos acciones para conservar el espacio del lienzo.

Cerrar ocupa la esquina superior derecha, cancela la carga o libera escena, recursos y contexto WebGL, devuelve el póster y restaura el foco al CTA. El visor admite foco visible y anuncios de carga, disponibilidad y error; el nombre del punto se anuncia al cambiar de posición.

El pie conserva «Modelo de referencia. Personas y autos ilustrativos. Acabados sujetos a ajustes.» y adapta las instrucciones al exterior o al recorrido interior. Esa aclaración acompaña siempre la experiencia sin presentarla como fotografía real, desplazamiento libre por todo el inmueble ni acceso a todos los locales. La implementación se concentra en `mall-explorer.*`, `mall-scene.ts` y `mall-walk.ts`. Evidencia del exterior y la planta baja: `../.codex_artifacts/recorrido-3d/exterior-desktop.jpg`, `../.codex_artifacts/recorrido-3d/entrada-desktop.jpg`, `../.codex_artifacts/recorrido-3d/plazoleta-desktop.jpg` y `../.codex_artifacts/recorrido-3d/interior-mobile.jpg`. Evidencia de la extensión al segundo piso: `../.codex_artifacts/segundo-piso-3d/galeria-desktop-final.jpg`, `../.codex_artifacts/segundo-piso-3d/atrio-desktop.jpg` y `../.codex_artifacts/segundo-piso-3d/segundo-mobile.jpg`.

El tratamiento local de superficies se concentra en `mall-materials.ts` y la iluminación en `mall-scene.ts`, conservando rutas, distribución y marca. Evidencia del refinamiento: `../.codex_artifacts/materiales-iluminacion-3d/pasillo-desktop.jpg`, `../.codex_artifacts/materiales-iluminacion-3d/segundo-piso-desktop.jpg` y `../.codex_artifacts/materiales-iluminacion-3d/segundo-piso-mobile.jpg`.

### Inputs / Fields

- **Style:** fondo blanco, borde negro al 20%, radio de 8px y padding de 0.9rem/0.95rem.
- **Focus:** borde oliva oscuro y halo amarillo translúcido de 3px.
- **Required / Error:** los campos obligatorios declaran `required` y `aria-required`; el error usa texto rojo asociado con `aria-describedby` y el primer control inválido recibe foco al enviar. No depender solo del color.
- **Responsive:** la fila doble pasa a una columna a 620px y el CTA ocupa todo el ancho.

### Project Metrics

Las cifras son tipografía, no tarjetas. Cada valor se apoya en una etiqueta compacta con una línea amarilla superior; en escritorio se distribuyen de forma asimétrica alrededor del resumen, pasan a 2×2 y finalmente a una lista de una columna con separadores.

### Asistente de orientación

El chat reconoce variantes cotidianas como «puedo ir con mi perro», «mi perrita», «mi gato», parqueadero, ascensor y carga eléctrica. Las ocho FAQ se conservan; las consultas de un solo servicio reciben una respuesta enfocada. Mascotas se responde afirmativamente en el contexto del proyecto previsto, conservando el aviso de condiciones de ingreso pendientes. Tarifas de parqueo, gratuidad y requisitos de mascotas se remiten a información oficial o asesor, sin inventarlos. Saludos, agradecimientos y respuestas de servicios ofrecen preguntas relacionadas mediante botones al final de la conversación.

Al enviar, el mensaje aparece de inmediato y tres puntos acompañan «Preparando respuesta…» durante una pausa de 550–1100ms según la longitud de la respuesta. La cabecera conserva «Orientación automática»; no se simula una lectura humana. Mientras hay una respuesta pendiente se evita el envío duplicado y se permite preparar el siguiente borrador. Borrar cancela la respuesta; cambiar de audiencia la completa en su historial original; destruir limpia los temporizadores. Los puntos usan transform y opacidad con los tokens existentes y quedan estáticos con movimiento reducido. Todo sigue resolviéndose localmente sin API ni créditos de generación.

El chatbot es una extensión local del sistema, no una personalidad independiente. Se abre desde una pestaña negra fija con señal amarilla y ocupa un panel compacto de 390px; en móvil se convierte en una superficie casi completa para preservar lectura, teclado y acciones. El lanzador de escritorio se eleva a 6.5rem del borde inferior, más el área segura, para coincidir con el símbolo superpuesto del video de portada. En móvil conserva su botón circular a 1rem y respeta el área segura. La cabecera negra identifica a Girardot Express y declara de forma visible que se trata de orientación automática. El historial usa mensajes blancos para el asistente y tinta para el visitante; los accesos rápidos y acciones comerciales son controles cápsula, nunca etiquetas estáticas.

En pantallas de hasta 560px o con puntero táctil, abrir el chat enfoca Cerrar sin desplazar la página ni activar el teclado. El usuario toca el campo cuando quiere escribir; la tipografía del campo es de 16px para evitar zoom automático. El panel sigue la altura y el desplazamiento de VisualViewport, con respaldo en la altura de ventana, y respeta las áreas seguras. Bajo 480px visibles se compactan los espacios y se ocultan temporalmente las herramientas secundarias, conservando cabecera, conversación desplazable, aviso de privacidad y compositor. Mientras está abierto se bloquea el desplazamiento de la página de fondo en móvil; cerrar o destruir el componente restaura el valor previo y elimina los listeners. En escritorio se mantiene el foco inicial en el campo.

Las respuestas se resuelven en el navegador mediante intenciones y palabras relacionadas validadas. No se almacenan ni se envían conversaciones. Dirección, correo, WhatsApp y cifras provienen de `SITE_CONTENT` y `COMMERCIAL_FACTS`; marcas, precios, disponibilidad y apertura nunca se inventan. Cuando no existe coincidencia clara, el asistente ofrece categorías conocidas y salida directa a un asesor. Escape cierra el panel, el foco vuelve al lanzador y el historial se anuncia como un registro vivo sin convertir la experiencia en un modal obligatorio.

### Reveal, Route Motion and Marquee

Los heroes abren con una cortina vertical de 900ms y texto escalonado de 600ms a 180/240/300ms. Fuera del hero, Home revela una sola vez los contenedores de relato, visita y programación, servicios, marcas, teaser de Proyecto, novedades, acceso y contacto. Cada grupo parte en `opacity: 0` y `translateY(8px)` —acompañando la dirección natural del scroll— y llega a `opacity: 1` y `translateY(0)` en 600ms con `ease-out`. Proyecto usa la misma distancia y duración entre Cifras y Contacto: la sección permanece estable mientras sus objetivos internos de copy, medios, cifras, ítems y formulario se revelan con demoras de 30ms a 150ms para ordenar la lectura.

El marquee dura 30s, es lineal, incluye control visible para pausar y se detiene con hover o foco. El video de Proyecto se reproduce siempre sin audio y tiene un control circular de pausa/reproducción de 46px con estado anunciado. En `prefers-reduced-motion`, el scroll suave se desactiva; todos los objetivos de reveal quedan visibles con `transform: none` y `transition: none`; y la transición direccional de ruta se convierte en un fundido de opacidad de 200ms. El cambio contextual de navegación conserva solo un fundido de 160ms, sin desplazamiento. Home elimina la cortina, reduce la entrada del copy a un fundido de 180ms, detiene el ticker y oculta su grupo duplicado; Proyecto sustituye el video por el poster y oculta su control. Ninguna información ni acción depende de estas animaciones.

**The Pauseable Motion Rule.** Ningún movimiento continuo puede ser obligatorio para leer o actuar; debe poder pausarse y desaparecer sin perder contenido.

### Footer

El footer es un capítulo negro a sangre con navegación en cuatro columnas, enlaces atenuados y un wordmark monumental. “Express” aparece en amarillo. En móvil la estructura baja a dos columnas y luego a una; el wordmark puede partir línea, pero conserva su escala de cierre.

## Do's and Don'ts

### Do:

- **Do** usar blanco, negro y amarillo como el sistema activo y dejar que el logo aporte la identidad multicolor.
- **Do** componer cada página como una secuencia de capítulos con ritmo, no como una colección uniforme de módulos.
- **Do** reservar tarjetas para contenido que realmente combina medio, metadata y acción.
- **Do** usar renders, video y escenas lifestyle amplias con overlays solo cuando protejan la lectura.
- **Do** rotular de forma visible toda escena generada o conceptual y mantener alt text honesto.
- **Do** mantener el CTA, la ubicación y el contacto accesibles desde móvil.
- **Do** conservar foco visible, pausa del marquee y una experiencia equivalente con `prefers-reduced-motion`.
- **Do** mantener cifras y argumentos B2B dentro de `/proyecto`.

### Don't:

- **Don't** copiar logos, marcas, campañas, eventos o mensajes de CityPlaza; solo se hereda su disciplina compositiva aprobada.
- **Don't** convertir naranja, turquesa o verde en rellenos arbitrarios para añadir variedad.
- **Don't** usar degradados decorativos, glassmorphism, sombras de tarjeta o contenedores anidados sin función.
- **Don't** introducir otra familia tipográfica ni pesos fuera de 400, 500, 600 y 700.
- **Don't** llenar Home con cifras técnicas, disponibilidad, marcas o fechas no autorizadas.
- **Don't** presentar una escena ilustrativa como fotografía real del centro comercial.
- **Don't** depender de hover, video o movimiento para comunicar información esencial.
- **Don't** usar radios grandes o cápsulas para superficies estáticas; el lenguaje sigue siendo arquitectónico.


## Refinamiento de versión 2 del 6 de septiembre de 2026

La cabecera usa la versión horizontal oficial extraída de la página 6 del manual, sin reconstruir letras ni recolorear el símbolo. Mide 100 px en escritorio y 88 px en móvil; el logo horizontal ocupa 180/160 px de ancho con proporción intacta. El menú abierto sobre fondo blanco y un separador inferior sustituyen la caja redondeada anterior. El CTA comercial usa amarillo #F3B71A, radio de 12 px y una flecha sencilla. El pie conserva el PNG definitivo vertical sobre fondo claro. El menú móvil se activa hasta 1200 px.

La navegación pública enlaza Quiénes somos, Explora el mall, Nuestras marcas, Galería, Cómo llegar y Contacto, con acceso destacado a Espacios comerciales. Home conserva el lema, usa el video arquitectónico existente y comunica la primera etapa prevista para finales de 2026. Las categorías de marcas explican la futura oferta sin marcas ficticias. La galería ofrece ampliación a pantalla completa y controles de teclado. La ubicación tiene mapa interactivo, Google Maps y Waze.

La página comercial conserva su video y arquitectura, con argumento estratégico, cifras seleccionables, etapas, infraestructura y galería. No muestra áreas por nivel mientras se aclara el total del material. Los servicios y fechas se describen como previstos. Ambos videos respetan movimiento reducido y la pausa manual; las transiciones y los controles acompañan la exploración sin bloquear la navegación.

No se utilizan fotografías ficticias de obra ni se anuncia un recorrido 360 disponible. Las imágenes suministradas conservan su condición de renders y visualizaciones. La aparición de marcas confirmadas, las fotos de construcción y el recorrido 360 requieren material adicional.


## Corrección de navegación y ritmo editorial, 6 de septiembre de 2026

Esta revisión sustituye las decisiones anteriores de cabecera alta, programación en carrusel y filtros de marcas sin resultados. Impeccable, Taste y Emil Kowalski orientan una evolución de la identidad blanco/negro/amarillo existente. Variación 6, movimiento 3, densidad 4: imágenes protagonistas, tipografía editorial, transiciones cortas y jerarquía legible.

Secuencia real y del menú: Inicio → Quiénes somos → Explora el mall (incluye servicios) → Nuestras marcas → Galería → Cómo llegar → Contacto. La actualización de obra se resume entre galería y ubicación. La invitación B2B cierra Home y conduce a `/proyecto`; su CTA permanece disponible en el header. No se cambian las URLs públicas ni los nombres del menú.

El relato inicial explica el concepto junto a un render; el mosaico de experiencias concentra las escenas de estilo de vida. Se eliminan repeticiones de estas escenas en un carrusel de programación no confirmada y en tarjetas de novedades. Las cinco categorías futuras se muestran como información, sin botones que simulen un directorio disponible. Se conserva el aviso de marcas pendientes y el acceso a Instagram.

Los destinos nativos usan scroll-margin; Angular recibe la altura real de la cabecera mediante ViewportScroller.setOffset. No aplicar scroll-padding al viewport: desplaza también enlaces sticky al enfocarlos y contamina el historial. El indicador se calcula con posiciones actuales de los capítulos del menú; servicios y otros subapartados heredan el capítulo anterior. Las secciones admiten foco programático para que el teclado continúe desde el destino. Los cambios entre Home y Proyecto usan una cortina diagonal a 45° en amarillo #F3B71A, con negro #101010 como acento breve. Las franjas se solapan 3 px para evitar rendijas. La entrada cubre en 400 ms; la salida dura 375 ms después de que la nueva ruta y su posición se hayan pintado, aproximadamente 800 ms en total. El amarillo permanece protagonista, sin pausa a pantalla negra. El guard espera la cobertura antes de cambiar de vista; el servicio escucha el fin o cancelación de la navegación para retirar la cortina. No se utilizan snapshots nativos. La misma solución funciona en móvil con menos franjas visibles. Carga inicial, enlaces dentro de una página, teclado y movimiento reducido conservan navegación inmediata. Redimensionar o cancelar limpia la cortina; un límite de 1600 ms evita dejar contenido tapado si tarda una ruta. Los titulares aparecen junto con la vista y el fundido del video permanece independiente. La carga inicial con fragmento se resuelve después de NavigationEnd, cuando la ruta está insertada.

Verificación de regresión reproducible: `scripts/check-navigation.cjs`, con Playwright. Recorre enlaces reales de ambas rutas, orden, geometría de llegada, historial, enlaces repetidos/directos/cruzados, galería, Escape y cambios de ancho. La validación visual se realiza sobre esas llegadas, no desplazando los destinos desde el código de prueba.


## Entrada de video

Inicio y Espacios comerciales mantienen visible un fotograma extraído del video original mientras se carga el medio. Un fundido de opacidad de 600 ms, con cubic-bezier(0.22, 1, 0.36, 1), comienza cuando playing y requestVideoFrameCallback confirman un fotograma presentado. No hay cortina ni desplazamiento del medio; pausar o reanudar no repite la entrada. Si falla el video queda la imagen. Se respeta movimiento reducido. El poster y el video comparten encuadre para evitar un cambio de escena durante la transición.

Verificación específica de la cortina: scripts/check-route-curtain.cjs comprueba cobertura antes del cambio, ambos sentidos, escritorio y móvil, historial, cancelación rápida, redimensionado, teclado, movimiento reducido y ausencia de WAAPI. Las capturas de cobertura se comprobaron píxel a píxel: amarillo uniforme, sin rendijas. La captura comienza después de detener cualquier desplazamiento suave iniciado por el foco del menú móvil.


La cortina invierte tanto el desplazamiento como el orden de las franjas al regresar a Inicio: hacia Proyecto baja de arriba a abajo y hacia Inicio sube de abajo a arriba. La firma tipográfica usa la composición escalonada elegida: Girardot en Poppins 600 y Express, más grande, en Poppins 700. Hacia Proyecto, Girardot queda arriba a la izquierda y Express abajo a la derecha; al volver a Inicio, Express queda arriba a la izquierda y Girardot abajo a la derecha. Ambas palabras permanecen horizontales. El bloque se centra y se adapta a escritorio y móvil. La firma está impresa dentro de los paneles amarillos: cada panel recorta una copia alineada de la composición y transporta su fragmento al entrar y salir. La contrainclinación conserva las palabras horizontales al ensamblarse. No hay fundido, demora ni animación independiente del texto. La composición escalonada queda aplicada en ambas direcciones.


Las franjas amarillas ahora llegan al 86 % de su ancho, con separaciones negras deliberadas durante el ensamblaje. Al final de cada entrada recuperan el 100 % y el solape de 3 px cierra las juntas por completo. Se animan solamente transformaciones, sin modificar la duración de cobertura. La firma forma parte de las franjas desde el comienzo y se ensambla con ellas, sin tiempos de opacidad. Este ensamblaje se aplica en ambos sentidos de navegación.



### Cifras comerciales: alineación centrada (7 de septiembre de 2026)
Las cuatro cifras, sus etiquetas, la instrucción y la explicación seleccionada se centran dentro de la composición. Se conserva la grilla de tres columnas en escritorio y de dos columnas con explicación inferior en pantallas menores. La alineación elimina el vacío óptico que dejaban los valores cortos pegados al borde izquierdo de la columna derecha. Verificado a 1440, 1024, 390 y 320 px, con las cuatro selecciones operativas y sin desbordamiento; capturas en .codex_artifacts/metrics-centered/.


### Navegación con zonas estables (7 de septiembre de 2026)
La cabecera comparte logo, zona de enlaces y un único CTA de 204 px a la derecha. El CTA conserva su nodo y ubicación: Espacios comerciales desde Home e Inicio desde la página comercial, con flecha en el sentido correspondiente. Los enlaces de cada recorrido ocupan un grupo flexible; Galería, Cómo llegar y Contacto forman un grupo común con posiciones idénticas en ambas rutas. En móvil todos los enlaces ocupan el mismo ancho y el CTA queda al final del menú. El indicador de sección también acompaña la presentación comercial. Se mantiene el orden natural del DOM y del teclado. Verificación visual a 1440, 1280, 1201 y 390 px; capturas en .codex_artifacts/header-stable/.


Ajuste aprobado por indicación del usuario: los enlaces se agrupan hacia la derecha con separaciones uniformes y compactas; se elimina la distribución space-between del grupo de temas. Se conservan el CTA fijo y las posiciones de los enlaces comunes. Comprobado en ambas rutas a 1440, 1201 y 390 px; evidencia en .codex_artifacts/header-right/.


### Indicador durante navegación por secciones (7 de septiembre de 2026)
Al seleccionar un enlace, el subrayado sigue directamente el destino y conserva esa selección durante el desplazamiento suave, sin recorrer los capítulos intermedios. Al llegar se libera el seguimiento; rueda, tacto, teclas de desplazamiento o interacción fuera del header devuelven el control a la sección visible. Un segundo clic sustituye el destino pendiente. El historial sigue la posición restaurada. El bloqueo tiene liberación de respaldo y limpieza al destruir el componente. Prueba reproducible: scripts/check-nav-indicator.cjs, en escritorio y móvil y en ambas rutas, con captura de estados intermedios, clics sucesivos e interrupción manual.
### Versión 3 · 14 de septiembre de 2026

Refinamiento sobre la versión 2 aprobada: header compacto a la derecha, logo oficial ampliado, enlaces de 14 px y cambio a menú móvil en 1280 px. Se conserva la cortina diagonal y los controles de video. Experiencias y facilidades forman un capítulo; sostenibilidad ocupa una sección con render a todo el ancho y tratamiento verde oscuro. Azul #1A5B9E en selección de categorías, preguntas y mapas; cian #31C4EC en iconos sobre fondo oscuro. Amarillo #F3B71A permanece en las acciones principales y la transición aprobada.

Nueva página de preguntas frecuentes con la misma tipografía y reglas de espaciado del sitio, controles nativos, búsqueda y filtros. Los perfiles del bot distinguen visitantes y marcas con historiales separados. Alcance, dependencias de contenido y validación: CAMBIOS_V3.md.
### Logo del footer · V3

El pie usa el tratamiento negativo blanco mostrado en la página 7 del manual: el PNG oficial transparente se presenta con `brightness(0) invert(1)`, conservando su silueta, composición y proporciones. Se retira la placa blanca para integrar la firma en el fondo oscuro. El tratamiento queda limitado al footer.

### Cortina con logo · V3

La firma tipográfica se sustituye por el PNG vertical oficial, centrado y sin alterar sus colores ni proporciones. Superficie amarilla luminosa continua (#FFB600 → #FFCF17 → #FFE236), capa de contraste naranja #ED6C19 y marcas de agua suaves en esquinas opuestas. El degradado y el logo están impresos en cada panel y se ensamblan juntos; no hay aparición independiente del logo. La dirección y las esquinas se invierten al regresar a Inicio, sin reflejar el imagotipo. Se conservan el ritmo de entrada/salida, el cierre de juntas y las rutas accesibles sin animación. Si el logo aún no se ha decodificado o falla, la navegación es inmediata. Tokens limitados a `_route-curtain.scss`, sin cambiar la paleta del resto del sitio.
### Ajuste del mapa · V3

El mapa vuelve a dominar la sección: se elimina la tarjeta blanca y la botonera azul. Ambas páginas conservan los colores naturales del mapa, sin filtro de escala de grises. Espacios comerciales usa marco de 16 px y 520 px de alto en escritorio; Home mantiene 380 px. Las referencias de «Explorar el entorno» permanecen siempre visibles debajo del mapa, con selección amarilla y controles integrados al fondo de cada página. El título y el enlace externo comparten una fila; las opciones aprovechan todo el ancho disponible. Google Maps se mantiene como proveedor de cartografía y búsqueda; este ajuste recupera la presentación anterior, no sustituye la cartografía. Validado en ambas páginas a 1440 y 390 px, sin desbordamientos, con cambio de referencia y enlace externo correctos. Compilación de producción correcta.

El logo del footer se centra sobre su descripción. El mapa se crea después del primer render del cliente; cada selección o recarga monta una instancia nueva. Se ignora el evento inicial de about:blank, se muestra un estado de carga y, tras 12 segundos de espera, opciones de reintento y apertura externa. El control Recargar mapa permanece disponible. Verificación: scripts/check-map-loading.cjs, en escritorio y móvil, navegación entre rutas y conexión detenida con recuperación.

### Revisión del cliente sobre V3 · 23 de septiembre de 2026

La marca gana presencia real: logo oficial de 300 px en escritorio, 260 px en tablet y 208–244 px en teléfonos; logo del pie de 224 px. La cabecera mide 144, 124 o 112 px según el ancho, y el menú se recoge a 1360 px. Se conserva la cortina y el orden de navegación.

Las preguntas frecuentes se reúnen en ocho temas con respuestas compartidas con el bot; las 21 formulaciones originales se conservan como términos reconocibles. El contenido proyectado mantiene su condición de previsto y las particularidades comerciales siguen diferenciadas.

El usuario confirmó un mapa amplio con referencias simultáneas. Esta revisión sustituye el selector de lugares y el iframe anteriores por cartografía interactiva con Leaflet: mall destacado, estadio, universidades y terminal visibles juntos, y Vía Nariño trazada con geometría verificada. Los títulos y las acciones de llegada van encima; el mapa ocupa todo el ancho en ambas páginas. Home usa una superficie clara; Espacios comerciales conserva el capítulo oscuro. Cartografía sin escala de grises, con atribución visible, controles de zoom y recuperación del encuadre. La fuente y el alcance se documentan en CAMBIOS_V3_REVISION_2026-09-23.md.

### Navegación móvil y logo de escritorio · 5 de octubre de 2026

Por solicitud del usuario, el logo de escritorio pasa de 300 a 150 px y la cabecera de 144 a 96 px. Los enlaces de escritorio pasan de 14 a 16 px. Se conserva el menú desplegable hasta 1360 px. En móvil, Menú/Cerrar usa 16 px y un control visible de 104 px; los enlaces son de 20 px, con filas de al menos 60 px, y el CTA de 18 px. El logo móvil conserva su tamaño amplio cuando hay espacio y puede contraerse en teléfonos estrechos para no cruzarse con Cerrar. El menú tiene desplazamiento propio en pantallas bajas y se sitúa por encima del chat cuando está abierto. Verificación: Home y Proyecto a 320, 360, 390, 430, 768, 844, 1361 y 1440 px; cierre con Escape, anclas y CTA accesibles. Capturas en ../.codex_artifacts/mobile-navigation-2026-10-05/.

### Prueba de material audiovisual del cliente · 6 de octubre de 2026

Inicio usa `Vídeo sin título (2).mp4` (20 s); Espacios comerciales usa `Vídeo sin título (1).mp4` (10 s). Se conserva la entrada suave del video, el póster y los controles existentes. Versiones H.264 sin audio a 1920 × 1080 y 1280 × 720 para teléfonos hasta 767 px, con metadatos al principio del archivo. Los medios anteriores permanecen disponibles para comparar o revertir la prueba.

De `Vídeo sin título.mp4` se extraen cinco fotogramas Full HD en WebP: fachada (0,4 s), recorrido cubierto (2,8 s), acceso (4,9 s), plazoleta (8,05 s) y vista aérea (9,15 s). Sustituyen las visualizaciones anteriores en Quiénes somos, Compras y servicios, Sostenibilidad, presentación comercial, Arquitectura y las dos galerías. Los nombres y textos alternativos describen cada vista; se mantiene la identificación de renders/visualizaciones del proyecto. La galería comercial conserva el fotograma completo en proporción 16:9. Los archivos y sus dimensiones se centralizan en `src/app/core/site-media.ts`.

Revisión en navegador a 1440 y 390 px: videos seleccionados según el ancho, reproducción, imágenes decodificadas, cinco selecciones por galería y ampliación sin desbordamiento. Compilación de producción correcta. Capturas e informes: `../.codex_artifacts/media-update-2026-10-06/`. El detector de diseño señala bindings `[src]` de Angular como imágenes faltantes y escalas tipográficas existentes; las imágenes se verificaron cargadas en navegador. El video comercial suministrado contiene texto del logo deformado en algunas tomas; esta prueba conserva el material recibido.

Al montar las fuentes mediante bindings, una fuente inicialmente vacía podía dejar activo el estado de error incluso después de cargar el archivo válido. El reproductor compartido limpia ese estado al decodificar datos y vuelve a evaluar la reproducción, respetando pausa manual, visibilidad y movimiento reducido. La prueba de reproducción espera tanto el destino del enlace como el final del desplazamiento; el caso de fallo de red espera la hidratación de los controles antes del reintento. No se modifica la duración ni la composición de la cortina.

Verificación de reproducción: 14 casos aprobados con `scripts/check-hero-video.cjs`, incluidos cambios repetidos entre las rutas, pausa manual, pestaña en segundo plano, acciones del hero comercial, movimiento reducido y recuperación mediante Reproducir tras un fallo real de descarga. Informe: `../.codex_artifacts/media-update-2026-10-06/playback/results.json`.

### Acceso de WhatsApp en la cabecera compacta · 6 de octubre de 2026

El icono suelto se presenta como un botón de 48 × 48 px, con el mismo fondo, borde, radio y altura de Menú/Cerrar. Se usa el SVG de WhatsApp de Bootstrap Icons, presentado como imagen de 24 px para evitar que las reglas de trazos del menú deformen sus contornos. El dibujo inicial a mano se retira tras la revisión del usuario. Fuente: https://github.com/twbs/icons/blob/main/icons/whatsapp.svg; licencia MIT incluida en `public/assets/icons/BOOTSTRAP-LICENSE.txt`. El orden del DOM coincide con la cabecera visible: logo, WhatsApp y Menú, conservando el destino existente y el foco de teclado. Se mantiene su visibilidad entre 601 y 1360 px. Comprobación de Home y Proyecto en ocho anchos entre 320 y 1440 px, con alineación, foco, menú y ausencia de desbordamiento; icono centrado en ambos ejes a densidades 1× y 2×. Compilación correcta; evidencia en `../.codex_artifacts/whatsapp-header-2026-10-06/`.

## Privacidad y lectura legal · 9 de octubre de 2026

Las rutas `/privacidad`, `/cookies` y `/terminos` extienden el lenguaje de FAQ: Poppins, fondo blanco, columna de lectura de 72ch, títulos contenidos y navegación legal de texto. El footer incluye sus accesos y el enlace a solicitudes sobre datos. Privacidad muestra explícitamente su estado de borrador y usa `noindex` mientras faltan identificación y procedimientos del responsable; la marca no sustituye la razón social.

Formulario: autorización desmarcada y enlace de privacidad en otra pestaña. «Enviar solicitud» registra la consulta con Netlify Forms y la notificación se dirige a comercial@girardotexpress.com.co. Los estados Enviando/Solicitud enviada/Error se anuncian con status/alert; se bloquea el reenvío mientras está pendiente o confirmado. En error se conservan los campos y se ofrece WhatsApp como alternativa. «Nueva consulta» limpia los campos y reinicia la autorización. La copia local muestra que no puede enviar; nunca simula éxito. El correo oficial se comparte mediante SITE_CONTENT. La confirmación de registro no acredita lectura del correo. Chat: procesamiento local y borrado de ambas conversaciones/borradores. El mapa conserva sus avisos de proveedor.

Validación: 97 pruebas unitarias, compilación de producción con siete rutas prerenderizadas y recorrido de privacidad en 1440/390px (`scripts/check-privacy.cjs`). El registro de consentimiento en servidor, la atención de solicitudes por la empresa y las licencias de los medios suministrados no se presentan como resueltos. Evidencia local en `../.codex_artifacts/privacy-2026-10-09/`.
