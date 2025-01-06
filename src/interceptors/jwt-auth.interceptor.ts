import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';

import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const jwtAuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  request = request.clone({
    ...(auth.isAuthenticated()
      ? {
          // withCredentials: true,
          setHeaders: {
            Authorization: `Bearer ${auth.getJwtTokenRaw()}`
          }
        }
      : {})
  });

  return next(request).pipe(
    catchError(error => {
      console.log('JwtAuth.interceptor', error);
      if (error.status === 401 && auth.$jwt !== undefined) {
        const router = inject(Router);
        return auth.refreshAccessToken().pipe(
          switchMap(() => {
            return next(
              request.clone({
                // withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${auth.getJwtToken()}`
                }
              })
            );
          }),
          catchError(err => {
            auth.logout().subscribe({
              error: () => router.createUrlTree(['/login']),
              next: () => router.createUrlTree(['/login'])
            });

            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
