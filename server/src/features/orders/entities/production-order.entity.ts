import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JewelryItem } from '../../inventory/entities/jewelry-item.entity';

@Entity('production_orders')
export class ProductionOrder {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number!: string;

  @Column({ type: 'varchar', length: 255 })
  client_name!: string;

  @Column({ type: 'int', nullable: true })
  item_id?: number;

  @ManyToOne(() => JewelryItem, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'item_id' })
  item?: JewelryItem;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  gold_spot_price_at_order!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  calculated_unit_price!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_price!: number;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: string; // 'PENDING' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'COMPLETED' | 'DELIVERED'

  @Column({ type: 'date', nullable: true })
  delivery_date?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
