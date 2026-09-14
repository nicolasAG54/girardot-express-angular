import { TestBed } from '@angular/core/testing';
import { ContactForm } from './contact-form';

describe('V3 contact forms', () => {
  function setup(context: 'general' | 'commercial') {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('context', context);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const fill = (name: string, value: string) => {
      const input = element.querySelector<HTMLInputElement>(`[formControlName="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
    };
    const submit = () => { element.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); fixture.detectChanges(); };
    fill('name', 'Ana'); fill('phone', '3135550101'); fill('interest', context === 'commercial' ? 'Local comercial' : 'Información general'); fill('message', 'Quisiera conocer el proyecto.');
    const consent = element.querySelector<HTMLInputElement>('[formControlName="consent"]')!;
    consent.checked = true; consent.dispatchEvent(new Event('change'));
    return { fixture, element, fill, submit };
  }

  it('requires a valid email for a visitor without requiring company data', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { fixture, element, fill, submit } = setup('general');
    submit(); expect(open).not.toHaveBeenCalled(); expect(element.querySelector('#contact-email')?.getAttribute('aria-invalid')).toBe('true');
    fill('email', 'ana@example.com'); submit();
    expect(open).toHaveBeenCalledOnce();
    expect(element.querySelector('#contact-company')).toBeNull();
    fixture.destroy(); open.mockRestore();
  });

  it('requires business details and includes them in the prepared commercial message', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { fixture, fill, submit } = setup('commercial');
    fill('email', 'ana@example.com'); submit(); expect(open).not.toHaveBeenCalled();
    fill('company', 'Marca de prueba'); fill('role', 'Gerente'); fill('category', 'Gastronomía'); fill('area', '60 m²'); submit();
    expect(open).toHaveBeenCalledOnce();
    const message = new URL(String(open.mock.calls[0][0])).searchParams.get('text')!;
    for (const value of ['Marca de prueba', 'Gerente', 'Gastronomía', '60 m²', 'ana@example.com', 'Interés en espacios comerciales']) expect(message).toContain(value);
    fixture.destroy(); open.mockRestore();
  });

  it('recomputes requirements when the reused form changes audience', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { fixture, fill, submit } = setup('commercial');
    fill('email', 'ana@example.com'); submit(); expect(open).not.toHaveBeenCalled();
    fixture.componentRef.setInput('context', 'general'); fixture.detectChanges();
    fill('interest', 'Información general'); submit(); expect(open).toHaveBeenCalledOnce();
    fixture.destroy(); open.mockRestore();
  });
});
