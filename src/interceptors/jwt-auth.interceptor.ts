import { HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const jwtAuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const service = inject(AuthService);
  const jwtAuthToken = service.getJwtTokens();

  if (jwtAuthToken) {
    request = request.clone({
      setHeaders: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGlvbnMiOlsxODQwXSwiZW1haWwiOiJqdXN0by5qb25hdGhhbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjc5MjkyNjcsImlzcyI6Imh0dHA6Ly9ib29rbWVyYW5nLmNvbSIsImp0aSI6IjNEOUVFNEE0MzlEM0ZBODQ1RUIyQzY3QzE2MEUzQjE4Iiwicm9sZXMiOltdLCJzdWIiOjEsImV4cCI6MTcyODE4ODQ2N30._v4WXS9DcP_tx0xt2DbiGbea-QguOMAiHxrXhkwkdKk'
        // Authorization: `Bearer ${jwtAuthToken}`,
      }
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error.status === 401 && jwtAuthToken) {
        // Token might be expired, attempt to refresh
        return service.refreshAccessToken().pipe(
          switchMap(() => {
            const newJwtAuthToken = service.getJwtTokens();
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newJwtAuthToken}`
              }
            });
            return next(request);
          }),
          catchError((err) => {
            // Handle refresh token failure (e.g., logout)
            service.logout();
            return throwError(err); // Adjusted to throwError(err)
          })
        );
      }
      return throwError(error);
    })
  );
};
