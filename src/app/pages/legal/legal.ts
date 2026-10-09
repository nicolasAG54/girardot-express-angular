import { Component, DestroyRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LEGAL_CONTENT } from '../../core/legal-content';
import { SITE_CONTENT } from '../../core/site-content';

type LegalDocument = 'privacy' | 'cookies' | 'terms';
const DOCUMENTS = {
  privacy: {
    title: 'Privacidad y datos personales',
    description: 'Conoce qué ocurre con tus datos al usar el formulario, el asistente y los servicios externos de Girardot Express.',
    path: '/privacidad',
  },
  cookies: {
    title: 'Cookies y servicios externos',
    description: 'Información sobre el almacenamiento en el navegador, el mapa y los enlaces a servicios externos.',
    path: '/cookies',
  },
  terms: {
    title: 'Términos de uso',
    description: 'Alcance de la información y las visualizaciones del proyecto Girardot Express.',
    path: '/terminos',
  },
} as const;

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  templateUrl: './legal.html',
  styleUrl: './legal.scss',
})
export class Legal {
  protected readonly kind = inject(ActivatedRoute).snapshot.data['document'] as LegalDocument;
  protected readonly document = DOCUMENTS[this.kind];
  protected readonly site = SITE_CONTENT;
  protected readonly legal = LEGAL_CONTENT;
  protected readonly privacyRequestUrl = `${SITE_CONTENT.whatsappUrl}?text=${encodeURIComponent(
    'Hola. Quisiera orientación para presentar una solicitud de consulta, actualización, rectificación, revocación o supresión de mis datos personales. Por favor, indíquenme el canal y el procedimiento del responsable del tratamiento.',
  )}`;

  constructor() {
    const meta = inject(Meta);
    inject(Title).setTitle(`${this.document.title} | ${SITE_CONTENT.name}`);
    meta.updateTag({ name: 'description', content: this.document.description });
    meta.updateTag({ property: 'og:title', content: `${this.document.title} | ${SITE_CONTENT.name}` });
    meta.updateTag({ property: 'og:description', content: this.document.description });
    meta.updateTag({ property: 'og:url', content: this.document.path });
    const canonical = inject(DOCUMENT).head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = this.document.path;
    if (this.kind === 'privacy' && this.legal.privacyDraft) {
      meta.updateTag({ name: 'robots', content: 'noindex, follow' });
      inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
    }
  }
}
