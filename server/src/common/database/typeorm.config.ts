import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { envConfig } from '../config/env.config';
import { User } from '../../features/auth/entities/user.entity';
import { JewelryItem } from '../../features/inventory/entities/jewelry-item.entity';
import { Customer } from '../../features/customers/entities/customer.entity';
import { JewelryOrder } from '../../features/orders/entities/jewelry-order.entity';
import { WarehousePosition } from '../../features/warehouse/entities/warehouse-position.entity';
import { CargoPreparation } from '../../features/stock-movements/entities/cargo-preparation.entity';
import { CargoMaterial } from '../../features/stock-movements/entities/cargo-material.entity';
import { CargoPallet } from '../../features/stock-movements/entities/cargo-pallet.entity';
import { CargoBox } from '../../features/stock-movements/entities/cargo-box.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.db.host,
  port: envConfig.db.port,
  username: envConfig.db.user,
  password: envConfig.db.password,
  database: envConfig.db.database,
  url: envConfig.db.connectionString,
  synchronize: false,
  logging: false,
  entities: [
    User,
    JewelryItem,
    Customer,
    JewelryOrder,
    WarehousePosition,
    CargoPreparation,
    CargoMaterial,
    CargoPallet,
    CargoBox
  ],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')]
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
