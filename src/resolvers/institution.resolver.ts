import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Institution } from '../interfaces/institution.interface';

export const institutionResolver: ResolveFn<Institution[]> = (route, state) => {
  return inject(AuthService).getUserCampuses();
};
