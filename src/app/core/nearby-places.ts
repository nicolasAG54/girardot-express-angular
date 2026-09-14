import { SITE_CONTENT } from './site-content';

// Verified place names; the map provider locates them. No estimated coordinates,
// walking times or proximity claims. Sources are recorded in CAMBIOS_V3.md.
export const NEARBY_PLACES: readonly {
  id: string; label: string; name: string; description: string; query: string;
}[] = [
  { id: 'mall', label: 'Girardot Express', name: SITE_CONTENT.name, description: SITE_CONTENT.address, query: `${SITE_CONTENT.coordinates.latitude},${SITE_CONTENT.coordinates.longitude}` },
  { id: 'via', label: 'Vía Nariño', name: 'Vía Nariño', description: 'Eje vial del sector de La Colina.', query: 'Avenida Nariño, Girardot, Cundinamarca, Colombia' },
  { id: 'stadium', label: 'Estadio', name: 'Estadio Luis Antonio Duque Peña', description: 'Escenario deportivo de Girardot.', query: 'Estadio Luis Antonio Duque Peña, Girardot, Colombia' },
  { id: 'ucundinamarca', label: 'U. de Cundinamarca', name: 'Universidad de Cundinamarca', description: 'Seccional Girardot · Barrio Gaitán.', query: 'Universidad de Cundinamarca, Girardot, Colombia' },
  { id: 'unipiloto', label: 'U. Piloto', name: 'Universidad Piloto de Colombia', description: 'Seccional Alto Magdalena · Carrera 19 # 17–33.', query: 'Universidad Piloto de Colombia, Carrera 19 17-33, Girardot, Colombia' },
  { id: 'terminal', label: 'Terminal', name: 'Terminal de Transportes de Girardot', description: 'Punto de referencia para el transporte intermunicipal.', query: 'Terminal de Transportes, Girardot, Colombia' },
];
