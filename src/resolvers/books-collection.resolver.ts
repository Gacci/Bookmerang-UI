import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookCollectionService } from '../services/book-collection.service';

export const booksCollectionResolver: ResolveFn<any> = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return inject(BookCollectionService).search(route.queryParams);
};
