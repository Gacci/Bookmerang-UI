import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { BookMarketService } from '../services/book-market.service';
import { AuthService } from '../services/auth.service';

export const bookFavoriteResolver: ResolveFn<any> = (route) => {
  return inject(BookMarketService).favorites({
    userId: route.params['userId'],
    institutionId: inject(AuthService)
      .getAuthScopeId()
  });
};
