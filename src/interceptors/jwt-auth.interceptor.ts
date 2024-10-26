import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const jwtAuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const service = inject(AuthService);
  if (service.isAuthenticated()) {
    const token = service.getJwtTokenRaw();
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401 && service.isAuthenticated()) {
        // Token might be expired, attempt to refresh
        return service.refreshAccessToken().pipe(
          switchMap(() => {
            const newJwtAuthToken = service.getJwtToken();
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newJwtAuthToken}`
              }
            });
            return next(request);
          }),
          catchError(err => {
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
