import { CanActivateFn } from '@angular/router';

import * as ISBN from 'isbn3';

export const isISBNGuard: CanActivateFn = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return (
    /\d{13}|\d{9}[0-9X]/.test(params.isbn13) && !!ISBN.asIsbn13(params.isbn13)
  );
};
