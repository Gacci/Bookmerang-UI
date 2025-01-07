import { ResolveFn } from '@angular/router';
import { BookMarketService } from '../services/book-market.service';
import { inject } from '@angular/core';

import * as ISBN from 'isbn3';
import { AuthService } from '../services/auth.service';

export const bookMarketResolver: ResolveFn<any> = (route, state) => {
  const params: any = route.queryParams;
  return inject(BookMarketService).search({
    institutionId: inject(AuthService)
      .getAuthScopeId(),
    ...(params.isbn13 ? { isbn13: [ISBN.asIsbn13(params.isbn13)] } : {}),
    ...(['true', 'false'].includes(params.tradeable)
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
      : { sorting: 'price:desc' })
  });
};
