import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const dashboardRouter = Router();
const controller = new DashboardController();

dashboardRouter.use(authGuard);

dashboardRouter.get('/stats', controller.getStats);
dashboardRouter.get('/gold-price', controller.getGoldPrice);
