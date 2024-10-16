import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

export const bookMarketResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookMarketService).search({
    ...(params.isbn13 ? { isbn13: [params.isbn13.replace(/[^0-9]+/g, '')] } : {}),
    ...(/^true|false$/.test(params.tradeable)
      ? { tradeable: JSON.parse(params.tradeable) }
      : {}),
    ...(+params.state
      ? {
          'state[]': [
            ...(!!(+params.state & (1 << 0)) ? ['NEW'] : []),
            ...(!!(+params.state & (1 << 1)) ? ['LIKE_NEW'] : []),
            ...(!!(+params.state & (1 << 2)) ? ['VERY_GOOD'] : []),
            ...(!!(+params.state & (1 << 3)) ? ['GOOD'] : []),
            ...(!!(+params.state & (1 << 4)) ? ['ACCEPTABLE'] : [])
          ]
        }
      : {})
  });
};
