import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

import * as ISBN from 'isbn3';

export const bookMarketResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookMarketService).search({
    ...(params.isbn13 ? { isbn13: [ISBN.asIsbn13(params.isbn13)] } : {}),
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
      : {}),
    ...(['posted-on', 'review', 'price:asc', 'price:desc'].includes(
      params.sorting
    )
      ? { sorting: params.sorting }
      : {})
  });

  /*
      ...(['posted-on', 'review', 'price:asc', 'price:desc'].includes(
        params.sorting
      )
        ? (([sortBy, sortDir = 'desc']) => ({ sortBy, sortDir }))(
              params.sorting.split(':')
            )
          
        : {})
*/
};
