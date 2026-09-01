import { Injectable, inject, signal, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private router = inject(Router);
  private ngZone = inject(NgZone);

  isSessionExpired = signal<boolean>(false);
  private timerHandle: any = null;
  private intervalCheckHandle: any = null;

  constructor() {
    this.startProactiveSessionMonitor();
  }

  notifySessionExpired(): void {
    this.clearTimers();
    this.ngZone.run(() => {
      this.isSessionExpired.set(true);
    });
  }

  redirectToLogin(): void {
    this.ngZone.run(() => {
      this.isSessionExpired.set(false);
      this.clearTimers();
      sessionStorage.removeItem('auth_token');
      this.router.navigate(['/login']);
    });
  }

  public startProactiveSessionMonitor(): void {
    this.clearTimers();
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;

    const payload = this.parseJwt(token);
    if (!payload || !payload.exp) return;

    const expirationMs = payload.exp * 1000;
    const timeUntilExpiration = expirationMs - Date.now();

    if (timeUntilExpiration <= 0) {
      this.notifySessionExpired();
      return;
    }

    // 1. Temporizador de precisión para el tiempo exacto de expiración del JWT
    this.timerHandle = setTimeout(() => {
      this.notifySessionExpired();
    }, timeUntilExpiration);

    // 2. Verificación en tiempo real cada 1 segundo (dispara la modal instantáneamente sin refrescar)
    this.ngZone.runOutsideAngular(() => {
      this.intervalCheckHandle = setInterval(() => {
        const currentToken = sessionStorage.getItem('auth_token');
        if (!currentToken) {
          this.clearTimers();
          return;
        }
        const p = this.parseJwt(currentToken);
        if (p && p.exp) {
          const remaining = p.exp * 1000 - Date.now();
          if (remaining <= 0) {
            this.notifySessionExpired();
          }
        }
      }, 1000);
    });
  }

  public clearTimers(): void {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
    if (this.intervalCheckHandle) {
      clearInterval(this.intervalCheckHandle);
      this.intervalCheckHandle = null;
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
