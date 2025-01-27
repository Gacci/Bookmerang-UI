import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';

import * as ISBN from 'isbn3';

export const booksCollectionResolver: ResolveFn<any> = route => {
  const query: any = route.queryParams;
  return inject(BookMarketService).collections({
    institutionId: inject(AuthService).getAuthScopeId(),
    ...(query.isbn13 ? { isbn13: ISBN.asIsbn13(query.isbn13) } : {}),
    ...(query.keyword ? { keyword: query.keyword } : {}),
    ...(query.sorting ? { sorting: query.sorting } : {})
  });
};
