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

**The One Grotesk Rule.** No introducir serif, display ornamental ni una segunda sans serif. El carácter se obtiene con escala, composición y fotografía.

**The Compact Headline Rule.** Los titulares principales usan tracking entre -0.035em y -0.04em, interlineado cercano a 1 y líneas deliberadamente cortas; no se estrechan los cuerpos de lectura.

## Layout

El contenedor compartido tiene un máximo de 1320px con padding lateral fluido (`clamp(1.25rem, 5vw, 5rem)`). Las secciones usan un ritmo vertical amplio (`clamp(5.5rem, 10vw, 9rem)`), mientras la navegación se mantiene compacta: 73px en escritorio y 67px en vistas menores. Los capítulos grandes llegan a los bordes del viewport; su contenido vuelve al contenedor.

Home alterna cinco formas de composición para evitar la sensación de catálogo: hero a sangre; campo editorial de cinco puntos con un núcleo central; mosaico oscuro 2×2 de cuatro planes con filas de 300px; teaser de Proyecto en dos columnas con una imagen secundaria superpuesta; y listas de servicios sin contenedor. Novedades sí usa tarjetas porque cada elemento combina imagen, categoría, texto y enlace. La franja de acceso vuelve a ocupar todo el ancho antes del contacto.

Proyecto organiza una lectura más técnica: hero a sangre, cifras asimétricas alrededor de una síntesis central y un capítulo negro 1+3 con un medio protagonista y tres escenas de mezcla en una fila. Después siguen la composición arquitectónica por capas, la matriz de servicios, la ubicación negra con mapa y el contacto blanco. La información técnica nunca se traslada a Home para llenar espacio.

La respuesta móvil preserva la secuencia, no la miniaturiza. A 1100px se reordena la arquitectura de Proyecto y la navegación se convierte en panel; a 980px se apilan los layouts principales de Home; a 900px la fila de tres escenas de Proyecto pasa a 2+1; entre 700px y 720px el mosaico de Home y los encabezados pasan a una columna; a 620px los campos dobles se apilan; y entre 430px y 540px servicios, métricas, mezcla técnica y footer quedan en una sola columna. Los carruseles horizontales usan `scroll-snap`; los CTA principales ocupan todo el ancho cuando la lectura táctil lo requiere.

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

### Inputs / Fields

- **Style:** fondo blanco, borde negro al 20%, radio de 8px y padding de 0.9rem/0.95rem.
- **Focus:** borde oliva oscuro y halo amarillo translúcido de 3px.
- **Required / Error:** los campos obligatorios declaran `required` y `aria-required`; el error usa texto rojo asociado con `aria-describedby` y el primer control inválido recibe foco al enviar. No depender solo del color.
- **Responsive:** la fila doble pasa a una columna a 620px y el CTA ocupa todo el ancho.

### Project Metrics

Las cifras son tipografía, no tarjetas. Cada valor se apoya en una etiqueta compacta con una línea amarilla superior; en escritorio se distribuyen de forma asimétrica alrededor del resumen, pasan a 2×2 y finalmente a una lista de una columna con separadores.

### Asistente de orientación

El chatbot es una extensión local del sistema, no una personalidad independiente. Se abre desde una pestaña negra fija con señal amarilla y ocupa un panel compacto de 390px; en móvil se convierte en una superficie casi completa para preservar lectura, teclado y acciones. La cabecera negra identifica a Girardot Express y declara de forma visible que se trata de orientación automática. El historial usa mensajes blancos para el asistente y tinta para el visitante; los accesos rápidos y acciones comerciales son controles cápsula, nunca etiquetas estáticas.

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
