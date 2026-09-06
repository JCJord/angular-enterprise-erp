import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CargoPreparation } from './cargo-preparation.entity';

@Entity('cargo_materials')
export class CargoMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  cargo_id!: number;

  @ManyToOne(() => CargoPreparation, (c) => c.materiais, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cargo_id' })
  cargo!: CargoPreparation;

  @Column({ type: 'varchar', length: 100 })
  material!: string; // Ex: 'ABC1234Q2'

  @Column({ type: 'varchar', length: 20, default: 'Q2' })
  qualidade_qi!: string; // Ex: 'Q2'

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  solicitado_kg!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  comercial_kg!: number; // Ex: 10414.79

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  liquido_kg!: number; // Ex: 10414.79

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  bruto_kg!: number; // Ex: 10545.85

  @Column({ type: 'int', default: 0 })
  volumes!: number; // Ex: 50

  @Column({ type: 'int', default: 0 })
  suportes!: number; // Ex: 84

  @Column({ type: 'text', nullable: true })
  observacao?: string;
}
