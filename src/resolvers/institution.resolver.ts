import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Scope } from '../interfaces/scope.interface';

export const institutionResolver: ResolveFn<Scope[]> = (route, state) => {
  return inject(AuthService).getAuthCampuses();
};
