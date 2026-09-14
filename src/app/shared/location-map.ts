import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SITE_CONTENT } from '../core/site-content';
import { NEARBY_PLACES } from '../core/nearby-places';

@Component({
  selector: 'app-location-map',
  template: `
    <div class="location-map">
      <div class="location-map__choices" aria-label="Puntos de referencia de Girardot">
        @for (place of places; track place.id) {
          <button type="button" [attr.aria-pressed]="selected().id === place.id" (click)="selected.set(place)">{{ place.label }}</button>
        }
      </div>
      <iframe [src]="mapUrl()" [title]="'Mapa: ' + selected().name" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <div class="location-map__caption"><p aria-live="polite"><strong>{{ selected().name }}</strong><span>{{ selected().description }}</span></p><a [href]="externalUrl()" target="_blank" rel="noopener">Abrir mapa</a></div>
    </div>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .location-map { overflow: hidden; border-radius: 12px; background: white; color: var(--ink); }
    .location-map__choices { display: flex; flex-wrap: wrap; gap: .4rem; padding: 1rem; }
    button { min-height: 44px; padding: .55rem .8rem; border: 1px solid var(--line); border-radius: 6px; background: white; color: var(--ink); font: inherit; font-size: .75rem; cursor: pointer; }
    button[aria-pressed=true] { color: white; background: #1a5b9e; border-color: #1a5b9e; }
    iframe { display: block; width: 100%; height: 340px; border: 0; background: #f2f1ee; }
    .location-map__caption { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; }
    p { display: grid; gap: .25rem; margin: 0; font-size: .75rem; line-height: 1.5; }
    span { color: var(--ink-soft); }
    a { flex-shrink: 0; display: inline-flex; align-items: center; min-height: 44px; font-size: .75rem; color: var(--ink); text-underline-offset: 3px; }
    @media(max-width: 600px) { iframe { height: 300px; } .location-map__caption { align-items: start; flex-direction: column; gap: .25rem; } }
  `,
})
export class LocationMap {
  protected readonly places = NEARBY_PLACES;
  protected readonly selected = signal(this.places[0]);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly externalUrl = computed(() => `${SITE_CONTENT.mapSearchBase}${encodeURIComponent(this.selected().query)}`);
  protected readonly mapUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://maps.google.com/maps?q=${encodeURIComponent(this.selected().query)}&z=15&output=embed&hl=es`,
  ));
}
