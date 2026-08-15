import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.currentUserData) {
    if (authService.currentUserData.role === 'ADMIN') {
      return true;
    }
    return router.createUrlTree(['/dashboard']);
  }

  return authService.getCurrentUser().pipe(
    map(res => {
      if (res.success && res.data.role === 'ADMIN') {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};
