import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { LoadingOverlayService } from '../services/loading-overlay.service';

export const loadingOverlayInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingOverlayService = inject(LoadingOverlayService);

  const excludedRoutes: RegExp[] = [
    new RegExp('/auth/([a-z-]+|d+)$', 'ig'),
    new RegExp('/books/markets/posts/metrics'),
    new RegExp('/books/markets/favorites')
  ];

  const shouldExcludeRoute = excludedRoutes.some(route => route.test(req.url));
  if (!shouldExcludeRoute) {
    loadingOverlayService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldExcludeRoute) {
        loadingOverlayService.hide();
      }
    })
  );
};
