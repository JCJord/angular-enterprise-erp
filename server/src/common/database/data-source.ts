import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envConfig } from '../config/env.config';
import { User } from '../../features/auth/entities/user.entity';
import { JewelryItem } from '../../features/inventory/entities/jewelry-item.entity';
import { ProductionOrder } from '../../features/orders/entities/production-order.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.user,
  password: envConfig.db.password,
  database: envConfig.db.database,
  synchronize: true, // Auto-creates or updates tables in PostgreSQL based on entity models
  logging: envConfig.nodeEnv === 'development',
  entities: [User, JewelryItem, ProductionOrder],
  migrations: [],
  subscribers: []
});
