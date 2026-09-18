import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { JewelryOrder } from '../../orders/entities/jewelry-order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  document!: string; // CPF ou CNPJ

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  credit_limit!: number;

  @OneToMany(() => JewelryOrder, (order) => order.customer)
  orders?: JewelryOrder[];

  @CreateDateColumn()
  created_at!: Date;
}
