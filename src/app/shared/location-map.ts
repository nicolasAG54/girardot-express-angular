import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import type { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { SITE_CONTENT } from '../core/site-content';
import { NEARBY_PLACES, NearbyPlace, NARINO_ROAD } from '../core/nearby-places';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.html',
  styleUrl: './location-map.scss',
})
export class LocationMap {
  protected readonly content = SITE_CONTENT;
  protected readonly status = signal<'idle' | 'loading' | 'loaded' | 'slow' | 'error'>('idle');
  protected readonly hasMap = signal(false);
  protected readonly zooming = signal(false);
  private readonly canvas = viewChild.required<ElementRef<HTMLDivElement>>('mapCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private map?: LeafletMap;
  private bounds?: LatLngBounds;
  private intersectionObserver?: IntersectionObserver;
  private resizeObserver?: ResizeObserver;
  private loadTimer?: ReturnType<typeof setTimeout>;
  private requestId = 0;

  constructor() {
    // Browser globals and Leaflet's window dependency stay outside SSR/hydration.
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        void this.reloadMap();
        return;
      }
      this.intersectionObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        this.intersectionObserver?.disconnect();
        void this.reloadMap();
      });
      this.intersectionObserver.observe(this.canvas().nativeElement);
    });
    this.destroyRef.onDestroy(() => {
      ++this.requestId;
      this.intersectionObserver?.disconnect();
      this.removeMap();
    });
  }

  protected resetView(): void {
    if (!this.map || !this.bounds) return;
    this.map.closePopup();
    const compact = this.canvas().nativeElement.clientWidth < 600;
    this.map.fitBounds(this.bounds, {
      paddingTopLeft: compact ? [65, 80] : [150, 90],
      paddingBottomRight: compact ? [65, 60] : [150, 70],
      maxZoom: compact ? 14 : 15,
      animate: false,
    });
  }

  protected async reloadMap(): Promise<void> {
    const requestId = ++this.requestId;
    this.removeMap();
    this.status.set('loading');
    this.loadTimer = setTimeout(() => {
      if (requestId === this.requestId) this.status.set('slow');
    }, 12000);

    try {
      const leaflet = await import('leaflet');
      if (this.destroyRef.destroyed || requestId !== this.requestId) return;
      const element = this.canvas().nativeElement;
      const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const map = leaflet.map(element, {
        scrollWheelZoom: false,
        // A single finger remains available to scroll the page on touch devices.
        dragging: !window.matchMedia('(pointer: coarse)').matches,
        touchZoom: true,
        keyboard: true,
        zoomControl: false,
        minZoom: 11,
        maxZoom: 18,
        zoomSnap: .25,
        zoomAnimation: animate,
        fadeAnimation: animate,
        markerZoomAnimation: animate,
        attributionControl: true,
      });
      this.map = map;
      map.on('zoomstart', () => this.zooming.set(true));
      map.on('zoomend', () => this.zooming.set(false));
      map.attributionControl.setPrefix(false);
      leaflet.control.zoom({
        position: 'bottomright',
        zoomInTitle: 'Acercar mapa',
        zoomOutTitle: 'Alejar mapa',
      }).addTo(map);

      this.bounds = leaflet.latLngBounds(NEARBY_PLACES.map(place => [place.latitude, place.longitude]));
      leaflet.polyline(NARINO_ROAD.coordinates.map(point => [point[0], point[1]]), {
        color: '#c17a08', weight: 4, opacity: .85, interactive: false,
      }).addTo(map);
      leaflet.marker(NARINO_ROAD.labelCoordinates, {
        icon: leaflet.divIcon({ className: 'location-road', html: '<span>Vía Nariño</span>', iconSize: [88, 22], iconAnchor: [44, 11] }),
        interactive: false, keyboard: false,
      }).addTo(map);
      for (const place of NEARBY_PLACES) {
        const marker = leaflet.marker([place.latitude, place.longitude], {
          icon: leaflet.divIcon({
            className: `location-marker location-marker--${place.id}`,
            html: this.markerLabel(place),
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
          title: place.name,
          alt: place.name,
          keyboard: true,
          zIndexOffset: place.id === 'mall' ? 1000 : 0,
          riseOnHover: true,
        }).addTo(map);
        marker.bindPopup(this.popupContent(place), {
          className: 'location-popup', maxWidth: 260, minWidth: 200, autoPanPadding: [30, 60],
        });
        marker.getElement()?.setAttribute('aria-label', `${place.name}. Ver información`);
      }
      this.hasMap.set(true);
      this.resetView();

      let successfulTiles = 0;
      const tiles = leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        maxZoom: 19,
      });
      tiles.on('tileload', () => { successfulTiles += 1; });
      tiles.on('load', () => {
        if (this.destroyRef.destroyed || requestId !== this.requestId) return;
        clearTimeout(this.loadTimer);
        this.status.set(successfulTiles > 0 ? 'loaded' : 'error');
      });
      tiles.addTo(map);

      this.resizeObserver = new ResizeObserver(() => {
        map.invalidateSize({ pan: false });
        this.resetView();
      });
      this.resizeObserver.observe(element);
    } catch {
      if (this.destroyRef.destroyed || requestId !== this.requestId) return;
      clearTimeout(this.loadTimer);
      this.status.set('error');
    }
  }

  private markerLabel(place: NearbyPlace): HTMLElement {
    const content = document.createElement('span');
    content.className = 'location-marker__content';
    const dot = document.createElement('span');
    dot.className = 'location-marker__dot';
    const label = document.createElement('span');
    label.className = `location-marker__label location-marker__label--${place.labelPosition}`;
    label.textContent = place.label;
    content.append(dot, label);
    return content;
  }

  private popupContent(place: NearbyPlace): HTMLElement {
    const content = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = place.name;
    const description = document.createElement('p');
    description.textContent = place.description;
    const link = document.createElement('a');
    link.href = `${SITE_CONTENT.mapSearchBase}${encodeURIComponent(place.query)}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'Ver en Google Maps';
    content.append(name, description, link);
    return content;
  }

  private removeMap(): void {
    clearTimeout(this.loadTimer);
    this.resizeObserver?.disconnect();
    this.map?.remove();
    this.map = undefined;
    this.bounds = undefined;
    this.hasMap.set(false);
    this.zooming.set(false);
  }
}
