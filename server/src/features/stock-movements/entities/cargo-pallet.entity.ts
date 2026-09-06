import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CargoPreparation } from './cargo-preparation.entity';

@Entity('cargo_pallets')
export class CargoPallet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  cargo_id!: number;

  @ManyToOne(() => CargoPreparation, (c) => c.paletes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cargo_id' })
  cargo!: CargoPreparation;

  @Column({ type: 'varchar', length: 50 })
  palete!: string; // Ex: '0021417535'

  @Column({ type: 'varchar', length: 100 })
  armazem_local!: string; // Ex: 'TESTE-35-032-22', 'TESTE-25-030-31'

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  comercial_kg!: number; // Ex: 7.00, 15.38

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  liquido_kg!: number; // Ex: 7.00, 15.38

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  bruto_kg!: number; // Ex: 8.16, 23.00

  @Column({ type: 'int', default: 1 })
  volumes!: number; // Ex: 1, 2

  @Column({ type: 'int', default: 1 })
  suportes!: number; // Ex: 1, 4
}
