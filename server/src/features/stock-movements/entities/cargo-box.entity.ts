import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CargoPreparation } from './cargo-preparation.entity';

@Entity('cargo_boxes')
export class CargoBox {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  cargo_id!: number;

  @ManyToOne(() => CargoPreparation, (c) => c.caixas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cargo_id' })
  cargo!: CargoPreparation;

  @Column({ type: 'varchar', length: 50 })
  caixa!: string; // Ex: '5500000030'

  @Column({ type: 'int', default: 1 })
  suportes!: number; // Ex: 1

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  comercial_kg!: number; // Ex: 9.00

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  liquido_kg!: number; // Ex: 9.00

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  bruto_kg!: number; // Ex: 10.00
}
