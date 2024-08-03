import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
// import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { CreateHotToastRef, HotToastService } from '@ngneat/hot-toast';

// protected toastElemRef!: CreateHotToastRef<any>;

export const httpErrorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
) => {
  // const router = inject(Router);
  const alerts = inject(HotToastService);
  return next(req).pipe(
    catchError(({ error: response }: HttpErrorResponse) => {
      if (!(response.error instanceof ErrorEvent)) {
        console.log(alerts.error(response.message));
      }

      return throwError(() => new Error(response.message));
    }),
  );
};
