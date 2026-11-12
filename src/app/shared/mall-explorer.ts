import { Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SITE_MEDIA } from '../core/site-media';
import { MALL_ROUTES, type MallFloor, walkIndex } from './mall-walk';
import type { MallScene } from './mall-scene';
import { MALL_SCENE_LOADER } from './mall-scene-loader';

@Component({
  selector: 'app-mall-explorer',
  templateUrl: './mall-explorer.html',
  styleUrl: './mall-explorer.scss',
})
export class MallExplorer {
  @ViewChild('sceneHost', { static: true }) private sceneHost!: ElementRef<HTMLDivElement>;
  @ViewChild('startButton') private startButton?: ElementRef<HTMLButtonElement>;
  protected readonly poster = SITE_MEDIA.aerial;
  protected readonly active = signal(false);
  protected readonly state = signal<'idle' | 'loading' | 'ready' | 'error'>('idle');
  protected readonly progress = signal(0);
  protected readonly interior = signal(false);
  protected readonly ambience = signal(true);
  protected readonly moving = signal(false);
  protected readonly step = signal(0);
  protected readonly floor = signal<MallFloor>('ground');
  protected readonly points = computed(() => MALL_ROUTES[this.floor()]);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loadScene = inject(MALL_SCENE_LOADER);
  private scene?: MallScene;
  private abort?: AbortController;
  private attempt = 0;

  constructor() {
    this.destroyRef.onDestroy(() => { this.attempt++; this.abort?.abort(); });
  }

  protected async start(): Promise<void> {
    if (this.state() === 'loading') return;
    const attempt = ++this.attempt;
    this.abort?.abort();
    const abort = this.abort = new AbortController();
    this.progress.set(0);
    this.state.set('loading');
    this.active.set(true);
    try {
      // Keep WebGL and model data off the initial and SSR paths.
      const scene = await this.loadScene(this.sceneHost.nativeElement, abort.signal, {
        progress: value => { if (attempt === this.attempt) this.progress.set(Math.round(value * 100)); },
        failure: () => { if (attempt === this.attempt) this.fail(); },
        step: direction => this.advance(direction),
        moving: value => this.moving.set(value),
      });
      if (this.destroyRef.destroyed || attempt !== this.attempt) { scene.dispose(); return; }
      this.scene = scene;
      scene.setAmbience(this.ambience());
      this.interior.set(false);
      this.floor.set('ground');
      this.step.set(0);
      this.progress.set(100);
      this.state.set('ready');
    } catch {
      if (!this.destroyRef.destroyed && attempt === this.attempt) this.fail();
    }
  }

  protected fail(): void {
    this.attempt++;
    this.abort?.abort();
    this.scene = undefined;
    this.active.set(false);
    this.state.set('error');
  }

  protected reset(): void {
    this.interior.set(false);
    this.step.set(0);
    this.scene?.reset();
  }

  protected enter(): void {
    if (!this.scene) return;
    this.interior.set(true);
    this.step.set(0);
    this.scene.goTo(0, true, this.floor());
  }

  protected selectFloor(event: Event): void {
    const floor = (event.target as HTMLSelectElement).value;
    if (!this.scene || !this.interior() || (floor !== 'ground' && floor !== 'upper')) return;
    this.floor.set(floor);
    this.step.set(0);
    // Changing floors starts at its landing, without a camera flight through slabs.
    this.scene.goTo(0, true, floor);
  }

  protected advance(direction: number): void {
    if (!this.scene || !this.interior() || this.moving()) return;
    const next = walkIndex(this.step(), direction, this.points().length);
    if (next === this.step()) return;
    this.step.set(next);
    this.scene.goTo(next, false, this.floor());
  }

  protected toggleAmbience(): void {
    this.ambience.update(value => !value);
    this.scene?.setAmbience(this.ambience());
  }

  protected zoom(direction: number): void { this.scene?.zoom(direction); }

  protected close(): void {
    this.attempt++;
    this.abort?.abort();
    this.scene = undefined;
    this.active.set(false);
    this.state.set('idle');
    this.interior.set(false);
    this.moving.set(false);
    setTimeout(() => {
      if (!this.destroyRef.destroyed) this.startButton?.nativeElement.focus();
    });
  }
}
