import { Routes } from '@angular/router';
import { PATHS } from './routes.constants';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: PATHS.LOGIN,
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
  },
  {
    path: PATHS.REGISTER,
    loadComponent: () => import('@features/auth/register/register').then((m) => m.Register),
  },
  {
    path: PATHS.PROJECTS,
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/projects/project-list/project-list').then((m) => m.ProjectList),
  },
  {
    path: PATHS.HOME,
    redirectTo: PATHS.LOGIN,
    pathMatch: 'full',
  },
];
