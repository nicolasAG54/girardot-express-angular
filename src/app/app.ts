import {
  AfterViewInit,
  ApplicationRef,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SiteFooter } from './shared/site-footer';
import { SiteHeader } from './shared/site-header';
import { ChatbotWidget } from './shared/chatbot-widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, ChatbotWidget],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  @ViewChild('mainContent') private mainContent?: ElementRef<HTMLElement>;

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly pageDocument = inject(DOCUMENT);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly applicationRef = inject(ApplicationRef);
  private initialNavigationHandled = false;
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private routeScrollTimer: ReturnType<typeof setTimeout> | undefined;
  private activePath = this.router.url.split(/[?#]/)[0];

  constructor() {
    // Router anchor scrolling uses window.scrollTo and does not read CSS scroll-padding.
    // Measure at the time of navigation so desktop, mobile and zoom share one offset.
    this.viewportScroller.setOffset(() => [
      0,
      this.pageDocument.querySelector('header.site-header')?.getBoundingClientRect().height ?? 0,
    ]);
    this.destroyRef.onDestroy(() => {
      if (this.routeScrollTimer !== undefined) clearTimeout(this.routeScrollTimer);
      this.pageDocument.documentElement.classList.remove('is-route-changing');
    });
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.prepareRouteScroll(event.url));

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        const nextPath = event.urlAfterRedirects.split(/[?#]/)[0];
        const pathChanged = nextPath !== this.activePath;
        const hasFragment = event.urlAfterRedirects.includes('#');
        this.activePath = nextPath;

        // The shell can be stable before the initial lazy route is attached.
        // Hydration suppresses the router's first Scroll event, so wait for
        // NavigationEnd and the committed route, not just the shell render.
        if (!this.initialNavigationHandled && this.isBrowser) {
          this.initialNavigationHandled = true;
          if (hasFragment) {
            const initialUrl = event.urlAfterRedirects;
            void this.applicationRef.whenStable().then(() => {
              requestAnimationFrame(() => {
                if (this.destroyRef.destroyed || this.router.url !== initialUrl) return;
                const fragment = this.router.parseUrl(initialUrl).fragment;
                if (fragment) this.viewportScroller.scrollToAnchor(fragment, { behavior: 'instant' });
              });
            });
          }
        }

        if (pathChanged) this.scheduleRouteScrollCleanup();
        if (!pathChanged || hasFragment) return;

        setTimeout(() => {
          const heading = this.mainContent?.nativeElement.querySelector<HTMLElement>('h1');
          heading?.setAttribute('tabindex', '-1');
          heading?.focus({ preventScroll: true });
        });
      });
  }

  private prepareRouteScroll(url: string): void {
    const nextPath = url.split(/[?#]/)[0];
    if (nextPath === this.activePath) return;

    if (this.routeScrollTimer !== undefined) clearTimeout(this.routeScrollTimer);
    this.pageDocument.documentElement.classList.add('is-route-changing');
    this.routeScrollTimer = setTimeout(() => {
      this.pageDocument.documentElement.classList.remove('is-route-changing');
      this.routeScrollTimer = undefined;
    }, 3000);

  }

  private scheduleRouteScrollCleanup(): void {
    if (this.routeScrollTimer !== undefined) clearTimeout(this.routeScrollTimer);
    this.routeScrollTimer = setTimeout(() => {
      this.pageDocument.documentElement.classList.remove('is-route-changing');
      this.routeScrollTimer = undefined;
    }, 600);

  }
}
