import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const bookFavoriteResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookMarketService).favorites({
    institutionId: inject(AuthService).getPrimarySearchScopeId(),
    userId: params.userId
  });
};
