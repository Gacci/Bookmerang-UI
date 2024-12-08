import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, of, tap } from 'rxjs';

export const isLoggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  if( !auth.isAuthenticated() ) {
    const router = inject(Router);
    return auth.logout()
      .pipe(
        tap(() => of(router.navigate(['/sign-in']))),
        map(() => false) // Return `false`
      );
  }
    
  console.log('Authenticated', auth.getPrimaryScope())
  return true;
};
