import { AppDataSource } from '../../common/database/data-source';
import { ProductionOrder } from '../orders/entities/production-order.entity';
import { JewelryItem } from '../inventory/entities/jewelry-item.entity';

export class DashboardService {
  private orderRepo = AppDataSource.getRepository(ProductionOrder);
  private itemRepo = AppDataSource.getRepository(JewelryItem);

  // Dynamic baseline spot price ($2,450.00 / oz)
  private currentGoldSpotPrice = 2450.00;

  getGoldSpotPrice() {
    // Small realistic market fluctuation (+/- 0.25%)
    const variance = (Math.random() - 0.5) * 4.5;
    const priceOz = parseFloat((this.currentGoldSpotPrice + variance).toFixed(2));
    const priceGram = parseFloat((priceOz / 31.1035).toFixed(2));

    return {
      pricePerTroyOunceUsd: priceOz,
      pricePerGram24kUsd: priceGram,
      pricePerGram18kUsd: parseFloat((priceGram * 0.75).toFixed(2)),
      pricePerGram14kUsd: parseFloat((priceGram * 0.5833).toFixed(2)),
      currency: 'USD',
      updatedAt: new Date().toISOString()
    };
  }

  async getStats() {
    const orders = await this.orderRepo.find({
      relations: ['item'],
      order: { created_at: 'DESC' }
    });

    const items = await this.itemRepo.find();

    const totalOrders = orders.length;
    const activeProductionOrders = orders.filter(
      (o) => o.status === 'PENDING' || o.status === 'IN_PRODUCTION' || o.status === 'QUALITY_CHECK'
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status === 'COMPLETED' || o.status === 'DELIVERED'
    ).length;

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    const lowStockItems = items.filter((i) => i.stock_quantity < 5);

    const goldData = this.getGoldSpotPrice();

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      activeProductionOrders,
      completedOrders,
      inventoryItemCount: items.length,
      lowStockCount: lowStockItems.length,
      goldSpotPriceUsd: goldData.pricePerTroyOunceUsd,
      goldSpotPriceGramUsd: goldData.pricePerGram24kUsd,
      recentOrders: orders.slice(0, 5),
      lowStockItems: lowStockItems.slice(0, 5)
    };
  }
}
