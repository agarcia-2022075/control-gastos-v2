import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserResponse } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  currentUser: UserResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.currentUser = res.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error cargando datos del usuario.';
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
