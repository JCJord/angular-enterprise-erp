import { JewelryCategory, MetalType } from '../entities/jewelry-item.entity';

export class CreateJewelryItemDto {
  sku!: string;
  name!: string;
  category!: JewelryCategory;
  metal_type!: MetalType;
  weight_grams!: number;
  stock_quantity!: number;
  min_stock_alert!: number;
  gold_quotation_ref!: number;
  base_price!: number;
  photo_url?: string;
}

export class UpdateJewelryItemDto {
  sku?: string;
  name?: string;
  category?: JewelryCategory;
  metal_type?: MetalType;
  weight_grams?: number;
  stock_quantity?: number;
  min_stock_alert?: number;
  gold_quotation_ref?: number;
  base_price?: number;
  photo_url?: string;
}

export class JewelryQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  category?: JewelryCategory;
  metal_type?: MetalType;
  critical_stock_only?: boolean;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}
