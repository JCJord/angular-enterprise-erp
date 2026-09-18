export enum JewelryCategory {
  RING = 'RING',
  NECKLACE = 'NECKLACE',
  BRACELET = 'BRACELET',
  EARRING = 'EARRING',
  WEDDING_RING = 'WEDDING_RING'
}

export enum MetalType {
  GOLD_18K_YELLOW = 'GOLD_18K_YELLOW',
  GOLD_18K_WHITE = 'GOLD_18K_WHITE',
  SILVER_925 = 'SILVER_925',
  PLATINUM = 'PLATINUM'
}

export const JewelryCategoryLabels: Record<JewelryCategory, string> = {
  [JewelryCategory.RING]: 'Anel',
  [JewelryCategory.NECKLACE]: 'Colar / Corrente',
  [JewelryCategory.BRACELET]: 'Pulseira',
  [JewelryCategory.EARRING]: 'Brinco',
  [JewelryCategory.WEDDING_RING]: 'Aliança'
};

export const MetalTypeLabels: Record<MetalType, { label: string; badgeClass: string }> = {
  [MetalType.GOLD_18K_YELLOW]: {
    label: 'Ouro 18k Amarelo',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
  },
  [MetalType.GOLD_18K_WHITE]: {
    label: 'Ouro 18k Branco',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  },
  [MetalType.SILVER_925]: {
    label: 'Prata 925',
    badgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
  },
  [MetalType.PLATINUM]: {
    label: 'Platina',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800'
  }
};

export interface JewelryItem {
  id: string;
  sku: string;
  name: string;
  category: JewelryCategory;
  metal_type: MetalType;
  weight_grams: number;
  stock_quantity: number;
  min_stock_alert: number;
  gold_quotation_ref: number;
  base_price: number;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface JewelryQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: JewelryCategory | '';
  metal_type?: MetalType | '';
  critical_stock_only?: boolean;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface JewelryListResponse {
  data: JewelryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InventorySummaryStats {
  totalItems: number;
  criticalItems: number;
  totalWeightGrams: number;
  totalStockValue: number;
  dailyGoldQuotation: number;
}
