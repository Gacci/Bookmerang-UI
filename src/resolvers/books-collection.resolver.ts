import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookCollectionService } from '../services/book-collection.service';

import * as ISBN from 'isbn3';
import { BookMarketService } from '../services/book-market.service';

export const booksCollectionResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  console.log('booksCollectionResolver', params)
  return inject(BookMarketService).collections({
    institutionId: params.scope,
    ...(params.isbn13 ? { isbn13: ISBN.asIsbn13(params.isbn13) } : {}),
    ...(params.title ? { title: params.title } : {})
  });
};
