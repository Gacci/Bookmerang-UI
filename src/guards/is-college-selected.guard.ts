import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isCollegeSelectedGuard: CanActivateFn = (route, state) => {
  return !!inject(AuthService).getPrimaryScope();
};
