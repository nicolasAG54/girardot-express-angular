import { Component, DestroyRef, ElementRef, Input, OnChanges, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SITE_CONTENT } from '../core/site-content';
import { CONTACT_AUTHORIZATION, CONTACT_LIMITS, LEGAL_CONTENT } from '../core/legal-content';
import { CONTACT_DELIVERY, LocalContactDeliveryError } from '../core/contact-delivery';

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
  protected readonly deliveryState = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  protected readonly deliveryError = signal('');
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
    website: new FormControl('', { nonNullable: true }),
  });
  private readonly hostElement = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly deliver = inject(CONTACT_DELIVERY);
  private readonly destroyRef = inject(DestroyRef);
  private deliveryAbort?: AbortController;

  constructor() {
    this.destroyRef.onDestroy(() => this.deliveryAbort?.abort());
  }

  protected get formName(): string {
    return this.context === 'commercial' ? 'espacios-comerciales' : 'contacto-general';
  }

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

  protected async send(): Promise<void> {
    if (this.deliveryState() === 'sending' || this.deliveryState() === 'sent') return;
    this.cleared.set(false);
    this.deliveryError.set('');
    this.deliveryState.set('idle');
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
    const payload = new URLSearchParams({
      'form-name': this.formName, subject: `Girardot Express · ${subject}`,
      name: value.name.trim(), phone: value.phone.trim(), email: value.email.trim(),
      interest: value.interest, message: value.message.trim(),
      'bot-field': value.website,
      authorization: CONTACT_AUTHORIZATION, 'authorization-version': LEGAL_CONTENT.version,
      'authorized-at': new Date().toISOString(),
      page: this.context === 'commercial' ? '/proyecto' : '/',
    });
    if (this.context === 'commercial') {
      for (const key of ['company', 'role', 'category', 'area'] as const) payload.set(key, value[key].trim());
    }
    const abort = this.deliveryAbort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 20_000);
    this.deliveryState.set('sending');
    this.form.disable({ emitEvent: false });
    try {
      await this.deliver(payload, abort.signal);
      if (!this.destroyRef.destroyed) this.deliveryState.set('sent');
    } catch (error) {
      if (this.destroyRef.destroyed) return;
      this.deliveryState.set('error');
      this.deliveryError.set(error instanceof LocalContactDeliveryError
        ? 'Esta copia local no envía solicitudes. Usa el sitio publicado o contáctanos por WhatsApp.'
        : 'No pudimos confirmar el envío. Tus datos siguen aquí. Puedes reintentar o contactarnos por WhatsApp.');
    } finally {
      clearTimeout(timeout);
      if (!this.destroyRef.destroyed) this.form.enable({ emitEvent: false });
    }
  }

  protected clearForm(): void {
    if (this.deliveryState() === 'sending') return;
    this.form.reset();
    this.deliveryState.set('idle');
    this.deliveryError.set('');
    this.submitted.set(false);
    this.cleared.set(true);
    this.hostElement.nativeElement.querySelector<HTMLInputElement>('#contact-name')?.focus();
  }
}
