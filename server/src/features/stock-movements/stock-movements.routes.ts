import { Router } from 'express';
import { StockMovementsController } from './stock-movements.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const stockMovementsRouter = Router();
const controller = new StockMovementsController();

stockMovementsRouter.use(authGuard);

stockMovementsRouter.get('/', controller.getAll);
stockMovementsRouter.get('/cargo/:codigoCarga', controller.getByCode);
stockMovementsRouter.post('/cargo', controller.create);
stockMovementsRouter.patch('/cargo/:id/status', controller.updateStatus);
