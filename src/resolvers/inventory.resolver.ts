import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

export const inventoryResolver: ResolveFn<any> = (route, state) => {
  return inject(BookMarketService).search({
    institutionId: route.queryParams['scope'],
    userId: route.params['userId']
  });
};
