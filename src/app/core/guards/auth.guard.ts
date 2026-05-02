import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { PATHS } from 'src/app/routes.constants';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    const isLoggedIn: boolean = await authService.isLoggedIn();
    return isLoggedIn ? true : router.parseUrl('/' + PATHS.LOGIN);
  } catch {
    return router.parseUrl('/' + PATHS.LOGIN);
  }
};
