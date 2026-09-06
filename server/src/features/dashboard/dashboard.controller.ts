import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  private service = new DashboardService();

  getStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.service.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching stats' });
    }
  };
}
