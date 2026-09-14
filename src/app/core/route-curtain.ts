import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationSkipped, Router } from '@angular/router';

export type CurtainDirection = 'to-project' | 'to-home';

interface CurtainRun {
  id: number;
  direction: CurtainDirection;
  element: HTMLElement;
  strips: { black: HTMLElement; yellow: HTMLElement }[];
  animations: Animation[];
  timeout?: ReturnType<typeof setTimeout>;
  frame?: number;
}

@Injectable({ providedIn: 'root' })
export class RouteCurtain {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private active?: CurtainRun;
  private keyboard = false;

  constructor() {
    if (!this.browser) return;
    const keyboard = () => { this.keyboard = true; };
    const pointer = () => { this.keyboard = false; };
    const dismiss = () => { if (this.active) this.dismiss(this.active); };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.document.addEventListener('keydown', keyboard, true);
    this.document.addEventListener('pointerdown', pointer, true);
    window.addEventListener('resize', dismiss);
    reduced.addEventListener('change', dismiss);
    this.destroyRef.onDestroy(() => {
      dismiss();
      this.document.removeEventListener('keydown', keyboard, true);
      this.document.removeEventListener('pointerdown', pointer, true);
      window.removeEventListener('resize', dismiss);
      reduced.removeEventListener('change', dismiss);
    });
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      const run = this.active;
      if (!run || !('id' in event) || event.id !== run.id) return;
      if (event instanceof NavigationEnd) {
        // Paint the new route and restored scroll under the opaque curtain.
        // Avoid native snapshots, which restored the outgoing scroll on mobile.
        run.frame = requestAnimationFrame(() => {
          run.frame = requestAnimationFrame(() => { void this.uncover(run); });
        });
      } else if (event instanceof NavigationCancel || event instanceof NavigationError || event instanceof NavigationSkipped) {
        this.dismiss(run);
      }
    });
  }

  async cover(id: number, direction: CurtainDirection): Promise<boolean> {
    if (this.active) this.dismiss(this.active);
    if (!this.browser || this.keyboard || window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        typeof this.document.documentElement.animate !== 'function') return true;

    // Focusing a link in the compact menu can start a smooth viewport scroll.
    // Stop it at its current position before painting a fixed overlay; otherwise
    // Chromium can move that overlay's composited pixels during the route swap.
    window.scrollTo({ left: window.scrollX, top: window.scrollY, behavior: 'instant' });

    const element = this.document.createElement('div');
    element.className = 'route-curtain';
    element.setAttribute('aria-hidden', 'true');
    element.dataset['phase'] = 'covering';
    element.dataset['direction'] = direction;
    const layer = this.document.createElement('div');
    layer.className = 'route-curtain__layer';
    const width = this.document.documentElement.clientWidth;
    const height = window.innerHeight;
    layer.style.left = `${-height / 2 - 3}px`;
    layer.style.width = `${width + height + 6}px`;
    const signature = this.document.createElement('div');
    signature.className = 'route-curtain__signature';
    const firstName = this.document.createElement('span');
    const lastName = this.document.createElement('span');
    firstName.textContent = 'Girardot';
    lastName.textContent = 'Express';
    signature.append(firstName, this.document.createTextNode(' '), lastName);
    element.append(layer);
    const count = Math.ceil((width + height + 6) / (width / (width <= 720 ? 6 : 10)));
    const run: CurtainRun = { id, direction, element, strips: [], animations: [] };
    this.active = run;
    for (let index = 0; index < count; index++) {
      const strip = this.document.createElement('div');
      strip.className = 'route-curtain__strip';
      const stripLeft = index * (width + height + 6) / count;
      strip.style.left = `${stripLeft}px`;
      strip.style.width = `calc(${100 / count}% + 3px)`;
      const black = this.document.createElement('div');
      const yellow = this.document.createElement('div');
      black.className = 'route-curtain__paint route-curtain__paint--black';
      yellow.className = 'route-curtain__paint route-curtain__paint--yellow';
      // Each yellow panel carries a clipped piece of the same printed name.
      // Counter the layer's skew so the assembled lettering stays horizontal.
      // At rest: layerLeft + stripLeft + printLeft + height / 2 === 0.
      const print = this.document.createElement('div');
      print.className = 'route-curtain__print';
      print.style.left = `${3 - stripLeft}px`;
      print.style.width = `${width}px`;
      print.style.height = `${height}px`;
      print.append(signature.cloneNode(true));
      yellow.append(print);
      strip.append(black, yellow);
      layer.append(strip);
      run.strips.push({ black, yellow });
    }
    this.document.body.append(element);
    // A stalled lazy chunk must not trap the visitor behind a painted screen.
    run.timeout = setTimeout(() => this.dismiss(run), 1600);
    try {
      const from = direction === 'to-home' ? '101%' : '-101%';
      const entrance = run.strips.flatMap(({ black, yellow }, index) => {
        const order = direction === 'to-home' ? count - 1 - index : index;
        const delay = order * 150 / (count - 1);
        return [
          this.animate(run, black, from, '0%', 200, delay),
          this.animateAssembly(run, yellow, from, 200, delay + 50),
        ];
      });
      await Promise.all(entrance);
      if (this.active === run) element.dataset['phase'] = 'covered';
    } catch {
      this.dismiss(run);
    }
    return true;
  }

  private async uncover(run: CurtainRun): Promise<void> {
    if (this.active !== run) return;
    run.element.dataset['phase'] = 'revealing';
    try {
      const to = run.direction === 'to-home' ? '-101%' : '101%';
      const exit = run.strips.flatMap(({ black, yellow }, index) => {
        const order = run.direction === 'to-home' ? run.strips.length - 1 - index : index;
        const delay = order * 130 / (run.strips.length - 1);
        return [
          this.animate(run, yellow, '0%', to, 200, delay),
          this.animate(run, black, '0%', to, 200, delay + 45),
        ];
      });
      await Promise.all(exit);
    } finally {
      this.dismiss(run);
    }
  }

  private animate(run: CurtainRun, paint: HTMLElement, from: string, to: string, duration: number, delay: number): Promise<void> {
    const easing = getComputedStyle(this.document.documentElement).getPropertyValue('--ease-in-out').trim();
    const animation = paint.animate(
      [{ transform: `translateY(${from})` }, { transform: `translateY(${to})` }],
      { duration, delay, easing, fill: 'both' },
    );
    run.animations.push(animation);
    return animation.finished.then(() => undefined, () => undefined);
  }

  private animateAssembly(run: CurtainRun, paint: HTMLElement, from: string, duration: number, delay: number): Promise<void> {
    const easing = getComputedStyle(this.document.documentElement).getPropertyValue('--ease-in-out').trim();
    const animation = paint.animate([
      { transform: `translateY(${from}) scaleX(0.86)`, offset: 0 },
      { transform: 'translateY(0%) scaleX(0.86)', offset: 0.7 },
      { transform: 'translateY(0%) scaleX(1)', offset: 1 },
    ], { duration, delay, easing, fill: 'both' });
    run.animations.push(animation);
    return animation.finished.then(() => undefined, () => undefined);
  }

  private dismiss(run: CurtainRun): void {
    if (run.timeout !== undefined) clearTimeout(run.timeout);
    if (run.frame !== undefined) cancelAnimationFrame(run.frame);
    run.animations.forEach(animation => animation.cancel());
    run.element.remove();
    if (this.active === run) this.active = undefined;
  }
}
