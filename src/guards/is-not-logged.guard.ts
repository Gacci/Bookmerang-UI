import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const isNotLoggedGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthService).isAuthenticated()) {
    return true;
  }

  return inject(Router).createUrlTree(['/home']);
};
