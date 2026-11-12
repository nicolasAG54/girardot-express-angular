# Piloto 3D de Girardot Express

La página carga una copia web del SKP del cliente, con **vista exterior y recorrido
por seis puntos conectados en cada una de sus dos plantas**. Es un piloto local sin publicar.

## Uso

En **Espacios comerciales**, justo después de la portada, pulsa **Explorar en 3D**,
luego **Recorrer interior**. El botón **Explorar los espacios** de la portada y el
enlace de la galería de Inicio llevan a `/proyecto#explorar-3d`.
El selector **Planta del recorrido** permite elegir **Planta baja** o **Segundo
piso**. El cambio lleva directamente al inicio de la ruta de esa planta. Avanza
y retrocede entre puntos; arrastra para mirar alrededor. Con el lienzo
enfocado, W/S avanza/retrocede y las flechas cambian la mirada. La preferencia de
movimiento reducido elimina las transiciones. **Vista exterior** restablece la
cámara orbital. **Ambientación** muestra u oculta los objetos añadidos.

La planta baja conecta acceso, pasillo comercial y plazoleta. El segundo piso
recorre la llegada de escaleras, galería superior, vistas al atrio y zona de mesas.
Su losa está a 4.75 m y la cámara a 6.40 m, manteniendo 1.65 m de altura peatonal.
La ruta superior rodea el vacío central. No implementa movimiento libre,
colisiones generales, animación de subida por escaleras ni ingreso a cada local.
Las rutas siguen coordenadas del modelo: revisar cada tramo con el cliente antes
de publicar. No se modificaron muros, fachadas, mobiliario ni distribución.

## Fuente y conversión

- Fuente: `C:/Users/ni-co/Downloads/GirardotExpress.skp`, 257424784 bytes.
- SHA-256: `B49BAC14664E53007703E76F9B97BACE8588191DF5C298875AA3FA121E2B5AF4`.
- Lectura local con la API C oficial de SketchUp 2025; sin abrir D5 ni guardar el
  SKP. El conversor y los informes están en `../.codex_artifacts/modelo-web`, desde
  la raíz Angular.
- Copia: caras visibles, transformaciones y materiales de la fuente. Texturas
  limitadas a 1024 px. La simplificación puede perder detalles pequeños.
- `girardot-express.glb`: 29112504 bytes, unos 2.31 millones de triángulos.
- Optimización: gltfpack 1.3.0, `-mm -cc -vpf -vtf -si 0.22 -se 0.001`.
- El derivado fusiona geometría y pierde selección por elemento; el SKP sigue
  siendo la fuente editable.

## Visor y ambientación

El visor se implementa con Three.js y GLTFLoader. El módulo y los GLB se cargan
solo después del clic. Meshopt se incluye en el código local; no hay servicios de
IA, renders remotos, créditos ni descargas de modelos desde terceros al visitar.

Se añadieron ocho autos estacionados, catorce personas en poses estáticas (doce
en planta baja y dos en la galería superior) y follaje
reutilizado del propio SKP en la franja de jardineras. La ambientación forma un
grupo independiente. Las figuras y autos son ilustrativos y de baja complejidad;
no representan marcas, operadores ni ocupación confirmada. Las fuentes CC0 y los
hashes de las copias están en `ambience/PROVENANCE.json`. Las poses naturales se
hornean con `scripts/prepare-mall-ambience.mjs`; los GLB originales se conservan
junto a sus derivados para regenerarlos.

Los acabados se ajustan al cargar mediante `mall-materials.ts`, sin reescribir el
GLB: piedra/terrazo semimate, concreto y asfalto rugosos, metal satinado, madera
y tela diferenciadas. El vidrio usa reflexión física sin pases de transmisión;
se conservan colores, texturas y opacidad de los paneles teñidos. El relieve fino
de pisos y concreto reutiliza las texturas originales. Filtrado anisotrópico
limitado a 4 para mantener legibles las texturas vistas en diagonal.

Hay luz solar cálida, relleno de cielo y un entorno de reflexión de cielo diurno
analítico, calculado localmente una vez con Three.js Sky/PMREM. No se descarga
ningún HDRI ni se añade geometría arquitectónica. Una sonda cúbica local de 128 px
captura una vez la arquitectura (sin figuras ni autos) para reflejarla en los vidrios; no
genera reflejos dinámicos ni trazado de rayos. Las sombras estáticas de 2048 px se
calculan al cargar o cambiar ambientación. La imagen se dibuja al interactuar o
al desplazarse entre puntos y se pausa fuera de pantalla. Se limita la densidad
de píxeles a 1.5. Al cerrar se cancelan descargas y se liberan recursos WebGL.

## Límites antes de publicar

- Validar rendimiento y temperatura en teléfonos físicos: emular su ancho no
  acredita su GPU. El modelo base sigue siendo pesado.
- Revisar el recorrido completo y pequeños detalles, especialmente celosías,
  barandas, materiales con transparencia y vegetación.
- La iluminación web no reproduce el motor ni la posproducción de D5.
- Para más ambientación, ampliar primero el presupuesto de polígonos/texturas;
  evitar duplicar modelos densos. Conservar los originales separados.
