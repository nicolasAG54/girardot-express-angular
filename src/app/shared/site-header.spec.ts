import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SiteHeader } from './site-header';

@Component({
  template: '',
})
class EmptyRoute {}

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [
        provideRouter([
          { path: '', component: EmptyRoute },
          { path: 'proyecto', component: EmptyRoute },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
  });

  it('keeps the route switch as the last persistent navigation control in both contexts', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const cta = element.querySelector<HTMLAnchorElement>('.primary-nav > .route-switch-link')!;
    const labels = () => Array.from(element.querySelectorAll('.context-nav a'), link => link.textContent?.trim());
    expect(labels()).toEqual(['Inicio', 'Quiénes somos', 'Explora el mall', 'Nuestras marcas', 'Galería', 'Cómo llegar', 'Contacto']);
    expect(cta.textContent?.trim()).toBe('Espacios comerciales');
    expect(cta.getAttribute('href')).toBe('/proyecto');
    expect(cta.nextElementSibling).toBeNull();
    expect(element.querySelector('.home-link')?.getAttribute('aria-current')).toBe('page');

    await router.navigateByUrl('/proyecto');
    fixture.detectChanges();
    expect(labels()).toEqual(['Espacios comerciales', 'Cifras', 'Etapas', 'Arquitectura', 'Galería', 'Cómo llegar', 'Contacto']);
    expect(element.querySelector('.primary-nav > .route-switch-link')).toBe(cta);
    expect(cta.textContent?.trim()).toBe('Inicio');
    expect(cta.getAttribute('href')).toBe('/');
    expect(cta.nextElementSibling).toBeNull();
    expect(cta.hasAttribute('aria-current')).toBe(false);
    expect(element.querySelector('.context-nav a.is-active')?.textContent?.trim()).toBe('Espacios comerciales');
    expect(element.querySelector('.context-nav a.is-active')?.getAttribute('aria-current')).toBe('location');
  });

  it('does not activate the cross-route commercial CTA from the Home scrollspy', async () => {
    await router.navigateByUrl('/#proyecto');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const projectCta = element.querySelector<HTMLAnchorElement>(
      '.primary-nav > .route-switch-link',
    );

    expect(projectCta?.classList.contains('is-active')).toBe(false);
    expect(projectCta?.hasAttribute('aria-current')).toBe(false);
  });

  it('keeps Contacto distinct from Cómo llegar when navigating to the home contact section', async () => {
    await router.navigateByUrl('/#contacto');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const activeLinks = Array.from(
      element.querySelectorAll<HTMLAnchorElement>('.context-nav--home a[aria-current="location"]'),
      (link) => link.textContent?.trim(),
    );

    expect(activeLinks).toEqual(['Contacto']);
    expect(element.querySelector('.context-nav--home a[href="/#ubicacion"]')?.classList.contains('is-active')).toBe(false);
  });

  it('closes the menu with Escape and returns focus to the menu button', () => {
    const element = fixture.nativeElement as HTMLElement;
    const menuButton = element.querySelector<HTMLButtonElement>('.menu-button')!;
    const firstMenuLink = element.querySelector<HTMLAnchorElement>('.home-link')!;

    menuButton.click();
    fixture.detectChanges();
    firstMenuLink.focus();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(element.querySelector('.primary-nav')?.classList.contains('is-open')).toBe(false);
    expect(document.activeElement).toBe(menuButton);
  });
});
