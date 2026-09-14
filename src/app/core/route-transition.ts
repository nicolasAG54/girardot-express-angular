import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteCurtain } from './route-curtain';

/** Cover only a change between the two public pages, never an initial load or anchor. */
export const routeTransition: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const curtain = inject(RouteCurtain);
  const from = router.url.split(/[?#]/)[0];
  const to = state.url.split(/[?#]/)[0];
  const pages = ['/', '/proyecto'];
  if (!router.navigated || from === to || !pages.includes(from) || !pages.includes(to)) return true;
  return curtain.cover(router.currentNavigation()?.id ?? 0, to === '/proyecto' ? 'to-project' : 'to-home');
};
