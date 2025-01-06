import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

export const bookFavoriteResolver: ResolveFn<any> = (route, state) => {
  return inject(BookMarketService).favorites({
    userId: route.params['userId'],
    institutionId: route.queryParams['scope']
  });
};
