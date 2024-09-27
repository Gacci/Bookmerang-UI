import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngneat/hot-toast';

import { routes } from './app.routes';
import { jwtAuthInterceptor } from '../interceptors/jwt-auth.interceptor';
import { httpErrorsInterceptor } from '../interceptors/http-errors.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // enable position restoration
      }),
    ),
    provideHotToastConfig({
      visibleToasts: 1,
      style: {},
    }),
    provideHttpClient(
      withInterceptors([jwtAuthInterceptor, httpErrorsInterceptor]),
    ),
  ],
};
