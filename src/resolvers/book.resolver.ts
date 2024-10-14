import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookCollectionService } from '../services/book-collection.service';

export const bookResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookCollectionService).read(
    params.isbn13?.replace(/[^0-9]+/g, '')
  );
};
