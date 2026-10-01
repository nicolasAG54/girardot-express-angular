import { SITE_CONTENT } from './site-content';

export interface NearbyPlace {
  id: string;
  label: string;
  name: string;
  description: string;
  query: string;
  latitude: number;
  longitude: number;
  labelPosition: 'above' | 'below' | 'left' | 'right';
  source: string;
}

// Coordinates are OSM object centers, verified 2026-09-23 using the primary API:
// https://nominatim.openstreetmap.org/lookup?osm_ids=W258584855,W305379991,W130096473,W228906088&format=jsonv2
// The project's coordinates come from the existing approved SITE_CONTENT.
export const NEARBY_PLACES: readonly NearbyPlace[] = [
  { id: 'mall', label: 'Girardot Express', name: SITE_CONTENT.name, description: SITE_CONTENT.address, query: `${SITE_CONTENT.coordinates.latitude},${SITE_CONTENT.coordinates.longitude}`, latitude: SITE_CONTENT.coordinates.latitude, longitude: SITE_CONTENT.coordinates.longitude, labelPosition: 'below', source: 'SITE_CONTENT.coordinates' },
  { id: 'stadium', label: 'Estadio', name: 'Estadio Luis Antonio Duque Peña', description: 'Calle 22 con carrera 19 · Girardot.', query: 'Estadio Luis Antonio Duque Peña, Girardot, Colombia', latitude: 4.3049559, longitude: -74.8117856, labelPosition: 'left', source: 'https://www.openstreetmap.org/way/258584855' },
  { id: 'ucundinamarca', label: 'U. de Cundinamarca', name: 'Universidad de Cundinamarca', description: 'Seccional Girardot · Barrio Gaitán.', query: 'Universidad de Cundinamarca, Girardot, Colombia', latitude: 4.3066068, longitude: -74.8069768, labelPosition: 'above', source: 'https://www.openstreetmap.org/way/305379991' },
  { id: 'unipiloto', label: 'U. Piloto', name: 'Universidad Piloto de Colombia', description: 'Seccional Alto Magdalena · Carrera 19 # 17–33.', query: 'Universidad Piloto de Colombia, Carrera 19 17-33, Girardot, Colombia', latitude: 4.3008830, longitude: -74.8113288, labelPosition: 'below', source: 'https://www.openstreetmap.org/way/130096473' },
  { id: 'terminal', label: 'Terminal de transportes', name: 'Terminal de Transportes de Girardot', description: 'Transporte intermunicipal · Girardot.', query: 'Terminal de Transportes, Girardot, Colombia', latitude: 4.3027277, longitude: -74.8052843, labelPosition: 'above', source: 'https://www.openstreetmap.org/way/228906088' },
];

// Actual road geometry, rather than an arbitrary destination pin.
// https://www.openstreetmap.org/api/0.6/way/289682868/full.json
export const NARINO_ROAD = {
  labelCoordinates: [4.3014785, -74.817175] as [number, number],
  coordinates: [
    [4.2947769, -74.8242692], [4.2948472, -74.8241831], [4.2956142, -74.8232765],
    [4.296349, -74.8225231], [4.2966043, -74.8222619], [4.2973737, -74.8214453],
    [4.2976239, -74.8211799], [4.2979744, -74.820807], [4.2983337, -74.8204335],
    [4.298633, -74.8201223], [4.2987909, -74.819964], [4.3000086, -74.8187163],
    [4.3002607, -74.8184505], [4.3014785, -74.817175], [4.3016562, -74.8169878],
    [4.3017167, -74.8169245], [4.3032636, -74.8153084], [4.3033883, -74.8151781],
    [4.3046662, -74.8138363], [4.3049324, -74.813575], [4.3052814, -74.8132201],
    [4.3053756, -74.8131217], [4.3054259, -74.813072], [4.3059266, -74.8125564],
    [4.3061435, -74.812359], [4.3063265, -74.8121905], [4.3064486, -74.8120789],
    [4.3068164, -74.8117562], [4.3069896, -74.8116537], [4.3071743, -74.811576],
    [4.3076266, -74.8113889], [4.3079306, -74.8112635], [4.3079338, -74.8112622],
    [4.309183, -74.8107472], [4.3094023, -74.8106587], [4.309651, -74.8105434],
    [4.3098971, -74.810428], [4.3100804, -74.8103456], [4.3101636, -74.8103082],
    [4.3102196, -74.8102837], [4.3104561, -74.8101813], [4.3107316, -74.810082],
  ] as readonly (readonly [number, number])[],
} as const;
