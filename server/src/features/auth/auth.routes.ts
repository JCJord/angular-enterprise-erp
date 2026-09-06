import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authGuard } from '../../common/middlewares/auth.guard';

export const authRouter = Router();
const controller = new AuthController();

authRouter.post('/login', controller.login);
authRouter.post('/register', controller.register);
authRouter.get('/me', authGuard, controller.me);
