import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

export const inventoryResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };

  return inject(BookMarketService).search({
    institutionId: params.scope,
    userId: params.userId
  });
};
