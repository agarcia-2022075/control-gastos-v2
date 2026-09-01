import { pool } from '../../../config/database.js';

export interface TransactionRow {
  id: number;
  user_id: number;
  type: 'EXPENSE' | 'INCOME';
  title: string;
  merchant: string | null;
  category: string;
  amount: string;
  status: 'COMPLETED' | 'PENDING';
  date: string;
  created_at: string;
}

export interface SavingsGoalRow {
  id: number;
  user_id: number;
  target_amount: string;
  current_amount: string;
}

export interface PaymentAlertRow {
  id: number;
  user_id: number;
  title: string;
  description: string;
  alert_type: string;
  is_active: boolean;
}

export class DashboardRepository {
  async ensureUserData(userId: number): Promise<void> {
    // Only ensure a savings_goal record exists for the user if none exists
    const goalCheck = await pool.query('SELECT COUNT(*) FROM savings_goals WHERE user_id = $1', [userId]);
    if (parseInt(goalCheck.rows[0].count, 10) === 0) {
      await pool.query(
        `INSERT INTO savings_goals (user_id, target_amount, current_amount) VALUES ($1, 10000.00, 0.00)`,
        [userId]
      );
    }
  }

  async getTransactionsByUserId(userId: number): Promise<TransactionRow[]> {
    const query = `
      SELECT id, user_id, type, title, merchant, category, amount, status,
             TO_CHAR(date, 'YYYY-MM-DD') as date, created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async getSavingsGoalByUserId(userId: number): Promise<SavingsGoalRow | null> {
    const query = `
      SELECT id, user_id, target_amount, current_amount
      FROM savings_goals
      WHERE user_id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  async getActiveAlertsByUserId(userId: number): Promise<PaymentAlertRow[]> {
    const query = `
      SELECT id, user_id, title, description, alert_type, is_active
      FROM payment_alerts
      WHERE user_id = $1 AND is_active = TRUE
      ORDER BY id ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}
