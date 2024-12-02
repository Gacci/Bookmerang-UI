import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngneat/hot-toast';

import { routes } from './app.routes';

import { AuthService } from '../services/auth.service';

import { cacheInterceptor } from '../interceptors/cache.interceptor';
import { httpErrorsInterceptor } from '../interceptors/http-errors.interceptor';
import { jwtAuthInterceptor } from '../interceptors/jwt-auth.interceptor';
import { loadingOverlayInterceptor } from '../interceptors/loading-overlay.interceptor';

export function authServiceInit(auth: AuthService) {
  return async () => await auth.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authServiceInit,
      deps: [AuthService],
      multi: true
    },
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top' // enable position restoration,
      }),
      withRouterConfig({
        onSameUrlNavigation: 'reload' // Ensures component reloads on same URL navigation
      })
    ),
    provideHttpClient(
      withInterceptors([
        loadingOverlayInterceptor,
        jwtAuthInterceptor,
        cacheInterceptor,
        httpErrorsInterceptor
      ])
    ),
    provideHotToastConfig({
      visibleToasts: 1,
      style: {}
    })
  ]
};
