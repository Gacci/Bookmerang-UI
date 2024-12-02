import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isCollegeScopeSetGuard: CanActivateFn = (route, state) => {
  return !inject(AuthService).getUserScope()
    ? inject(Router).createUrlTree(['/settings'])
    : true;
};
