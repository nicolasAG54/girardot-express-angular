import { Component, ElementRef, Input, OnChanges, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE_CONTENT } from '../core/site-content';
import { CONTACT_AUTHORIZATION, CONTACT_LIMITS, LEGAL_CONTENT } from '../core/legal-content';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnChanges {
  @Input() context: 'general' | 'commercial' = 'general';

  protected readonly submitted = signal(false);
  protected readonly cleared = signal(false);
  protected readonly site = SITE_CONTENT;
  protected readonly authorization = CONTACT_AUTHORIZATION;
  protected readonly limits = CONTACT_LIMITS;
  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(CONTACT_LIMITS.name)] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(CONTACT_LIMITS.phone)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(CONTACT_LIMITS.email)] }),
    company: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(CONTACT_LIMITS.company)] }),
    role: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(CONTACT_LIMITS.role)] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(CONTACT_LIMITS.category)] }),
    area: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(CONTACT_LIMITS.area)] }),
    interest: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(CONTACT_LIMITS.message)] }),
    consent: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  private readonly hostElement = inject(ElementRef) as ElementRef<HTMLElement>;

  ngOnChanges(): void {
    for (const name of ['company', 'role', 'category', 'area'] as const) {
      const control = this.form.controls[name];
      control.setValidators([
        Validators.maxLength(CONTACT_LIMITS[name]),
        ...(this.context === 'commercial' ? [Validators.required] : []),
      ]);
      control.updateValueAndValidity({ emitEvent: false });
    }
  }

  protected openWhatsApp(): void {
    this.cleared.set(false);
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
      '',
      `Autorización de contacto (${LEGAL_CONTENT.version}): ${CONTACT_AUTHORIZATION}`,
      'Información de privacidad: https://girardotexpress.com.co/privacidad',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `${this.site.whatsappUrl}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  protected clearForm(): void {
    this.form.reset();
    this.submitted.set(false);
    this.cleared.set(true);
    this.hostElement.nativeElement.querySelector<HTMLInputElement>('#contact-name')?.focus();
  }
}
