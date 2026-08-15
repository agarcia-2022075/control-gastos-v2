import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, UserResponse } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  authService = inject(AuthService);
  
  users: UserResponse[] = [];
  currentUser: UserResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        if (res.success) {
          this.currentUser = res.data;
          this.fetchUsers();
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'No se pudo verificar la información del administrador.';
      }
    });
  }

  fetchUsers(): void {
    this.authService.getUsers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.users = res.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al obtener la lista de usuarios.';
      }
    });
  }

  onRoleChange(user: UserResponse, newRole: 'USER' | 'ADMIN'): void {
    if (user.role === newRole) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateUserRole(user.id, newRole).subscribe({
      next: (res) => {
        if (res.success) {
          user.role = newRole;
          this.successMessage = `Rol del usuario ${user.email} actualizado a ${newRole}.`;
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo cambiar el rol del usuario.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }
}
