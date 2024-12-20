import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const jwtAuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const service = inject(AuthService);
  if (service.isAuthenticated()) {
    const token = service.getJwtTokenRaw();
    request = request.clone({
      // withCredentials: true,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError(error => {
      console.log('JwtAuth.interceptor', error);
      if (error.status === 401 && service.isAuthenticated()) {
        return service.refreshAccessToken().pipe(
          switchMap(() => {
            const newJwtAuthToken = service.getJwtToken();
            request = request.clone({
              // withCredentials: true,
              setHeaders: {
                Authorization: `Bearer ${newJwtAuthToken}`
              }
            });
            return next(request);
          }),
          catchError(err => {
            service.logout().subscribe({
              next: () => inject(Router).createUrlTree(['/login']),
              error: () => inject(Router).createUrlTree(['/login'])
            });

            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
