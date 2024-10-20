import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  if (!!inject(AuthService).isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree(['/sign-in']);
};
