import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isCollegeScopeSetGuard: CanActivateFn = (route, state) => {
  console.log('Checking scope is set', inject(AuthService).getPrimaryScope());
  return !inject(AuthService).getPrimaryScope()
    ? inject(Router).createUrlTree(['/settings'])
    : true;
};
