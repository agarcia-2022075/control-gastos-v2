import { DashboardRepository } from '../repositories/dashboard.repository.js';

export interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
  colorClass: string;
}

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
}

export interface DashboardStatsResponse {
  saldoDisponible: number;
  gastosMes: number;
  ingresosTotales: number;
  metaAhorro: {
    target: number;
    current: number;
    percentage: number;
  };
  tendencias: {
    semana: TrendPoint[];
    mes: TrendPoint[];
    ano: TrendPoint[];
  };
  transaccionesRecientes: Array<{
    id: number;
    title: string;
    merchant: string;
    category: string;
    date: string;
    status: string;
    amount: number;
    type: 'EXPENSE' | 'INCOME';
  }>;
  gastosPorCategoria: CategoryBreakdown[];
  alertas: Array<{
    title: string;
    description: string;
    alertType: string;
  }>;
}

export class DashboardService {
  private repo = new DashboardRepository();

  async getDashboardStats(userId: number): Promise<DashboardStatsResponse> {
    await this.repo.ensureUserData(userId);

    const transactions = await this.repo.getTransactionsByUserId(userId);
    const savingsGoal = await this.repo.getSavingsGoalByUserId(userId);
    const alerts = await this.repo.getActiveAlertsByUserId(userId);

    // Calculate User's Individual Totals
    let totalIncome = 0;
    let totalExpense = 0;
    let currentMonthExpense = 0;
    let currentMonthIncome = 0;

    const categoryMap: { [key: string]: number } = {};

    // Grouping structure for trends
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthMap: { [key: string]: { income: number; expense: number } } = {};
    monthLabels.forEach(m => monthMap[m] = { income: 0, expense: 0 });

    const weekLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const weekMap: { [key: string]: { income: number; expense: number } } = {};
    weekLabels.forEach(w => weekMap[w] = { income: 0, expense: 0 });

    const yearLabels = ['2021', '2022', '2023', '2024', '2025', '2026'];
    const yearMap: { [key: string]: { income: number; expense: number } } = {};
    yearLabels.forEach(y => yearMap[y] = { income: 0, expense: 0 });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth(); // 0-based

    transactions.forEach((tx) => {
      const amount = parseFloat(tx.amount);

      // Timezone-safe Date parsing from YYYY-MM-DD string
      const dateParts = String(tx.date).split('T')[0].split('-');
      const year = parseInt(dateParts[0], 10);
      const monthIdx = parseInt(dateParts[1], 10) - 1; // 0..11
      const day = parseInt(dateParts[2], 10);
      const txDate = new Date(year, monthIdx, day);

      if (tx.type === 'INCOME') {
        totalIncome += amount;
        if (monthIdx === currentMonthIdx && year === currentYear) {
          currentMonthIncome += amount;
        }
      } else {
        totalExpense += amount;
        if (monthIdx === currentMonthIdx && year === currentYear) {
          currentMonthExpense += amount;
        }
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amount;
      }

      // Map to Month
      const mName = monthLabels[monthIdx];
      if (mName && monthMap[mName]) {
        if (tx.type === 'INCOME') monthMap[mName].income += amount;
        else monthMap[mName].expense += amount;
      }

      // Map to Day of Week
      let dayIdx = txDate.getDay() - 1; // 0=Sunday -> convert to 0=Monday
      if (dayIdx === -1) dayIdx = 6;
      const wName = weekLabels[dayIdx];
      if (wName && weekMap[wName]) {
        if (tx.type === 'INCOME') weekMap[wName].income += amount;
        else weekMap[wName].expense += amount;
      }

      // Map to Year
      const yName = year.toString();
      if (yearMap[yName]) {
        if (tx.type === 'INCOME') yearMap[yName].income += amount;
        else yearMap[yName].expense += amount;
      }
    });

    const saldoDisponible = totalIncome - totalExpense;

    // Savings Goal
    const targetAmount = savingsGoal ? parseFloat(savingsGoal.target_amount) : 10000;
    const currentAmount = savingsGoal ? parseFloat(savingsGoal.current_amount) : 0;
    const goalPercentage = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;

    // Category Breakdown
    const colorClasses = ['fill-cyan', 'fill-purple', 'fill-amber', 'fill-rose'];
    const totalCatExpense = Object.values(categoryMap).reduce((a, b) => a + b, 0);

    const gastosPorCategoria: CategoryBreakdown[] = totalCatExpense > 0
      ? Object.keys(categoryMap).map((catName, idx) => {
          const catAmount = categoryMap[catName];
          return {
            name: catName,
            amount: catAmount,
            percentage: Math.round((catAmount / totalCatExpense) * 100),
            colorClass: colorClasses[idx % colorClasses.length]
          };
        })
      : [];

    // Format trends for ALL 12 months
    const mesPoints: TrendPoint[] = monthLabels.map(m => ({
      label: m,
      income: monthMap[m].income,
      expense: monthMap[m].expense
    }));

    const semanaPoints: TrendPoint[] = weekLabels.map(w => ({
      label: w,
      income: weekMap[w].income,
      expense: weekMap[w].expense
    }));

    const anoPoints: TrendPoint[] = yearLabels.map(y => ({
      label: y,
      income: yearMap[y].income,
      expense: yearMap[y].expense
    }));

    // Recent Transactions
    const transaccionesRecientes = transactions.map((tx) => ({
      id: tx.id,
      title: tx.title,
      merchant: tx.merchant || 'Comercio Registrado',
      category: tx.category,
      date: tx.date,
      status: tx.status,
      amount: parseFloat(tx.amount),
      type: tx.type
    }));

    return {
      saldoDisponible,
      gastosMes: currentMonthExpense,
      ingresosTotales: currentMonthIncome,
      metaAhorro: {
        target: targetAmount,
        current: currentAmount,
        percentage: goalPercentage
      },
      tendencias: {
        semana: semanaPoints,
        mes: mesPoints,
        ano: anoPoints
      },
      transaccionesRecientes,
      gastosPorCategoria,
      alertas: alerts.map(a => ({
        title: a.title,
        description: a.description,
        alertType: a.alert_type
      }))
    };
  }

  async createIncome(userId: number, data: {
    title: string;
    merchant?: string;
    category: string;
    amount: number;
    date?: string;
  }) {
    if (!data.title || !data.category || !data.amount || data.amount <= 0) {
      throw new Error('Datos de ingreso inválidos. El monto debe ser positivo y se requiere un concepto.');
    }

    return await this.repo.createTransaction(userId, {
      type: 'INCOME',
      title: data.title,
      merchant: data.merchant || 'Depósito Registrado',
      category: data.category,
      amount: data.amount,
      status: 'COMPLETED',
      date: data.date || null
    });
  }

  async updateTransaction(userId: number, id: number, data: {
    title?: string;
    merchant?: string;
    category?: string;
    amount?: number;
    date?: string;
  }) {
    if (!id || !userId) {
      throw new Error('ID de transacción o usuario inválido.');
    }
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('El monto debe ser positivo y mayor a 0.');
    }
    const updated = await this.repo.updateTransactionById(id, userId, data);
    if (!updated) {
      throw new Error('No se encontró la transacción o no tienes permisos para editarla.');
    }
    return updated;
  }

  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    if (!id || !userId) {
      throw new Error('ID de transacción o usuario inválido.');
    }
    const success = await this.repo.deleteTransactionById(id, userId);
    if (!success) {
      throw new Error('No se encontró la transacción o no tienes permisos para eliminarla.');
    }
    return true;
  }
}
