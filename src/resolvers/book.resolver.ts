import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookCollectionService } from '../services/book-collection.service';

import * as ISBN from 'isbn3';

export const bookResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookCollectionService).read(ISBN.asIsbn13(params.isbn13));
};
