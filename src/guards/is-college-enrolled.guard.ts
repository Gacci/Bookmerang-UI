import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const isCollegeEnrolledGuard: CanActivateFn = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return !inject(AuthService).getUserScope()?.includes(+params.scope)
    ? inject(Router).createUrlTree(['/home'])
    : true;
};
