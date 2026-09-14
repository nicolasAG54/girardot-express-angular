import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { SITE_CONTENT } from '../../core/site-content';
import { LocationMap } from '../../shared/location-map';
import { ContactForm } from '../../shared/contact-form';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { HeroVideoDirective } from '../../shared/hero-video.directive';
import { VideoRevealDirective } from '../../shared/video-reveal.directive';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ContactForm, LocationMap, RevealOnScrollDirective, VideoRevealDirective, HeroVideoDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  @ViewChild('galleryDialog') private galleryDialog?: ElementRef<HTMLDialogElement>;

  protected readonly site = SITE_CONTENT;
  protected readonly galleryIndex = signal(0);
  protected readonly brandCategories = [
    { name: 'Compras', title: 'Lo que necesitas para tu día a día.', description: 'Comercios y formatos pensados para hacer tus compras cerca de casa.' },
    { name: 'Gastronomía', title: 'Una pausa que sabe bien.', description: 'Islas y plazoleta de comidas para descubrir sabores y compartir.' },
    { name: 'Servicios', title: 'Tus vueltas, en un mismo lugar.', description: 'Soluciones prácticas que se conectan con tu rutina.' },
    { name: 'Bienestar', title: 'Más espacio para cuidarte.', description: 'Conceptos de bienestar y espacios para moverte a tu ritmo.' },
    { name: 'Experiencias', title: 'Tiempo para encontrarnos.', description: 'Lugares para compartir, trabajar y disfrutar con los tuyos.' },
  ] as const;
  protected readonly gallery = [
    { src: 'assets/render-1.webp', title: 'Espacios para encontrarnos.', alt: 'Render de la plazoleta abierta y los recorridos comerciales de Girardot Express', width: 1765, height: 904 },
    { src: 'assets/render-3.webp', title: 'Todo más cerca.', alt: 'Render de la fachada y los accesos del centro comercial Girardot Express', width: 1765, height: 898 },
    { src: 'assets/vida-cotidiana.webp', title: 'Diseñado para recorrerlo fácilmente.', alt: 'Visualización de los espacios peatonales previstos en Girardot Express', width: 1280, height: 720 },
  ] as const;
  protected readonly selectedImage = computed(() => this.gallery[this.galleryIndex()]);

  private readonly destroyRef = inject(DestroyRef);
  private galleryTrigger?: HTMLElement;
  private previousOverflow = '';

  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.titleService.setTitle(`${SITE_CONTENT.name} | ${SITE_CONTENT.slogan}`);
    this.meta.updateTag({
      name: 'description',
      content:
        `Compras, servicios, gastronomía, bienestar y experiencias en Girardot. ${SITE_CONTENT.openingLabel}.`,
    });
    this.meta.updateTag({ property: 'og:title', content: `${SITE_CONTENT.name} | ${SITE_CONTENT.slogan}` });
    this.meta.updateTag({
      property: 'og:description',
      content: ` ${SITE_CONTENT.slogan} ${SITE_CONTENT.openingLabel}.`.trim(),
    });
    this.meta.updateTag({ property: 'og:url', content: '/' });
    this.setCanonical('/');

    this.destroyRef.onDestroy(() => {
      if (this.galleryDialog?.nativeElement.open) this.restoreGalleryScroll();
    });
  }

  protected openGallery(index: number, event: Event): void {
    const dialog = this.galleryDialog?.nativeElement;
    if (!dialog) return;
    this.galleryIndex.set(index);
    this.galleryTrigger = event.currentTarget as HTMLElement;
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    dialog.showModal();
  }

  protected closeGallery(): void {
    this.galleryDialog?.nativeElement.close();
  }

  protected restoreGalleryScroll(): void {
    this.document.body.style.overflow = this.previousOverflow;
    this.galleryTrigger?.focus();
  }

  protected moveGallery(direction: number): void {
    this.galleryIndex.update((index) => (index + direction + this.gallery.length) % this.gallery.length);
  }

  protected galleryKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      this.moveGallery(event.key === 'ArrowRight' ? 1 : -1);
    }
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
