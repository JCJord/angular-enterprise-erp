import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { JewelryItem, MetalType } from '../../inventory/entities/jewelry-item.entity';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  CASTING = 'CASTING',
  BENCH = 'BENCH',
  SETTING = 'SETTING',
  POLISHING = 'POLISHING',
  READY = 'READY'
}

@Entity('jewelry_orders')
export class JewelryOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number!: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @ManyToOne(() => JewelryItem, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jewelry_item_id' })
  jewelry_item?: JewelryItem;

  @Column({ type: 'enum', enum: MetalType })
  metal_type!: MetalType;

  @Column({ type: 'numeric', precision: 10, scale: 3 })
  weight_grams!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  daily_metal_quotation!: number;

  @Column({ type: 'int', default: 0 })
  stones_count!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  stone_unit_price!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  artisan_labor_fee!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  finishing_fee!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_price!: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.DRAFT })
  status!: OrderStatus;

  @Column({ type: 'date', nullable: true })
  deadline?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
