export interface MallWalkPoint {
  readonly title: string;
  readonly position: readonly [number, number, number];
  readonly lookAt: readonly [number, number, number];
}

export type MallFloor = 'ground' | 'upper';

// Metres in the unmodified SKP coordinate system (exported Z-up -> Y-up).
// The ground-floor passage runs along Z=-59, between shop fronts and planting.
export const MALL_WALK: readonly MallWalkPoint[] = [
  { title: 'Acceso al pasillo', position: [88, 1.65, -59], lookAt: [100, 1.65, -59] },
  { title: 'Pasillo comercial', position: [96, 1.65, -59], lookAt: [108, 1.65, -59] },
  { title: 'Llegada a la plazoleta', position: [104, 1.65, -59], lookAt: [112, 1.65, -62] },
  { title: 'Plazoleta', position: [112, 1.65, -60], lookAt: [113, 1.65, -67] },
  { title: 'Locales y zonas de encuentro', position: [121, 1.65, -59], lookAt: [128, 1.65, -62] },
  { title: 'Última vista del pasillo', position: [129, 1.65, -59], lookAt: [120, 1.65, -60] },
];

// The upper slab is at Y=4.75 m. This U-shaped route follows the gallery
// around the atrium; the area X=100..131, Z=-71..-62 is an open void.
export const SECOND_FLOOR_WALK: readonly MallWalkPoint[] = [
  { title: 'Llegada al segundo piso', position: [123, 6.4, -73.8], lookAt: [115, 6.4, -73.8] },
  { title: 'Galería superior', position: [115, 6.4, -73.8], lookAt: [104, 6.4, -73.8] },
  { title: 'Vista a la plazoleta', position: [106, 6.4, -73.8], lookAt: [110, 3.6, -65] },
  { title: 'Llegada a la zona de mesas', position: [98, 6.4, -73.8], lookAt: [98, 6.4, -66] },
  { title: 'Balcón de la plazoleta', position: [98, 6.4, -63.5], lookAt: [110, 3.6, -65] },
  { title: 'Zona de mesas y fachada', position: [89, 6.4, -62], lookAt: [89, 5.9, -54] },
];

export const MALL_ROUTES: Readonly<Record<MallFloor, readonly MallWalkPoint[]>> = {
  ground: MALL_WALK,
  upper: SECOND_FLOOR_WALK,
};

export function walkIndex(index: number, direction: number, count = MALL_WALK.length): number {
  return Math.max(0, Math.min(count - 1, index + Math.sign(direction)));
}
