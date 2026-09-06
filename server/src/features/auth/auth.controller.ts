import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticatedRequest } from '../../common/middlewares/auth.guard';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: LoginRequestDto = req.body;
      if (!dto.email || !dto.password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(dto);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Authentication failed' });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: RegisterUserDto = req.body;
      if (!dto.email || !dto.password || !dto.fullName) {
        res.status(400).json({ message: 'Email, password, and fullName are required' });
        return;
      }

      const result = await this.authService.register(dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  };

  me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const profile = await this.authService.getProfile(req.user.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'User not found' });
    }
  };
}
