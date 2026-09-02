import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, UserResponse } from '../../core/services/auth.service';
import { DashboardService, DashboardStats, RecentTransaction } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUser: UserResponse | null = null;
  stats: DashboardStats | null = null;

  loading: boolean = true;
  submitting: boolean = false;
  editing: boolean = false;
  deleting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Sidebar and Dropdown navigation states
  isCollapsed: boolean = false;
  isTxOpen: boolean = true;

  // Form Fields
  monto: number | null = null;
  concepto: string = '';
  categoria: string = '';
  cuenta: string = 'ahorros';
  fecha: string = new Date().toISOString().split('T')[0];
  notas: string = '';

  // Table Search and Pagination States
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  // Edit Transaction Modal State
  transactionToEdit: RecentTransaction | null = null;
  editTitle: string = '';
  editCategory: string = '';
  editAmount: number | null = null;
  editMerchant: string = '';
  editDate: string = '';

  // Delete Transaction Modal State
  transactionToDelete: RecentTransaction | null = null;

  ngOnInit(): void {
    this.loadUserDataAndStats();
  }

  loadUserDataAndStats(): void {
    this.loading = true;
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.currentUser = res.data;
        }
        this.fetchStats();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error cargando datos del usuario.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.stats = res.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al obtener datos financieros.';
        this.cdr.detectChanges();
      }
    });
  }

  get recentIncomes(): RecentTransaction[] {
    if (!this.stats || !this.stats.transaccionesRecientes) return [];
    return this.stats.transaccionesRecientes.filter(tx => tx.type === 'INCOME');
  }

  get filteredIncomes(): RecentTransaction[] {
    const incomes = this.recentIncomes;
    if (!this.searchTerm.trim()) return incomes;

    const term = this.searchTerm.toLowerCase().trim();
    return incomes.filter(inc => 
      inc.title.toLowerCase().includes(term) ||
      inc.category.toLowerCase().includes(term) ||
      inc.merchant.toLowerCase().includes(term) ||
      inc.date.includes(term) ||
      inc.amount.toString().includes(term)
    );
  }

  get paginatedIncomes(): RecentTransaction[] {
    const list = this.filteredIncomes;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredIncomes.length / this.pageSize) || 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  get mainIncomeCategory(): { name: string; percentage: number } {
    if (!this.stats || this.recentIncomes.length === 0) {
      return { name: 'Salario / Nómina', percentage: 60 };
    }
    const catMap: { [key: string]: number } = {};
    let total = 0;
    this.recentIncomes.forEach(inc => {
      catMap[inc.category] = (catMap[inc.category] || 0) + inc.amount;
      total += inc.amount;
    });

    let topCat = 'Salario / Nómina';
    let topVal = 0;
    Object.keys(catMap).forEach(cat => {
      if (catMap[cat] > topVal) {
        topVal = catMap[cat];
        topCat = cat;
      }
    });

    const percentage = total > 0 ? Math.round((topVal / total) * 100) : 100;
    return { name: topCat, percentage };
  }

  onSubmit(): void {
    if (!this.monto || this.monto <= 0) {
      this.errorMessage = 'Por favor ingresa un monto válido mayor a 0.';
      return;
    }
    if (!this.concepto.trim()) {
      this.errorMessage = 'Por favor ingresa una descripción o concepto.';
      return;
    }
    if (!this.categoria) {
      this.errorMessage = 'Por favor selecciona una categoría.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const merchantText = this.cuenta === 'ahorros' ? 'Cuenta de Ahorros BD' : (this.cuenta === 'debito' ? 'Tarjeta Débito Principal' : 'Efectivo en Caja');

    this.dashboardService.createIncome({
      title: this.concepto.trim(),
      category: this.categoria,
      amount: Number(this.monto),
      merchant: merchantText,
      date: this.fecha
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success) {
          this.successMessage = '¡Ingreso registrado exitosamente!';
          // Reset form fields
          this.monto = null;
          this.concepto = '';
          this.categoria = '';
          this.notas = '';
          this.currentPage = 1;
          this.fetchStats();
        } else {
          this.errorMessage = res.message || 'Error al guardar el ingreso.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Error al registrar el ingreso.';
        this.cdr.detectChanges();
      }
    });
  }

  // Edit Modal Actions
  openEditModal(tx: RecentTransaction, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.transactionToEdit = tx;
    this.editTitle = tx.title;
    this.editCategory = tx.category;
    this.editAmount = tx.amount;
    this.editMerchant = tx.merchant;
    this.editDate = tx.date;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.transactionToEdit = null;
    this.editing = false;
    this.cdr.detectChanges();
  }

  confirmEdit(): void {
    if (!this.transactionToEdit) return;
    if (!this.editAmount || this.editAmount <= 0) {
      this.errorMessage = 'Por favor ingresa un monto válido mayor a 0.';
      return;
    }
    if (!this.editTitle.trim()) {
      this.errorMessage = 'Por favor ingresa una descripción.';
      return;
    }

    this.editing = true;
    const id = this.transactionToEdit.id;

    this.dashboardService.updateTransaction(id, {
      title: this.editTitle.trim(),
      category: this.editCategory,
      amount: Number(this.editAmount),
      merchant: this.editMerchant,
      date: this.editDate
    }).subscribe({
      next: (res: any) => {
        this.editing = false;
        if (res.success) {
          this.successMessage = 'Ingreso actualizado exitosamente.';
          this.transactionToEdit = null;
          this.fetchStats();
        } else {
          this.errorMessage = res.message || 'Error al actualizar el ingreso.';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.editing = false;
        this.errorMessage = err.error?.message || 'Error al actualizar el ingreso.';
        this.transactionToEdit = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Delete Modal Actions
  openDeleteModal(tx: RecentTransaction, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.transactionToDelete = tx;
    this.cdr.detectChanges();
  }

  cancelDelete(): void {
    this.transactionToDelete = null;
    this.deleting = false;
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (!this.transactionToDelete) return;

    this.deleting = true;
    const id = this.transactionToDelete.id;

    this.dashboardService.deleteTransaction(id).subscribe({
      next: (res) => {
        this.deleting = false;
        if (res.success) {
          this.successMessage = 'Ingreso eliminado correctamente. Tu saldo disponible ha sido actualizado.';
          this.transactionToDelete = null;
          this.fetchStats();
        } else {
          this.errorMessage = res.message || 'Error al eliminar el ingreso.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.deleting = false;
        this.errorMessage = err.error?.message || 'Error al eliminar el ingreso.';
        this.transactionToDelete = null;
        this.cdr.detectChanges();
      }
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTxSubmenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isTxOpen = !this.isTxOpen;
    this.cdr.detectChanges();
  }

  logout(): void {
    this.authService.logout();
  }
}
