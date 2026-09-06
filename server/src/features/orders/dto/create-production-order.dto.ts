export class CreateProductionOrderDto {
  clientName!: string;
  itemId!: number;
  quantity!: number;
  deliveryDate?: string;
}
