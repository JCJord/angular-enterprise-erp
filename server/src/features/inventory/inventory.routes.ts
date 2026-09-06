import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const inventoryRouter = Router();
const controller = new InventoryController();

// All inventory endpoints protected by auth guard
inventoryRouter.use(authGuard);

inventoryRouter.get('/', controller.getAll);
inventoryRouter.get('/:id', controller.getById);
inventoryRouter.post('/', controller.create);
inventoryRouter.put('/:id', controller.update);
inventoryRouter.delete('/:id', controller.delete);
