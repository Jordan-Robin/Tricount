import { Routes } from '@angular/router';
import { PATHS } from './routes.constants';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@shared/components/layouts/app-layout/app-layout').then((m) => m.AppLayout),
    children: [
      {
        path: PATHS.PROJECTS,
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@features/projects/project-list/project-list').then((m) => m.ProjectList),
          },
          {
            path: PATHS.NEW,
            loadComponent: () =>
              import('@features/projects/add-project/add-project').then((m) => m.AddProject),
          },
        ],
      },
      {
        path: PATHS.PROFILE,
        loadComponent: () =>
          import('@features/profiles/display-profile/display-profile').then(
            (m) => m.DisplayProfile,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('@shared/components/layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: PATHS.LOGIN,
        loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
      },
      {
        path: PATHS.REGISTER,
        loadComponent: () => import('@features/auth/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '',
    redirectTo: PATHS.LOGIN,
    pathMatch: 'full',
  },
];
