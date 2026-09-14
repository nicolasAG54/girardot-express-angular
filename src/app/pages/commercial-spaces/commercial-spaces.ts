import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { COMMERCIAL_FACTS, LEVELS, SITE_CONTENT } from '../../core/site-content';
import { ContactForm } from '../../shared/contact-form';

@Component({
  selector: 'app-commercial-spaces',
  imports: [ContactForm],
  templateUrl: './commercial-spaces.html',
  styleUrl: './commercial-spaces.scss',
})
export class CommercialSpaces {
  protected readonly facts = COMMERCIAL_FACTS;
  protected readonly levels = LEVELS;
  protected readonly site = SITE_CONTENT;

  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  constructor() {
    this.titleService.setTitle('Espacios comerciales | Girardot Express');
    this.meta.updateTag({
      name: 'description',
      content:
        'Conoce las características proyectadas de Girardot Express y registra el interés comercial de tu marca en Girardot.',
    });
  }
}
