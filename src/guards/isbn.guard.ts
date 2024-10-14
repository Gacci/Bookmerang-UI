import { CanActivateFn } from '@angular/router';

import * as ISBN from 'isbn3';

export const isbnGuard: CanActivateFn = (route, state) => {
  const params: any = { ...route.params, ...route.queryParams };
  return !!ISBN.parse(params.isbn13)?.isValid;
};
