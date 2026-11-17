import { TestBed } from '@angular/core/testing';
import { LocationMap } from './location-map';
import { NEARBY_PLACES } from '../core/nearby-places';

const fake = vi.hoisted(() => {
  const map = {
    on: vi.fn(), closePopup: vi.fn(), fitBounds: vi.fn(), invalidateSize: vi.fn(), remove: vi.fn(),
    attributionControl: { setPrefix: vi.fn() },
  };
  const tiles = { on: vi.fn().mockReturnThis(), addTo: vi.fn().mockReturnThis() };
  const layer = { addTo: vi.fn().mockReturnThis(), bindPopup: vi.fn(), getElement: vi.fn() };
  return {
    map, tiles,
    leaflet: {
      map: vi.fn(() => map), control: { zoom: vi.fn(() => layer) },
      latLngBounds: vi.fn(), polyline: vi.fn(() => layer), marker: vi.fn(() => layer),
      divIcon: vi.fn(), tileLayer: vi.fn(() => tiles),
    },
  };
});

// Reproduce the production bundle: there are no named `map` or `tileLayer` exports.
vi.mock('leaflet', () => ({ default: fake.leaflet }));

describe('LocationMap production module loading', () => {
  let intersect: IntersectionObserverCallback;
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })));
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { intersect = callback; }
      observe() {} disconnect() {}
    });
    vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
    TestBed.configureTestingModule({});
  });
  afterEach(() => vi.unstubAllGlobals());

  async function setup() {
    const fixture = TestBed.createComponent(LocationMap);
    fixture.detectChanges(); await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const show = async () => {
      intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      await vi.waitFor(() => expect(fake.tiles.addTo).toHaveBeenCalled());
      fixture.detectChanges();
    };
    const loaded = () => {
      for (const event of ['tileload', 'load']) {
        fake.tiles.on.mock.calls.find(call => call[0] === event)![1]();
      }
      fixture.detectChanges();
    };
    return { fixture, root, show, loaded };
  }

  it('lazily initializes a default-only module, adds landmarks and completes loading', async () => {
    const { fixture, root, show, loaded } = await setup();
    expect(fake.leaflet.map).not.toHaveBeenCalled();
    await show(); loaded();
    expect(fake.leaflet.marker).toHaveBeenCalledTimes(NEARBY_PLACES.length + 1);
    expect(fake.leaflet.tileLayer).toHaveBeenCalledWith('https://tile.openstreetmap.org/{z}/{x}/{y}.png', expect.any(Object));
    expect(root.querySelector('.location-map__reset')).not.toBeNull();
    expect(root.querySelector('.location-map__notice')).toBeNull();
    expect(root.querySelector('.location-map__frame')?.getAttribute('aria-busy')).toBe('false');
    fixture.destroy(); expect(fake.map.remove).toHaveBeenCalledOnce();
  });

  it('allows retry after initialization fails', async () => {
    fake.leaflet.map.mockImplementationOnce(() => { throw new Error('Initialization failed'); });
    const { fixture, root, loaded } = await setup();
    intersect([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    await vi.waitFor(() => {
      fixture.detectChanges(); expect(root.querySelector('.location-map__notice')).not.toBeNull();
    });
    root.querySelector<HTMLButtonElement>('.location-map__notice button')!.click();
    await vi.waitFor(() => expect(fake.tiles.addTo).toHaveBeenCalled());
    loaded(); expect(root.querySelector('.location-map__notice')).toBeNull();
    fixture.destroy();
  });
});
