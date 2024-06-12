import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApplication } from '../../routes/auth/application/auth-application';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authApplication = inject(AuthApplication);
  const router = inject(Router);

  const isLogged = authApplication.isUserLogged;

  if (!isLogged) {
    router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};
