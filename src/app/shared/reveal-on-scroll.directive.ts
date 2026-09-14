import {
  ApplicationRef,
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  Renderer2,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const REVEAL_STATE_ATTRIBUTE = 'data-reveal-on-scroll';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private observer: IntersectionObserver | undefined;
  private reducedMotionQuery: MediaQueryList | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    void this.applicationRef.whenStable().then(() => {
      queueMicrotask(() => {
        if (!this.destroyRef.destroyed) {
          this.initialize();
        }
      });
    });
  }

  private initialize(): void {
    if (typeof window.matchMedia === 'function') {
      this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotionQuery.addEventListener('change', this.handleReducedMotionChange);

      if (this.reducedMotionQuery.matches) {
        this.reveal();
        return;
      }
    }

    if (typeof IntersectionObserver !== 'function') {
      this.reveal();
      return;
    }

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (this.element.getBoundingClientRect().top < viewportHeight) {
      this.reveal();
      return;
    }

    this.renderer.setAttribute(this.element, REVEAL_STATE_ATTRIBUTE, 'pending');
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.reveal();
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.01,
      },
    );
    this.observer.observe(this.element);
  }

  private readonly handleReducedMotionChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      this.reveal();
    }
  };

  private reveal(): void {
    this.renderer.setAttribute(this.element, REVEAL_STATE_ATTRIBUTE, 'visible');
    this.observer?.disconnect();
    this.observer = undefined;
    this.stopWatchingMotionPreference();
  }

  private stopWatchingMotionPreference(): void {
    this.reducedMotionQuery?.removeEventListener('change', this.handleReducedMotionChange);
    this.reducedMotionQuery = undefined;
  }

  private destroy(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.stopWatchingMotionPreference();
  }
}
