import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


export const jwtAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const service = inject(AuthService);
  const jwtAuthToken = service.getJwtTokens();

  if (jwtAuthToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtAuthToken}`
      }
    });
  }

  return next(request);
};

