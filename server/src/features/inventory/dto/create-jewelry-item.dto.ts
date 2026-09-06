export class CreateJewelryItemDto {
  sku!: string;
  name!: string;
  category!: string;
  material!: string;
  goldKarat?: number;
  weightGrams!: number;
  diamondKarats?: number;
  laborCostUsd!: number;
  stockQuantity!: number;
  imageUrl?: string;
}
