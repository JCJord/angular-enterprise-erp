import { AppDataSource } from '../../common/database/data-source';
import { WarehousePosition } from '../warehouse/entities/warehouse-position.entity';
import { CargoPreparation } from '../stock-movements/entities/cargo-preparation.entity';

export class DashboardService {
  private posRepo = AppDataSource.getRepository(WarehousePosition);
  private cargoRepo = AppDataSource.getRepository(CargoPreparation);

  async getStats() {
    const positions = await this.posRepo.find();
    const cargos = await this.cargoRepo.find({
      relations: {
        materiais: true,
        paletes: true,
        caixas: true
      },
      order: { created_at: 'DESC' }
    });

    const totalPositions = positions.length;
    const occupiedPositions = positions.filter((p) => p.situacao === 'Ocupada').length;
    const reservedPositions = positions.filter((p) => p.situacao === 'Reservada').length;
    const freePositions = positions.filter((p) => p.situacao === 'Livre').length;
    const blockedPositions = positions.filter((p) => p.situacao === 'Bloqueada').length;

    const occupancyRate = totalPositions > 0
      ? parseFloat(((occupiedPositions / totalPositions) * 100).toFixed(1))
      : 0;

    const totalCargos = cargos.length;
    const pendingCargos = cargos.filter((c) => c.status === 'EM_PREPARACAO').length;
    const completedCargos = cargos.filter((c) => c.status === 'CONCLUIDA' || c.status === 'EXPEDIDA').length;

    const totalWeightHandledKg = cargos.reduce((sum, c) => sum + Number(c.peso_bruto || 0), 0);

    return {
      warehouse: {
        totalPositions,
        occupiedPositions,
        reservedPositions,
        freePositions,
        blockedPositions,
        occupancyRate
      },
      cargos: {
        totalCargos,
        pendingCargos,
        completedCargos,
        totalWeightHandledKg: parseFloat(totalWeightHandledKg.toFixed(2))
      },
      recentCargos: cargos.slice(0, 5)
    };
  }
}
