import { InjectionToken } from '@angular/core';
import type { MallScene, MallSceneCallbacks } from './mall-scene';

export type MallSceneLoader = (host: HTMLElement, signal: AbortSignal, callbacks: MallSceneCallbacks) => Promise<MallScene>;

export const MALL_SCENE_LOADER = new InjectionToken<MallSceneLoader>('Mall scene loader', {
  providedIn: 'root',
  factory: () => async (host, signal, callbacks) => {
    const { createMallScene } = await import('./mall-scene');
    signal.throwIfAborted();
    return createMallScene(host, signal, callbacks);
  },
});
