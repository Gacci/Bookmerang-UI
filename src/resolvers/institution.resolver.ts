import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { InstitutionService } from '../services/institution.service';

export const institutionResolver: ResolveFn<any> = (route, state) => {
  const auth = inject(AuthService);
  const collegeCampusService = inject(InstitutionService);

  const { institutions } = auth.getJwtToken();
  return forkJoin(
    institutions.map((institution: number) =>
      collegeCampusService.read(institution)
    )
  );
};
