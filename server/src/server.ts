import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from './common/config/env.config';
import { AppDataSource } from './common/database/data-source';
import { seedDatabase } from './common/database/seed';

import { authRouter } from './features/auth/auth.routes';
import { inventoryRouter } from './features/inventory/inventory.routes';
import { ordersRouter } from './features/orders/orders.routes';
import { dashboardRouter } from './features/dashboard/dashboard.routes';

const app = express();

app.use(cors({ origin: envConfig.corsOrigin, credentials: true }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Enterprise ERP Backend API',
    databaseConnected: AppDataSource.isInitialized,
    environment: envConfig.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Feature Routes
app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);

// Start Server & Bootstrap Database
async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log(`[TypeORM] Connected to PostgreSQL: ${envConfig.db.database}`);
    
    // Seed initial data if database is fresh
    await seedDatabase();
  } catch (error: any) {
    console.error(`[TypeORM] Database connection error: ${error.message}`);
  }

  app.listen(envConfig.port, () => {
    console.log(`ERP Backend API running on http://localhost:${envConfig.port}`);
    console.log(`Allowed CORS origin: ${envConfig.corsOrigin}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server startup error:', err);
});
