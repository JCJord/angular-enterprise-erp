export class DashboardStatsDto {
  totalRevenue!: number;
  totalOrders!: number;
  activeProductionOrders!: number;
  completedOrders!: number;
  inventoryItemCount!: number;
  lowStockCount!: number;
  goldSpotPriceUsd!: number;
  goldSpotPriceGramUsd!: number;
  recentOrders!: any[];
  lowStockItems!: any[];
}
