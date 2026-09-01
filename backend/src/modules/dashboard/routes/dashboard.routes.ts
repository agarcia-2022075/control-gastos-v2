import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticateJwt } from '../../../middlewares/auth.middleware.js';

const router = Router();
const controller = new DashboardController();

// Accessible by ANY authenticated user (both USER and ADMIN)
router.get('/stats', authenticateJwt, (req, res) => controller.getStats(req, res));

export default router;
