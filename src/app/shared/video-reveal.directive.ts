import { afterNextRender, DestroyRef, Directive, ElementRef, HostListener, inject, signal } from '@angular/core';

/** Reveal the video over its persistent poster only after a frame can be painted. */
@Directive({
  selector: 'video[appVideoReveal]',
  host: { '[class.is-video-ready]': 'ready()' },
})
export class VideoRevealDirective {
  private readonly video = inject(ElementRef<HTMLVideoElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ready = signal(false);
  private videoFrame?: number;
  private paintFrame?: number;

  constructor() {
    afterNextRender(() => {
      // A cached video may already be playing before listeners are attached.
      if (!this.video.paused && this.video.readyState >= 2) this.revealFirstFrame();
    });
    this.destroyRef.onDestroy(() => this.cancelPendingFrame());
  }

  @HostListener('playing')
  protected revealFirstFrame(): void {
    if (this.ready() || this.videoFrame !== undefined || this.paintFrame !== undefined) return;
    const reveal = () => {
      this.videoFrame = undefined;
      this.paintFrame = undefined;
      if (!this.destroyRef.destroyed) this.ready.set(true);
    };
    if (typeof this.video.requestVideoFrameCallback === 'function') {
      this.videoFrame = this.video.requestVideoFrameCallback(reveal);
    } else {
      this.paintFrame = requestAnimationFrame(reveal);
    }
  }

  @HostListener('error')
  @HostListener('emptied')
  protected restorePoster(): void {
    this.cancelPendingFrame();
    this.ready.set(false);
  }

  private cancelPendingFrame(): void {
    if (this.videoFrame !== undefined) this.video.cancelVideoFrameCallback(this.videoFrame);
    if (this.paintFrame !== undefined) cancelAnimationFrame(this.paintFrame);
    this.videoFrame = undefined;
    this.paintFrame = undefined;
  }
}
