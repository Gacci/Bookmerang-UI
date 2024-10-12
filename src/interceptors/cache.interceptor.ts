import { inject } from '@angular/core';
import { HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheService } from '../services/cache.service';

type RequestType = 'DELETE' | 'GET' | 'POST' | 'PUT';

type CacheableRoute = {
  method: RequestType;
  route: RegExp;
  ttl: number;
};

const cacheable: CacheableRoute[] = [
  {
    method: 'GET',
    route: /\/auth\/scope$/,
    ttl: 60 * 60 * 1000
  },
  {
    method: 'GET',
    route: /\/books\/collection\?.+/,
    ttl: 60 * 60 * 1000 * 6
  }
];

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);

  const targetCacheResponse = cacheable.find(
    (expression: CacheableRoute) =>
      expression.method === req.method &&
      expression.route.test(req.urlWithParams)
  );

  if (!targetCacheResponse) {
    return next(req);
  }

  const cachedResponse = cache.get(req);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.put(req, event.clone());
      }
    })
  );
};
