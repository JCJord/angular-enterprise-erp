import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { envConfig } from '../config/env.config';
import { User } from '../../features/auth/entities/user.entity';
import { WarehousePosition } from '../../features/warehouse/entities/warehouse-position.entity';
import { CargoPreparation } from '../../features/stock-movements/entities/cargo-preparation.entity';
import { CargoMaterial } from '../../features/stock-movements/entities/cargo-material.entity';
import { CargoPallet } from '../../features/stock-movements/entities/cargo-pallet.entity';
import { CargoBox } from '../../features/stock-movements/entities/cargo-box.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.user,
  password: envConfig.db.password,
  database: envConfig.db.database,
  synchronize: true,
  logging: false,
  entities: [User, WarehousePosition, CargoPreparation, CargoMaterial, CargoPallet, CargoBox],
  migrations: [],
  subscribers: []
});
