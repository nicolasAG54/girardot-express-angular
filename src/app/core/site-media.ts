// Architecture stills use the client's original straight-roof renders.
// These are project visualizations, not photographs of completed work.
const directory = 'assets/media-2026-10';
const architecture = 'assets/techo-recto';

export const SITE_MEDIA = {
  homeHero: {
    video: `${directory}/hero-home-14s.mp4`,
    mobileVideo: `${directory}/hero-home-mobile-14s.mp4`,
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
    src: `${architecture}/fachada.webp`,
    title: 'Fachada y accesos',
    alt: 'Visualización de la fachada, los locales y el acceso peatonal de Girardot Express',
    width: 1920,
    height: 1080,
  },
  promenade: {
    src: `${architecture}/recorrido.webp`,
    title: 'Recorridos abiertos',
    alt: 'Render del pasillo comercial con cubierta recta, locales y jardineras de Girardot Express',
    width: 1920,
    height: 1080,
  },
  entrance: {
    src: `${architecture}/acceso.webp`,
    title: 'Acceso principal',
    alt: 'Render del acceso peatonal y la fachada turquesa de Girardot Express con cubierta recta',
    width: 1920,
    height: 1080,
  },
  courtyard: {
    src: `${architecture}/plazoleta.webp`,
    title: 'Plazoleta y zonas de encuentro',
    alt: 'Render de la plazoleta comercial con mesas, jardineras y cubierta recta de Girardot Express',
    width: 1920,
    height: 1080,
  },
  aerial: {
    src: `${architecture}/vista-general.webp`,
    title: 'Vista general del proyecto',
    alt: 'Vista general elevada de la fachada, la cubierta recta y los parqueaderos de Girardot Express',
    width: 1920,
    height: 1080,
  },
} as const;
