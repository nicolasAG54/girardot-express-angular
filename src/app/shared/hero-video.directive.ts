import { DOCUMENT } from '@angular/common';
import { afterNextRender, DestroyRef, Directive, ElementRef, HostListener, inject, signal } from '@angular/core';

/** One playback owner for both heroes; explicit Play is separate from autoplay. */
@Directive({ selector: 'video[appHeroVideo]', exportAs: 'heroPlayback' })
export class HeroVideoDirective {
  readonly playing = signal(false);
  private readonly video = inject(ElementRef<HTMLVideoElement>).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private intent: 'auto' | 'play' | 'pause' = 'auto';
  private visible = false;
  private motion?: MediaQueryList;
  private request = 0;
  private pending = false;
  private needsReload = false;

  constructor() {
    afterNextRender(() => {
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const observer = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting && entry.intersectionRatio > 0;
        this.syncPlayback();
      });
      const visibilityChanged = () => this.syncPlayback();
      const resourceFailed = () => this.onError();
      const motionChanged = () => {
        this.intent = 'auto';
        this.syncPlayback();
      };
      observer.observe(this.video);
      // A <source> failure does not bubble and may leave play() pending forever.
      this.video.addEventListener('error', resourceFailed, true);
      this.document.addEventListener('visibilitychange', visibilityChanged);
      this.motion.addEventListener('change', motionChanged);
      this.destroyRef.onDestroy(() => {
        observer.disconnect();
        this.video.removeEventListener('error', resourceFailed, true);
        this.document.removeEventListener('visibilitychange', visibilityChanged);
        this.motion?.removeEventListener('change', motionChanged);
        this.stop();
      });
    });
  }

  toggle(): void {
    if (this.playing()) {
      this.intent = 'pause';
      this.stop();
      return;
    }

    this.intent = 'play';
    // A click may arrive before the observer's first callback.
    const rect = this.video.getBoundingClientRect();
    this.visible = rect.bottom > 0 && rect.top < window.innerHeight;
    // play() alone cannot recover a failed resource, or an already-playing
    // element stuck waiting for data. Retry that resource only on explicit Play.
    if (this.pending || this.needsReload || this.video.error || (!this.video.paused && !this.playing())) {
      this.stop();
      this.needsReload = false;
      this.video.load();
    }
    this.syncPlayback();
  }

  private syncPlayback(): void {
    const allowed = this.visible && !this.document.hidden && this.intent !== 'pause'
      && (this.intent === 'play' || !this.motion?.matches);
    if (!allowed) {
      this.stop();
      return;
    }
    if (this.pending || this.needsReload || !this.video.paused) return;
    this.video.defaultMuted = true;
    this.video.muted = true;
    this.video.volume = 0;
    this.pending = true;
    const request = ++this.request;
    void this.video.play().catch((error: DOMException) => {
      if (request !== this.request || this.destroyRef.destroyed) return;
      this.playing.set(false);
      this.needsReload = error.name !== 'NotAllowedError' && error.name !== 'AbortError';
    }).finally(() => {
      if (request === this.request) this.pending = false;
    });
  }

  private stop(): void {
    ++this.request;
    this.pending = false;
    this.video.pause();
    this.playing.set(false);
  }

  @HostListener('playing')
  protected onPlaying(): void {
    this.needsReload = false;
    this.playing.set(true);
  }

  @HostListener('pause')
  @HostListener('waiting')
  @HostListener('ended')
  @HostListener('emptied')
  protected onStopped(): void {
    this.playing.set(false);
  }

  @HostListener('stalled')
  protected onStalled(): void {
    if (this.video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) this.playing.set(false);
  }

  @HostListener('error')
  protected onError(): void {
    this.needsReload = true;
    this.playing.set(false);
  }
}
