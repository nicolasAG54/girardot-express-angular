// Client media trial, October 2026. Previous assets remain available for comparison.
// The stills are extracted from the supplied architectural video, not photographs of completed work.
const directory = 'assets/media-2026-10';

export const SITE_MEDIA = {
  homeHero: {
    video: `${directory}/hero-home.mp4`,
    mobileVideo: `${directory}/hero-home-mobile.mp4`,
    poster: `${directory}/hero-home-poster.webp`,
    width: 1920,
    height: 1080,
  },
  projectHero: {
    video: `${directory}/hero-project.mp4`,
    mobileVideo: `${directory}/hero-project-mobile.mp4`,
    poster: `${directory}/hero-project-poster.webp`,
    width: 1920,
    height: 1080,
  },
  facade: {
    src: `${directory}/fachada.webp`,
    title: 'Fachada y accesos',
    alt: 'Visualización de la fachada, los locales y el acceso peatonal de Girardot Express',
    width: 1920,
    height: 1080,
  },
  promenade: {
    src: `${directory}/recorrido.webp`,
    title: 'Recorridos abiertos',
    alt: 'Visualización del recorrido comercial cubierto con cubierta ondulada y jardines de Girardot Express',
    width: 1920,
    height: 1080,
  },
  entrance: {
    src: `${directory}/acceso.webp`,
    title: 'Acceso principal',
    alt: 'Visualización del acceso principal y la fachada con el logo de Girardot Express',
    width: 1920,
    height: 1080,
  },
  courtyard: {
    src: `${directory}/plazoleta.webp`,
    title: 'Plazoleta y zonas de encuentro',
    alt: 'Visualización de la plazoleta con fuente, vegetación y recorridos comerciales de Girardot Express',
    width: 1920,
    height: 1080,
  },
  aerial: {
    src: `${directory}/vista-aerea.webp`,
    title: 'Vista general del proyecto',
    alt: 'Visualización aérea de las cubiertas, la fachada y los parqueaderos de Girardot Express',
    width: 1920,
    height: 1080,
  },
} as const;
