import { TestBed } from '@angular/core/testing';
import { MallExplorer } from './mall-explorer';
import { MALL_WALK, SECOND_FLOOR_WALK, walkIndex } from './mall-walk';
import { MALL_SCENE_LOADER } from './mall-scene-loader';

const fake = vi.hoisted(() => ({
  create: vi.fn(), scene: { dispose: vi.fn(), reset: vi.fn(), zoom: vi.fn(), setAmbience: vi.fn(), goTo: vi.fn() },
}));

describe('MallExplorer navigation and loading lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fake.create.mockImplementation(async (_host: HTMLElement, signal: AbortSignal) => {
      signal.addEventListener('abort', () => fake.scene.dispose(), { once: true });
      return fake.scene;
    });
    TestBed.configureTestingModule({ providers: [{ provide: MALL_SCENE_LOADER, useValue: fake.create }] });
  });

  function setup() {
    const fixture = TestBed.createComponent(MallExplorer);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const start = async () => {
      root.querySelector<HTMLButtonElement>('.launch-button')!.click();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    return { fixture, root, start };
  }

  async function finishTransition(fixture: ReturnType<typeof setup>['fixture'], root: HTMLElement) {
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(root.querySelector('.scene-transition')?.classList.contains('is-visible')).toBe(false);
    });
  }

  it('keeps WebGL off the page until explicitly requested', () => {
    const { fixture, root } = setup();
    expect(fake.create).not.toHaveBeenCalled();
    expect(root.querySelector('canvas')).toBeNull();
    expect(root.querySelector('img')?.getAttribute('src')).toBeTruthy();
    fixture.destroy();
  });

  it('does not reopen if the visitor cancels while its library loads', async () => {
    const { fixture, root } = setup();
    root.querySelector<HTMLButtonElement>('.launch-button')!.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.cancel-button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(root.querySelector('.view-controls')).toBeNull();
    expect(root.querySelector('.launch-button')?.textContent).toContain('Explorar en 3D');
    fixture.destroy();
  });

  it('offers retry after failure and disposes resources when closed', async () => {
    fake.create.mockRejectedValueOnce(new Error('WebGL unavailable'));
    const { fixture, root, start } = setup();
    await start();
    expect(root.querySelector('.launch-button')?.textContent).toContain('Reintentar');
    await start();
    expect(root.querySelector('.view-controls')).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.close-button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fake.scene.dispose).toHaveBeenCalledOnce();
    expect(root.querySelector('.explorer-poster')).not.toBeNull();
    fixture.destroy();
  });

  it('enters at the access, advances to the adjacent stop and keeps ambience independent', async () => {
    const { fixture, root, start } = setup();
    await start();
    root.querySelectorAll<HTMLButtonElement>('.view-switch button')[1].click();
    await finishTransition(fixture, root);
    expect(fake.scene.goTo).toHaveBeenLastCalledWith(0, true, 'ground');
    const [back, next] = root.querySelectorAll<HTMLButtonElement>('.walk-actions button');
    expect(back.disabled).toBe(true);
    next.click();
    fixture.detectChanges();
    expect(fake.scene.goTo).toHaveBeenLastCalledWith(1, false, 'ground');
    expect(root.querySelector('.walk-point')?.textContent).toContain(MALL_WALK[1].title);
    root.querySelector<HTMLButtonElement>('.ambience-button')!.click();
    fixture.detectChanges();
    expect(fake.scene.setAmbience).toHaveBeenLastCalledWith(false);
    expect(root.querySelector('.walk-point')?.textContent).toContain(MALL_WALK[1].title);
    fixture.destroy();
  });

  it('bounds route navigation at the first and last stop', () => {
    expect(walkIndex(0, -1)).toBe(0);
    expect(walkIndex(MALL_WALK.length - 1, 1)).toBe(MALL_WALK.length - 1);
    expect(walkIndex(2, 100)).toBe(3);
    expect(walkIndex(2, -100)).toBe(1);
    expect(walkIndex(2, 1, 3)).toBe(2);
  });

  it('starts the selected floor at its landing and uses that floor for each move', async () => {
    const { fixture, root, start } = setup();
    await start();
    root.querySelectorAll<HTMLButtonElement>('.view-switch button')[1].click();
    await finishTransition(fixture, root);
    const picker = root.querySelector<HTMLSelectElement>('.floor-picker select')!;
    picker.value = 'upper'; picker.dispatchEvent(new Event('change'));
    await finishTransition(fixture, root);
    expect(fake.scene.goTo).toHaveBeenLastCalledWith(0, true, 'upper');
    expect(root.querySelector('.walk-point')?.textContent).toContain(SECOND_FLOOR_WALK[0].title);
    root.querySelectorAll<HTMLButtonElement>('.walk-actions button')[1].click();
    fixture.detectChanges();
    expect(fake.scene.goTo).toHaveBeenLastCalledWith(1, false, 'upper');
    picker.value = 'ground'; picker.dispatchEvent(new Event('change'));
    await finishTransition(fixture, root);
    expect(fake.scene.goTo).toHaveBeenLastCalledWith(0, true, 'ground');
    expect(root.querySelector('.walk-point')?.textContent).toContain(MALL_WALK[0].title);
    fixture.destroy();
  });

  it('covers camera cuts and cancels a queued view change when closed', async () => {
    const { fixture, root, start } = setup(); await start();
    vi.useFakeTimers();
    try {
      root.querySelectorAll<HTMLButtonElement>('.view-switch button')[1].click(); fixture.detectChanges();
      expect(root.querySelector('.scene-transition')?.classList.contains('is-visible')).toBe(true);
      expect(root.querySelector('.explorer-stage')?.getAttribute('aria-busy')).toBe('true');
      expect(fake.scene.goTo).not.toHaveBeenCalled();
      root.querySelector<HTMLButtonElement>('.close-button')!.click();
      vi.advanceTimersByTime(1000); fixture.detectChanges();
      expect(fake.scene.goTo).not.toHaveBeenCalled();
      expect(root.querySelector('.scene-transition')).toBeNull();
      expect(fake.scene.dispose).toHaveBeenCalledOnce();
      fixture.destroy();
    } finally { vi.useRealTimers(); }
  });
});
