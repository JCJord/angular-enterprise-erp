import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargoPreparation } from './entities/cargo-preparation.entity';
import { CargoMaterial } from './entities/cargo-material.entity';
import { CargoPallet } from './entities/cargo-pallet.entity';
import { CargoBox } from './entities/cargo-box.entity';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CargoPreparation,
      CargoMaterial,
      CargoPallet,
      CargoBox
    ])
  ],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService]
})
export class StockMovementsModule {}
