import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngneat/hot-toast';

import { routes } from './app.routes';

import { cacheInterceptor } from '../interceptors/cache.interceptor';
import { httpErrorsInterceptor } from '../interceptors/http-errors.interceptor';
import { jwtAuthInterceptor } from '../interceptors/jwt-auth.interceptor';
import { loadingOverlayInterceptor } from '../interceptors/loading-overlay.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
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
