import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { BookCollectionService } from '../services/book-collection.service';

import * as ISBN from 'isbn3';

// type BookQuery = { isbn13: string };

export const bookResolver: ResolveFn<any> = (route, state) => {
  return inject(BookCollectionService).read(
    ISBN.asIsbn13(route.queryParams['isbn13'])
  );
};
