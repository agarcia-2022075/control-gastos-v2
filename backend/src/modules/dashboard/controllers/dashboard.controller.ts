import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  private service = new DashboardService();

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado.'
        });
        return;
      }

      const stats = await this.service.getDashboardStats(userId);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error en DashboardController.getStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas del dashboard.'
      });
    }
  }

  async createIncome(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado.'
        });
        return;
      }

      const { title, merchant, category, amount, date } = req.body;
      const income = await this.service.createIncome(userId, {
        title,
        merchant,
        category,
        amount: parseFloat(amount),
        date
      });

      res.status(201).json({
        success: true,
        message: 'Ingreso registrado exitosamente.',
        data: income
      });
    } catch (error: any) {
      console.error('Error en DashboardController.createIncome:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al registrar el ingreso.'
      });
    }
  }

  async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const idStr = String(req.params['id'] || req.params.id);
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado.'
        });
        return;
      }

      const { title, merchant, category, amount, date } = req.body;
      const updated = await this.service.updateTransaction(userId, parseInt(idStr, 10), {
        title,
        merchant,
        category,
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        date
      });

      res.status(200).json({
        success: true,
        message: 'Transacción actualizada exitosamente.',
        data: updated
      });
    } catch (error: any) {
      console.error('Error en DashboardController.updateTransaction:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al actualizar la transacción.'
      });
    }
  }

  async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const idStr = String(req.params['id'] || req.params.id);
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado.'
        });
        return;
      }

      await this.service.deleteTransaction(parseInt(idStr, 10), userId);
      res.status(200).json({
        success: true,
        message: 'Transacción eliminada exitosamente.'
      });
    } catch (error: any) {
      console.error('Error en DashboardController.deleteTransaction:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al eliminar la transacción.'
      });
    }
  }
}
