import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { Type } from 'class-transformer';
import { JewelryCategory, MetalType } from '../entities/jewelry-item.entity';

export class CreateJewelryItemDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(JewelryCategory)
  category!: JewelryCategory;

  @IsEnum(MetalType)
  metal_type!: MetalType;

  @IsNumber()
  @Type(() => Number)
  weight_grams!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock_quantity?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  min_stock_alert?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gold_quotation_ref?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  base_price?: number;

  @IsString()
  @IsOptional()
  photo_url?: string;
}

export class UpdateJewelryItemDto {
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(JewelryCategory)
  @IsOptional()
  category?: JewelryCategory;

  @IsEnum(MetalType)
  @IsOptional()
  metal_type?: MetalType;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight_grams?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  stock_quantity?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  min_stock_alert?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gold_quotation_ref?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  base_price?: number;

  @IsString()
  @IsOptional()
  photo_url?: string;
}

export class JewelryQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(JewelryCategory)
  category?: JewelryCategory;

  @IsOptional()
  @IsEnum(MetalType)
  metal_type?: MetalType;

  @IsOptional()
  critical_stock_only?: any;

  @IsOptional()
  @IsString()
  sort_by?: string;

  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC';
}
