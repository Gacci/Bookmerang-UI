import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const isCollegeEnrolledGuard: CanActivateFn = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  const { institutions } = inject(AuthService).getJwtToken();
  console.log('Institutions: ', institutions);

  return !institutions.some(
    institution => institution.institutionId === +params.scope
  )
    ? inject(Router).createUrlTree(['/home'])
    : true;
};
