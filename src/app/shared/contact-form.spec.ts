import { TestBed } from '@angular/core/testing';
import { ContactForm } from './contact-form';
import { CONTACT_DELIVERY, LocalContactDeliveryError } from '../core/contact-delivery';
import { CONTACT_AUTHORIZATION, CONTACT_LIMITS, LEGAL_CONTENT } from '../core/legal-content';

describe('Email contact forms', () => {
  const deliver = vi.fn<(...args: [URLSearchParams, AbortSignal]) => Promise<void>>();
  beforeEach(() => {
    deliver.mockReset().mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [{ provide: CONTACT_DELIVERY, useValue: deliver }] });
  });

  function setup(context: 'general' | 'commercial', authorize = true) {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('context', context); fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const fill = (name: string, value: string) => {
      const input = element.querySelector<HTMLInputElement>(`[formControlName="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
    };
    const submit = async () => {
      element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve(); await Promise.resolve(); fixture.detectChanges();
    };
    fill('name', 'Ana'); fill('phone', '3135550101');
    fill('interest', context === 'commercial' ? 'Local comercial' : 'Información general');
    fill('message', 'Quisiera conocer el proyecto.');
    const consent = element.querySelector<HTMLInputElement>('#contact-consent')!;
    consent.checked = authorize; consent.dispatchEvent(new Event('change'));
    return { fixture, element, fill, submit };
  }

  it('requires a valid email and submits general fields without company data', async () => {
    const { fixture, element, fill, submit } = setup('general');
    await submit(); expect(deliver).not.toHaveBeenCalled();
    expect(element.querySelector('#contact-email')?.getAttribute('aria-invalid')).toBe('true');
    fill('email', 'ana@example.com'); await submit();
    const payload = deliver.mock.calls[0][0];
    expect(payload.get('form-name')).toBe('contacto-general');
    expect(payload.get('email')).toBe('ana@example.com');
    expect(payload.has('company')).toBe(false);
    expect(element.textContent).toContain('Tu solicitud quedó registrada'); fixture.destroy();
  });

  it('includes required business details and consent evidence', async () => {
    const { fixture, fill, submit } = setup('commercial');
    fill('email', 'ana@example.com'); await submit(); expect(deliver).not.toHaveBeenCalled();
    fill('company', 'Marca de prueba'); fill('role', 'Gerente'); fill('category', 'Gastronomía'); fill('area', '60 m²');
    await submit(); const payload = deliver.mock.calls[0][0];
    expect(payload.get('form-name')).toBe('espacios-comerciales');
    for (const [key, value] of Object.entries({ company: 'Marca de prueba', role: 'Gerente', category: 'Gastronomía', area: '60 m²' })) expect(payload.get(key)).toBe(value);
    expect(payload.get('authorization')).toBe(CONTACT_AUTHORIZATION);
    expect(payload.get('authorization-version')).toBe(LEGAL_CONTENT.version);
    expect(Number.isNaN(Date.parse(payload.get('authorized-at')!))).toBe(false);
    expect(payload.get('page')).toBe('/proyecto'); fixture.destroy();
  });

  it('recomputes requirements when the form changes audience', async () => {
    const { fixture, fill, submit } = setup('commercial');
    fill('email', 'ana@example.com'); await submit(); expect(deliver).not.toHaveBeenCalled();
    fixture.componentRef.setInput('context', 'general'); fixture.detectChanges();
    fill('interest', 'Información general'); await submit(); expect(deliver).toHaveBeenCalledOnce(); fixture.destroy();
  });

  it('requires explicit authorization', async () => {
    const { fixture, element, fill, submit } = setup('general', false);
    fill('email', 'ana@example.com'); await submit();
    expect(deliver).not.toHaveBeenCalled();
    expect(element.querySelector('#contact-consent')?.getAttribute('aria-invalid')).toBe('true'); fixture.destroy();
  });

  it('prevents duplicate sends while pending and after success until a new query', async () => {
    let resolve!: () => void;
    deliver.mockImplementation(() => new Promise<void>(done => { resolve = done; }));
    const { fixture, element, fill, submit } = setup('general'); fill('email', 'ana@example.com');
    await submit(); await submit(); expect(deliver).toHaveBeenCalledOnce();
    expect(element.querySelector<HTMLButtonElement>('[type=submit]')!.disabled).toBe(true);
    resolve(); await Promise.resolve(); fixture.detectChanges();
    await submit(); expect(deliver).toHaveBeenCalledOnce();
    element.querySelector<HTMLButtonElement>('.form-clear')!.click(); fixture.detectChanges();
    expect(element.querySelector<HTMLInputElement>('#contact-email')!.value).toBe('');
    expect(element.querySelector<HTMLInputElement>('#contact-consent')!.checked).toBe(false);
    expect(element.querySelector<HTMLButtonElement>('[type=submit]')!.disabled).toBe(false); fixture.destroy();
  });

  it('preserves data on failure and permits an explicit retry', async () => {
    deliver.mockRejectedValueOnce(new Error('offline'));
    const { fixture, element, fill, submit } = setup('general'); fill('email', 'ana@example.com'); await submit();
    expect(element.querySelector('[role=alert]')?.textContent).toContain('No pudimos confirmar');
    expect(element.querySelector<HTMLInputElement>('#contact-email')!.value).toBe('ana@example.com');
    await submit(); expect(deliver).toHaveBeenCalledTimes(2);
    expect(element.textContent).toContain('Tu solicitud quedó registrada'); fixture.destroy();
  });

  it('explains local copies cannot send instead of displaying false success', async () => {
    deliver.mockRejectedValueOnce(new LocalContactDeliveryError());
    const { fixture, element, fill, submit } = setup('general'); fill('email', 'ana@example.com'); await submit();
    expect(element.querySelector('[role=alert]')?.textContent).toContain('Esta copia local no envía');
    expect(element.textContent).not.toContain('Tu solicitud quedó registrada'); fixture.destroy();
  });

  it('aborts pending work on destruction', async () => {
    deliver.mockImplementation(() => new Promise<void>(() => {}));
    const { fixture, fill, submit } = setup('general'); fill('email', 'ana@example.com'); await submit();
    const signal = deliver.mock.calls[0][1]; fixture.destroy(); expect(signal.aborted).toBe(true);
  });

  it('rejects messages exceeding limits when HTML limits are bypassed', async () => {
    const { fixture, element, fill, submit } = setup('general');
    fill('email', 'ana@example.com'); fill('message', 'a'.repeat(CONTACT_LIMITS.message + 1)); await submit();
    expect(deliver).not.toHaveBeenCalled(); expect(element.querySelector('#contact-message')?.getAttribute('aria-invalid')).toBe('true'); fixture.destroy();
  });
});
