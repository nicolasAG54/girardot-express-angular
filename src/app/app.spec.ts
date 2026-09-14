import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { App } from './app';

@Component({ template: '<h1>Inicio</h1>' })
class HomeRouteStub {}

@Component({ template: '<h1>Proyecto</h1>' })
class ProjectRouteStub {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', component: HomeRouteStub },
          { path: 'proyecto', component: ProjectRouteStub },
        ]),
      ],
    }).compileComponents();
  });

  it('creates the application shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the primary navigation and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-site-header')).toBeTruthy();
    expect(element.querySelector('app-site-footer')).toBeTruthy();
  });

  it('makes cross-page scroll restoration immediate and cleans up on destruction', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/');

    await router.navigateByUrl('/proyecto');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('main')?.getAttribute('data-route-motion')).toBeNull();
    expect(document.documentElement.classList.contains('is-route-changing')).toBe(true);

    fixture.destroy();
    expect(document.documentElement.classList.contains('is-route-changing')).toBe(false);
  });

  it('keeps same-page fragment navigation separate from route motion', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/');

    await router.navigateByUrl('/#experiencias');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(document.documentElement.classList.contains('is-route-changing')).toBe(false);
    expect(element.querySelector('main')?.getAttribute('data-route-motion')).toBeNull();

    fixture.destroy();
  });
});
