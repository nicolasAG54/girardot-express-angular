import { afterNextRender, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SITE_CONTENT } from '../core/site-content';
import { NEARBY_PLACES } from '../core/nearby-places';

@Component({
  selector: 'app-location-map',
  template: `
    <div class="location-map">
      <div class="location-map__frame" [attr.aria-busy]="status() === 'loading'">
        @for (request of requests(); track request.id) {
          <iframe [src]="request.url" [title]="'Mapa: ' + selected().name" loading="eager"
            [class.is-loaded]="status() === 'loaded'" (load)="onMapLoad($event, request.id)"
            referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        }
        @if (status() !== 'loaded') {
          <div class="location-map__status" role="status">
            <span>{{ status() === 'slow' ? 'El mapa está tardando en cargar.' : 'Cargando mapa…' }}</span>
            @if (status() === 'slow') {
              <button type="button" (click)="reloadMap()">Volver a cargar</button>
              <a [href]="externalUrl()" target="_blank" rel="noopener">Ver en Google Maps</a>
            }
          </div>
        }
      </div>
      <div class="location-map__tools">
        <div class="location-map__heading">
          <h3>Explorar el entorno</h3>
          <div class="location-map__actions">
            <button class="location-map__reload" type="button" (click)="reloadMap()">Recargar mapa</button>
            <a [href]="externalUrl()" target="_blank" rel="noopener">Abrir mapa</a>
          </div>
        </div>
          <div class="location-map__choices" aria-label="Puntos de referencia de Girardot">
            @for (place of places; track place.id) {
              <button type="button" [attr.aria-pressed]="selected().id === place.id" (click)="selectPlace(place)">{{ place.label }}</button>
            }
          </div>
          <p aria-live="polite"><strong>{{ selected().name }}</strong><span>{{ selected().description }}</span></p>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; min-width: 0; color: inherit; }
    .location-map__tools { padding-top: .65rem; }
    .location-map__heading { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
    h3 { margin: 0; font-size: .82rem; font-weight: 500; }
    .location-map__choices { display: flex; flex-wrap: wrap; gap: .5rem; padding-block: .5rem 1rem; }
    button { min-height: 44px; padding: .55rem .8rem; border: 1px solid rgb(255 255 255 / .45); border-radius: 6px; background: transparent; color: inherit; font: inherit; font-size: .75rem; cursor: pointer; }
    button[aria-pressed=true] { color: var(--ink); background: var(--yellow); border-color: var(--yellow); }
    .location-map__frame { position: relative; height: var(--location-map-height, 380px); overflow: hidden; border-radius: 16px; background: #e4e3df; }
    iframe { display: block; width: 100%; height: 100%; border: 0; opacity: 0; filter: var(--location-map-filter, none); }
    iframe.is-loaded { opacity: 1; }
    .location-map__status { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .65rem; padding: 1.5rem; color: #30342e; text-align: center; font-size: .85rem; }
    .location-map__status button { border-color: currentColor; }
    .location-map__actions { display: flex; align-items: center; gap: 1rem; }
    .location-map__reload { border: 0; border-radius: 0; padding-inline: 0; font-size: .75rem; text-decoration: underline; text-underline-offset: 3px; }
    p { display: grid; gap: .25rem; margin: 0 0 .5rem; font-size: .75rem; line-height: 1.5; }
    span { opacity: .8; }
    a { flex-shrink: 0; display: inline-flex; align-items: center; min-height: 44px; font-size: .75rem; color: inherit; text-underline-offset: 3px; }
    @media(max-width: 700px) { .location-map__frame { height: var(--location-map-mobile-height, 320px); } }
    @media(max-width: 400px) { .location-map__heading { flex-wrap: wrap; gap: 0; } .location-map__actions { width: 100%; justify-content: space-between; } }
  `,
})
export class LocationMap {
  protected readonly places = NEARBY_PLACES;
  protected readonly selected = signal(this.places[0]);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private requestId = 0;
  private loadTimer?: ReturnType<typeof setTimeout>;
  protected readonly requests = signal<readonly { id: number; url: SafeResourceUrl }[]>([]);
  protected readonly status = signal<'loading' | 'loaded' | 'slow'>('loading');
  protected readonly externalUrl = computed(() => `${SITE_CONTENT.mapSearchBase}${encodeURIComponent(this.selected().query)}`);

  constructor() {
    // Create the external frame after client rendering, not during SSR/hydration.
    afterNextRender(() => this.reloadMap());
    this.destroyRef.onDestroy(() => clearTimeout(this.loadTimer));
  }

  protected selectPlace(place: typeof NEARBY_PLACES[number]): void {
    this.selected.set(place);
    this.reloadMap();
  }

  protected reloadMap(): void {
    clearTimeout(this.loadTimer);
    this.status.set('loading');
    this.requests.set([{
      id: ++this.requestId,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://maps.google.com/maps?q=${encodeURIComponent(this.selected().query)}&z=15&output=embed&hl=es`,
      ),
    }]);
    this.loadTimer = setTimeout(() => this.status.set('slow'), 12000);
  }

  protected onMapLoad(event: Event, id: number): void {
    if (id !== this.requestId) return;
    // An iframe can fire load for its initial empty document before Google loads.
    const frame = event.target as HTMLIFrameElement;
    try {
      if (frame.contentDocument?.URL === 'about:blank') return;
    } catch {
      // A loaded Google document is cross-origin and cannot be inspected.
    }
    clearTimeout(this.loadTimer);
    this.status.set('loaded');
  }
}
