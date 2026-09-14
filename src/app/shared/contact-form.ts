import { Component, ElementRef, Input, OnChanges, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE_CONTENT } from '../core/site-content';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnChanges {
  @Input() context: 'general' | 'commercial' = 'general';

  protected readonly submitted = signal(false);
  protected readonly site = SITE_CONTENT;
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    company: new FormControl('', { nonNullable: true }),
    role: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    area: new FormControl('', { nonNullable: true }),
    interest: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  private readonly hostElement = inject(ElementRef) as ElementRef<HTMLElement>;

  ngOnChanges(): void {
    for (const name of ['company', 'role', 'category', 'area'] as const) {
      const control = this.form.controls[name];
      control.setValidators(this.context === 'commercial' ? [Validators.required] : []);
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  protected openWhatsApp(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      setTimeout(() => {
        this.hostElement.nativeElement
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    const value = this.form.getRawValue();
    const subject =
      this.context === 'commercial' ? 'Interés en espacios comerciales' : 'Consulta general';
    const message = [
      `Hola, mi nombre es ${value.name}.`,
      subject,
      `Teléfono: ${value.phone}`,
      value.email ? `Correo: ${value.email}` : '',
      `Interés: ${value.interest}`,
      ...(this.context === 'commercial' ? [
        `Empresa o marca: ${value.company}`, `Cargo: ${value.role}`,
        `Categoría del negocio: ${value.category}`, `Área requerida: ${value.area}`,
      ] : []),
      value.message,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `${this.site.whatsappUrl}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener',
    );
  }
}
