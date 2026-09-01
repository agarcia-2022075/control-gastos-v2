import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private router = inject(Router);
  private authService = inject(AuthService);

  isSessionExpired = signal<boolean>(false);

  notifySessionExpired(): void {
    this.isSessionExpired.set(true);
  }

  redirectToLogin(): void {
    this.isSessionExpired.set(false);
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
