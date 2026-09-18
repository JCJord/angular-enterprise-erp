import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

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

@Entity('jewelry_items')
export class JewelryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sku!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: JewelryCategory })
  category!: JewelryCategory;

  @Column({ type: 'enum', enum: MetalType, default: MetalType.GOLD_18K_YELLOW })
  metal_type!: MetalType;


  @Column({ type: 'numeric', precision: 10, scale: 3 })
  weight_grams!: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity!: number;

  @Column({ type: 'int', default: 2 })
  min_stock_alert!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  gold_quotation_ref!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  base_price!: number;

  @Column({ type: 'text', nullable: true })
  photo_url?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
