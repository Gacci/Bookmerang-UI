import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) {
    return of(true);
  }

  const router = inject(Router);
  return auth.refreshAccessToken().pipe(
    switchMap(success => {
      if (success) {
        return of(true);
      } else {
        return handleLogOut(router, auth);
      }
    }),
    catchError(() => handleLogOut(router, auth))
  );
};

function handleLogOut(router: Router, auth: AuthService) {
  return auth.logout().pipe(
    tap(() => router.navigate(['/sign-in'])),
    map(() => false) // Block navigation
  );
}
