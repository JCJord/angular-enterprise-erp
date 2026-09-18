import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './common/database/typeorm.config';
import { AuthModule } from './features/auth/auth.module';
import { InventoryModule } from './features/inventory/inventory.module';
import { WarehouseModule } from './features/warehouse/warehouse.module';
import { StockMovementsModule } from './features/stock-movements/stock-movements.module';
import { CustomersModule } from './features/customers/customers.module';
import { OrdersModule } from './features/orders/orders.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    InventoryModule,
    WarehouseModule,
    StockMovementsModule,
    CustomersModule,
    OrdersModule,
    DashboardModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
