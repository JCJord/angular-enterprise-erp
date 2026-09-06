import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('warehouse_positions')
@Index(['armazem', 'linha', 'box', 'nivel'], { unique: true })
export class WarehousePosition {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, default: 'ALRA' })
  armazem!: string; // Ex: 'ALRA'

  @Column({ type: 'varchar', length: 10 })
  linha!: string; // Ex: '01', '02', '99'

  @Column({ type: 'varchar', length: 10 })
  box!: string; // Ex: '001', '002', '003'

  @Column({ type: 'varchar', length: 10 })
  nivel!: string; // Ex: '00', '01', '02', '06'

  @Column({ type: 'varchar', length: 50, default: 'Livre' })
  situacao!: 'Ocupada' | 'Reservada' | 'Livre' | 'Bloqueada' | 'Em Carga';

  @Column({ type: 'int', default: 0 })
  quantidade_caixas!: number; // Ex: 24, 20, 150

  @Column({ type: 'varchar', length: 50, default: 'Palletizado' })
  tipo_embalagem!: 'Rolete' | 'Container' | 'Palletizado' | 'Cabo' | 'Beam' | 'Caixa';

  @Column({ type: 'varchar', length: 50, default: '1' })
  sequencia!: string; // Ex: '4', '1522', '999999'

  @Column({ type: 'boolean', default: false })
  quebrado!: boolean; // Sim / Não

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 850.00 })
  peso_maximo_kg!: number; // Ex: 543, 850, 1254

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0.00 })
  peso_atual_kg!: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
