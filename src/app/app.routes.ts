import { Routes } from '@angular/router';
import { routeTransition } from './core/route-transition';

export const routes: Routes = [
  {
    path: 'preguntas-frecuentes',
    loadComponent: () => import('./pages/faq/faq').then((module) => module.Faq),
  },
  {
    path: '',
    canActivate: [routeTransition],
    data: { transitionPage: 'home' },
    loadComponent: () => import('./pages/home/home').then((module) => module.Home),
  },
  {
    path: 'proyecto',
    canActivate: [routeTransition],
    data: { transitionPage: 'project' },
    loadComponent: () => import('./pages/project/project').then((module) => module.Project),
  },
  {
    path: 'espacios-comerciales',
    redirectTo: 'proyecto',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
