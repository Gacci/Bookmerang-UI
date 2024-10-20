import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BookCollectionService } from '../services/book-collection.service';

import * as ISBN from 'isbn3';

export const bookExistsGuard: CanActivateFn = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  if (!ISBN.asIsbn13(params.isbn13)) {
    return of(false);
  }

  return inject(BookCollectionService)
    .read(ISBN.asIsbn13(params.isbn13))
    .pipe(
      map((book) => !!book),
      catchError(() => of(false))
    );
};
