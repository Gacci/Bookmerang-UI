import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookMarketService } from '../services/book-market.service';

import * as ISBN from 'isbn3';

export const booksCollectionResolver: ResolveFn<any> = (route, state) => {
  const params: any = route.queryParams;
  return inject(BookMarketService).collections({
    institutionId: params.scope,
    ...(params.isbn13 ? { isbn13: ISBN.asIsbn13(params.isbn13) } : {}),
    ...(params.keyword ? { keyword: params.keyword } : {})
  });
};
