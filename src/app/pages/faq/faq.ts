import { Component, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FaqAudience, searchFaq } from '../../core/chatbot-content';
import { SITE_CONTENT } from '../../core/site-content';

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly site = SITE_CONTENT;
  protected readonly query = signal('');
  protected readonly audience = signal<FaqAudience | 'all'>('all');
  protected readonly filters = [{ id: 'all', label: 'Todas' }, { id: 'visitor', label: 'Para visitantes' }, { id: 'commercial', label: 'Para marcas' }] as const;
  protected readonly results = computed(() => searchFaq(this.query(), this.audience()));

  constructor() {
    inject(Title).setTitle(`Preguntas frecuentes | ${SITE_CONTENT.name}`);
    const description = 'Resuelve tus dudas sobre la apertura, ubicación, servicios y espacios comerciales de Girardot Express.';
    const meta = inject(Meta);
    meta.updateTag({ name: 'description', content: description });
    meta.updateTag({ property: 'og:title', content: `Preguntas frecuentes | ${SITE_CONTENT.name}` });
    meta.updateTag({ property: 'og:description', content: description });
    meta.updateTag({ property: 'og:url', content: '/preguntas-frecuentes' });
    const document = inject(DOCUMENT);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = '/preguntas-frecuentes';
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
