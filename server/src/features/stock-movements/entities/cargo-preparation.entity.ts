import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CargoMaterial } from './cargo-material.entity';
import { CargoPallet } from './cargo-pallet.entity';
import { CargoBox } from './cargo-box.entity';

@Entity('cargo_preparations')
export class CargoPreparation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo_carga!: string; // Ex: '0020421653'

  @Column({ type: 'varchar', length: 255 })
  cliente_fornecedor!: string; // Ex: 'TESTE PAULO'

  @Column({ type: 'varchar', length: 50 })
  codigo_sap!: string; // Ex: '100113'

  @Column({ type: 'boolean', default: false })
  pagamento_antecipado!: boolean; // Não / Sim

  @Column({ type: 'int', default: 0 })
  numero_volumes!: number; // Ex: 50

  @Column({ type: 'int', default: 0 })
  numero_suportes!: number; // Ex: 84

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  peso_comercial!: number; // Ex: 10414.79

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  peso_bruto!: number; // Ex: 10545.85

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  peso_liquido!: number; // Ex: 10414.79

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @Column({ type: 'varchar', length: 50, default: 'EM_PREPARACAO' })
  status!: 'EM_PREPARACAO' | 'CONCLUIDA' | 'EXPEDIDA' | 'CANCELADA';

  @OneToMany(() => CargoMaterial, (m) => m.cargo, { cascade: true })
  materiais!: CargoMaterial[];

  @OneToMany(() => CargoPallet, (p) => p.cargo, { cascade: true })
  paletes!: CargoPallet[];

  @OneToMany(() => CargoBox, (b) => b.cargo, { cascade: true })
  caixas!: CargoBox[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
