import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';

export const httpErrorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const alerts = inject(HotToastService);

  return next(req).pipe(
    catchError((response: HttpErrorResponse) => {
      console.log('HTTP Error:', response);

      if (!(response.error instanceof ErrorEvent)) {
        // Show general error messages
        alerts.error(
          Array.isArray(response.error.message)
            ? response.error.message.join(', ')
            : response.error.message,
          {
            className: 'text-xs',
            position: 'bottom-center'
          }
        );
      }

      return throwError(() => response);
    })
  );
};
