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
}
