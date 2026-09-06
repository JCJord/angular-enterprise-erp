import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const ordersRouter = Router();
const controller = new OrdersController();

ordersRouter.use(authGuard);

ordersRouter.get('/', controller.getAll);
ordersRouter.get('/:id', controller.getById);
ordersRouter.post('/', controller.create);
ordersRouter.patch('/:id/status', controller.updateStatus);
