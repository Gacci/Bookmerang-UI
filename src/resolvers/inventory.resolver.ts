import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';

export const inventoryResolver: ResolveFn<any> = (route, state) => {
  return inject(BookMarketService).search({
    institutionId: inject(AuthService).getAuthScopeId(),
    userId: route.params['userId']
  });
};
