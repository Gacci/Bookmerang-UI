import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isCollegeScopeSetGuard: CanActivateFn = (route, state) => {
  return !!inject(AuthService).getJwtToken()?.institutions?.length;
};
