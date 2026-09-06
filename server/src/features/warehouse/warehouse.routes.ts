import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const warehouseRouter = Router();
const controller = new WarehouseController();

warehouseRouter.use(authGuard);

warehouseRouter.get('/positions', controller.getPositions);
warehouseRouter.get('/positions/:id', controller.getById);
warehouseRouter.post('/positions', controller.create);
warehouseRouter.put('/positions/:id', controller.update);
warehouseRouter.delete('/positions/:id', controller.delete);
warehouseRouter.get('/heatmap', controller.getHeatmap);
