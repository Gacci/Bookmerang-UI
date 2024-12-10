import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
// import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// protected toastElemRef!: CreateHotToastRef<any>;

export const httpErrorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const alerts = inject(HotToastService);
  return next(req).pipe(
    catchError(({ error: response }: HttpErrorResponse) => {
      console.log(response);
      if (!(response.error instanceof ErrorEvent)) {

        console.log('Error NOT of type ErrorEvent', response);
        if (response.error.status === 401) {

          console.log('Redirecting ... ');
          const router = inject(Router);
          inject(AuthService)
            .logout()
            .subscribe({
              next: () => router.createUrlTree(['login']),
              error: () => router.createUrlTree(['login'])
            });
        }

        alerts.error(
          Array.isArray(response.message)
            ? response.message.join(', ')
            : response.message,
          {
            className: 'text-xs',
            position: 'bottom-center'
          }
        );
      }

      return throwError(() => new Error(response.message));
    })
  );
};
