const coordinates = { latitude: 4.299272, longitude: -74.819122 } as const;
const mapCoordinates = `${coordinates.latitude},${coordinates.longitude}`;
const openingPeriod = 'Finales de 2026';
const mapSearchBase = 'https://www.google.com/maps/search/?api=1&query=';

export const SITE_CONTENT = {
  name: 'Girardot Express',
  slogan: 'Todo lo que necesitas, más cerca.',
  horizontalLogoUrl: '/assets/brand/girardot-express-horizontal.png',
  coordinates,
  logoUrl: '/assets/brand/girardot-express-logo.png',
  openingPeriod,
  openingCaption: 'Apertura prevista · Primera etapa',
  openingLabel: `Primera etapa: apertura prevista para ${openingPeriod.toLowerCase()}`,
  address: 'Diagonal 9 # 23–31, Girardot, Cundinamarca',
  email: 'comercial@girardotexpress.com',
  whatsappLabel: '+57 313 887 0580',
  whatsappUrl: 'https://wa.me/573138870580',
  mapSearchBase,
  mapsUrl: `${mapSearchBase}${mapCoordinates}`,
  wazeUrl: `https://www.waze.com/ul?ll=${encodeURIComponent(mapCoordinates)}&navigate=yes`,
  mapEmbedUrl:
    `https://www.openstreetmap.org/export/embed.html?bbox=-74.826022%2C4.294072%2C-74.812222%2C4.304472&layer=mapnik&marker=${encodeURIComponent(mapCoordinates)}`,
  socialHandle: '@girardotexpresscc',
  social: {
    instagram: 'https://www.instagram.com/girardotexpresscc/',
    facebook: null as string | null,
  },
} as const;

export const COMMERCIAL_FACTS = [
  { value: '6.629 m²', label: 'Área arrendable proyectada' },
  { value: '56', label: 'Locales proyectados' },
  { value: '3', label: 'Niveles comerciales' },
  { value: '275', label: 'Parqueaderos proyectados' },
] as const;

export const LEVELS = [
  { name: 'Nivel 1', use: 'Comercio y anclas', area: '2.845 m²' },
  { name: 'Nivel 2', use: 'Marcas y servicios', area: '2.545 m²' },
  { name: 'Nivel 3', use: 'Gastronomía y terrazas', area: '1.239 m²' },
] as const;
