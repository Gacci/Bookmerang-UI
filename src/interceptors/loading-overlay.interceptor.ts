import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { LoadingOverlayService } from '../services/loading-overlay.service';

export const loadingOverlayInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the LoadingService instance
  const loadingOverlayService = inject(LoadingOverlayService);

  // Define the routes or patterns that should skip the loading overlay
  const excludedRoutes: RegExp[] = [
    new RegExp('/books/collections/isbn/\\d{13}'),
    new RegExp('/books/markets/metrics')
  ];

  // Check if the request URL matches any of the excluded routes
  const shouldExcludeRoute = excludedRoutes.some((route) => route.test(req.url));

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
