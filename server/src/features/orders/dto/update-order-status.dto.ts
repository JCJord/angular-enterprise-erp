export class UpdateOrderStatusDto {
  status!: 'PENDING' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'COMPLETED' | 'DELIVERED';
}
