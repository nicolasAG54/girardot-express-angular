import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import { SITE_CONTENT } from '../core/site-content';

type NavContext = 'home' | 'project';

interface NavItem {
  readonly label: string;
  readonly path: '/' | '/proyecto';
  readonly fragment?: string;
  readonly section: string;
  readonly showsIndicator?: boolean;
}

const HOME_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Inicio', path: '/', section: 'inicio' },
  { label: 'Quiénes somos', path: '/', fragment: 'quienes-somos', section: 'quienes-somos' },
  { label: 'Explora el mall', path: '/', fragment: 'experiencia', section: 'experiencia' },
  { label: 'Nuestras marcas', path: '/', fragment: 'marcas', section: 'marcas' },
  { label: 'Galería', path: '/', fragment: 'galeria', section: 'galeria' },
  { label: 'Cómo llegar', path: '/', fragment: 'ubicacion', section: 'ubicacion' },
  { label: 'Contacto', path: '/', fragment: 'contacto', section: 'contacto' },
];

const PROJECT_NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Espacios comerciales',
    path: '/proyecto',
    fragment: 'project-top',
    section: 'project-top',
  },
  { label: 'Cifras', path: '/proyecto', fragment: 'cifras', section: 'cifras' },
  { label: 'Etapas', path: '/proyecto', fragment: 'etapas', section: 'etapas' },
  {
    label: 'Arquitectura',
    path: '/proyecto',
    fragment: 'arquitectura',
    section: 'arquitectura',
  },
  {
    label: 'Galería',
    path: '/proyecto',
    fragment: 'galeria-proyecto',
    section: 'galeria-proyecto',
  },
  {
    label: 'Cómo llegar',
    path: '/proyecto',
    fragment: 'ubicacion-proyecto',
    section: 'ubicacion-proyecto',
  },
  {
    label: 'Contacto',
    path: '/proyecto',
    fragment: 'contacto-comercial',
    section: 'contacto-comercial',
  },
];

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  @ViewChild('headerElement') private headerElement?: ElementRef<HTMLElement>;
  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('navStage') private navStage?: ElementRef<HTMLElement>;

  private readonly applicationRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private trackedSections: HTMLElement[] = [];
  private scrollFrame: number | undefined;
  private sectionFrame: number | undefined;
  private indicatorFrame: number | undefined;
  private pendingSection?: string;
  private pendingSectionTimer?: ReturnType<typeof setTimeout>;

  protected readonly site = SITE_CONTENT;
  protected readonly menuOpen = signal(false);
  protected readonly routeContext = signal<NavContext>(this.contextFromUrl(this.router.url));
  protected readonly activeSection = signal(this.defaultSection(this.routeContext()));
  protected readonly navGroups = computed(() => {
    const items = this.routeContext() === 'project' ? PROJECT_NAV_ITEMS : HOME_NAV_ITEMS;
    return [items.slice(0, 4), items.slice(4)];
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.destroySectionTracking());

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.handleNavigation(event.urlAfterRedirects));

    if (this.isBrowser) {
      void this.applicationRef.whenStable().then(() => {
        if (this.destroyRef.destroyed) return;
        this.scheduleSectionTracking(this.router.url);
        this.scheduleNavigationIndicator();
      });
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected selectSection(item: NavItem, event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    this.followDestination(item.section);
    this.closeMenu();
  }

  private followDestination(section: string): void {
    if (!this.isBrowser) return;
    this.clearDestination();
    this.pendingSection = section;
    this.activeSection.set(section);
    this.scheduleNavigationIndicator();
    // Safety release for missing anchors or scrolling interrupted by the browser.
    this.pendingSectionTimer = setTimeout(() => this.resumeScrollTracking(), 2500);
  }

  private clearDestination(): void {
    this.pendingSection = undefined;
    if (this.pendingSectionTimer !== undefined) clearTimeout(this.pendingSectionTimer);
    this.pendingSectionTimer = undefined;
  }

  @HostListener('document:wheel')
  @HostListener('document:touchstart')
  protected resumeScrollTracking(): void {
    if (!this.pendingSection) return;
    this.clearDestination();
    this.updateActiveSection();
  }

  @HostListener('document:keydown', ['$event'])
  protected interruptSectionNavigation(event: KeyboardEvent): void {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) {
      this.resumeScrollTracking();
    }
  }

  protected isActive(item: NavItem): boolean {
    const currentPath = this.routeContext() === 'project' ? '/proyecto' : '/';
    return item.path === currentPath && this.activeSection() === item.section;
  }

  protected ariaCurrent(item: NavItem): 'page' | 'location' | null {
    const currentPath = this.routeContext() === 'project' ? '/proyecto' : '/';
    return this.isActive(item) && item.path === currentPath
      ? (item.section === 'inicio' ? 'page' : 'location') : null;
  }

  @HostListener('document:keydown.escape')
  protected closeMenuWithEscape(): void {
    if (!this.menuOpen()) return;

    this.menuOpen.set(false);
    this.menuButton?.nativeElement.focus();
  }

  @HostListener('document:pointerdown', ['$event'])
  protected closeMenuOutside(event: PointerEvent): void {
    if (!this.headerElement?.nativeElement.contains(event.target as Node)) this.resumeScrollTracking();
    if (this.menuOpen() && !this.headerElement?.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize')
  protected realignNavigationIndicator(): void {
    this.clearDestination();
    if (window.innerWidth > 1280) this.closeMenu();
    this.scheduleSectionTracking(this.router.url);
    this.scheduleNavigationIndicator();
  }

  @HostListener('window:scroll')
  protected trackScrollPosition(): void {
    if (!this.isBrowser || this.scrollFrame !== undefined) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = undefined;
      this.updateActiveSection();
    });
  }

  private handleNavigation(url: string): void {
    const context = this.contextFromUrl(url);
    this.routeContext.set(context);
    const section = this.sectionFromUrl(url, context);
    this.clearDestination();
    this.activeSection.set(section);
    const items = context === 'project' ? PROJECT_NAV_ITEMS : HOME_NAV_ITEMS;
    if (this.router.currentNavigation()?.trigger === 'imperative' && items.some(item => item.section === section)) {
      this.followDestination(section);
    }
    this.closeMenu();
    this.scheduleSectionTracking(url);
    this.scheduleNavigationIndicator();
  }

  private scheduleSectionTracking(url: string): void {
    if (!this.isBrowser) return;

    if (this.sectionFrame !== undefined) cancelAnimationFrame(this.sectionFrame);
    this.trackedSections = [];

    this.sectionFrame = requestAnimationFrame(() => {
      this.sectionFrame = requestAnimationFrame(() => {
        this.sectionFrame = undefined;
        this.collectSections(url);
      });
    });
  }

  private collectSections(url: string): void {
    const context = this.contextFromUrl(url);
    const items = context === 'project' ? PROJECT_NAV_ITEMS : HOME_NAV_ITEMS;
    const ids = new Set([this.defaultSection(context), ...items.map((item) => item.fragment)]);
    this.trackedSections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
      .filter((section) => ids.has(section.id));
    if (this.trackedSections.length) this.updateActiveSection();
  }

  private updateActiveSection(): void {
    if (!this.trackedSections.length) return;
    const headerHeight = this.headerElement?.nativeElement.getBoundingClientRect().height ?? 0;
    if (this.pendingSection) {
      const target = this.trackedSections.find(section => section.id === this.pendingSection);
      if (target) {
        const destination = Math.max(0, Math.min(
          window.scrollY + target.getBoundingClientRect().top - headerHeight,
          document.documentElement.scrollHeight - window.innerHeight,
        ));
        if (Math.abs(window.scrollY - destination) <= 4) this.clearDestination();
      }
      // Keep the chosen link selected while passing intermediate sections.
      return;
    }
    const activationLine = headerHeight + 48;
    let current = this.trackedSections[0].id;
    // Read current bounds, never cached IntersectionObserver rectangles. Unlisted
    // subsections belong to their preceding chapter and cannot erase the indicator.
    for (const section of this.trackedSections) {
      if (section.getBoundingClientRect().top <= activationLine) current = section.id;
      else break;
    }
    if (current !== this.activeSection()) {
      this.activeSection.set(current);
      this.scheduleNavigationIndicator();
    }
  }

  private scheduleNavigationIndicator(): void {
    if (!this.isBrowser) return;

    if (this.indicatorFrame !== undefined) cancelAnimationFrame(this.indicatorFrame);
    this.indicatorFrame = requestAnimationFrame(() => {
      this.indicatorFrame = undefined;
      this.updateNavigationIndicator();
    });
  }

  private updateNavigationIndicator(): void {
    const contextNavigation = this.navStage?.nativeElement.querySelector<HTMLElement>('.context-nav');
    const activeLink = contextNavigation?.querySelector<HTMLElement>(
      'a.is-active:not(.no-section-indicator)',
    );

    if (!contextNavigation) return;

    const indicatorTarget = activeLink ?? contextNavigation.querySelector<HTMLElement>('a');
    if (!indicatorTarget) {
      contextNavigation.style.setProperty('--nav-indicator-opacity', '0');
      return;
    }

    const navigationBounds = contextNavigation.getBoundingClientRect();
    const activeBounds = indicatorTarget.getBoundingClientRect();

    contextNavigation.style.setProperty(
      '--nav-indicator-x',
      `${activeBounds.left - navigationBounds.left}px`,
    );
    contextNavigation.style.setProperty('--nav-indicator-scale', `${activeBounds.width}`);
    contextNavigation.style.setProperty('--nav-indicator-opacity', activeLink ? '1' : '0');
  }

  private contextFromUrl(url: string): NavContext {
    return url.split(/[?#]/)[0] === '/proyecto' ? 'project' : 'home';
  }

  private defaultSection(context: NavContext): string {
    return context === 'project' ? 'project-top' : 'inicio';
  }

  private sectionFromUrl(url: string, context: NavContext): string {
    if (url.split(/[?#]/)[0] === '/preguntas-frecuentes') return '';
    const fragment = url.split('#')[1]?.split('?')[0];
    if (!fragment) return this.defaultSection(context);
    return fragment;
  }

  private destroySectionTracking(): void {
    this.clearDestination();
    this.trackedSections = [];
    if (this.isBrowser && this.scrollFrame !== undefined) cancelAnimationFrame(this.scrollFrame);

    if (this.isBrowser && this.sectionFrame !== undefined) {
      cancelAnimationFrame(this.sectionFrame);
      this.sectionFrame = undefined;
    }

    if (this.isBrowser && this.indicatorFrame !== undefined) {
      cancelAnimationFrame(this.indicatorFrame);
      this.indicatorFrame = undefined;
    }
  }
}
