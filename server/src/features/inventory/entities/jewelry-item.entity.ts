import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('jewelry_items')
export class JewelryItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string; // 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Custom'

  @Column({ type: 'varchar', length: 50 })
  material!: string; // 'Gold', 'White Gold', 'Rose Gold', 'Platinum', 'Silver'

  @Column({ type: 'int', default: 18 })
  gold_karat!: number; // 10, 14, 18, 24

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  weight_grams!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  diamond_karats!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  labor_cost_usd!: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity!: number;

  @Column({ type: 'text', nullable: true })
  image_url?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
