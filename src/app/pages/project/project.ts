import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { COMMERCIAL_FACTS, SITE_CONTENT } from '../../core/site-content';
import { LocationMap } from '../../shared/location-map';
import { ContactForm } from '../../shared/contact-form';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { HeroVideoDirective } from '../../shared/hero-video.directive';
import { VideoRevealDirective } from '../../shared/video-reveal.directive';

@Component({
  selector: 'app-project',
  imports: [RouterLink, ContactForm, LocationMap, RevealOnScrollDirective, VideoRevealDirective, HeroVideoDirective],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {

  protected readonly facts = COMMERCIAL_FACTS;
  protected readonly site = SITE_CONTENT;
  protected readonly selectedMetric = signal(0);
  protected readonly selectedGalleryIndex = signal(0);

  protected readonly metricDetails = [
    {
      title: 'Área para una mezcla comercial diversa',
      description:
        'El área arrendable total proyectada reúne espacios para comercio, servicios, bienestar y gastronomía. Consulta las áreas y formatos que se ajustan a tu negocio.',
    },
    {
      title: 'Formatos para diferentes negocios',
      description:
        'El proyecto contempla 56 locales. El equipo comercial te orienta sobre los formatos, la ubicación y la disponibilidad vigente según la actividad de tu marca.',
    },
    {
      title: 'Un proyecto conectado en tres niveles',
      description:
        'Tres niveles comerciales articulan los distintos usos del proyecto. Solicita los planos y la distribución vigente para evaluar tu espacio con un asesor.',
    },
    {
      title: 'Una llegada pensada para todos',
      description:
        'La capacidad proyectada contempla 131 espacios para automóviles, 114 para motos y 30 para bicicletas. Una combinación que acompaña distintas formas de llegar.',
    },
  ] as const;
  protected readonly activeMetric = computed(
    () => this.metricDetails[this.selectedMetric()] ?? this.metricDetails[0],
  );

  protected readonly galleryImages = [
    {
      title: 'Plazoleta y recorrido comercial',
      src: 'assets/render-1.webp',
      alt: 'Render de la plazoleta abierta y los recorridos comerciales proyectados de Girardot Express',
      width: 1765,
      height: 904,
    },
    {
      title: 'Fachada y accesos',
      src: 'assets/render-3.webp',
      alt: 'Render de la fachada y los accesos proyectados de Girardot Express',
      width: 1765,
      height: 898,
    },
  ] as const;
  protected readonly activeGalleryImage = computed(
    () => this.galleryImages[this.selectedGalleryIndex()] ?? this.galleryImages[0],
  );

  protected readonly architectureFeatures = [
    {
      title: 'Iluminación natural',
      description: 'Aperturas y recorridos concebidos para aprovechar la luz durante el día.',
    },
    {
      title: 'Ventilación cruzada',
      description: 'Una configuración abierta que favorece el movimiento natural del aire.',
    },
    {
      title: 'Áreas abiertas',
      description: 'Espacios de encuentro que conectan el comercio con el entorno.',
    },
    {
      title: 'Materiales ecoeficientes',
      description: 'Decisiones de diseño orientadas a un proyecto más consciente y confortable.',
    },
  ] as const;

  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.titleService.setTitle('Espacios comerciales | Girardot Express');
    this.meta.updateTag({
      name: 'description',
      content:
        `Conoce los espacios comerciales, las etapas y la arquitectura de Girardot Express. ${SITE_CONTENT.openingLabel}.`,
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Espacios comerciales | Girardot Express',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Una oportunidad para tu marca en Girardot. Conoce las cifras, las etapas y los espacios proyectados.',
    });
    this.meta.updateTag({ property: 'og:url', content: '/proyecto' });
    this.setCanonical('/proyecto');

  }

  private setCanonical(href: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = href;
  }
}
