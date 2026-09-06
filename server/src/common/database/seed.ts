import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { User } from '../../features/auth/entities/user.entity';
import { WarehousePosition } from '../../features/warehouse/entities/warehouse-position.entity';
import { CargoPreparation } from '../../features/stock-movements/entities/cargo-preparation.entity';
import { CargoMaterial } from '../../features/stock-movements/entities/cargo-material.entity';
import { CargoPallet } from '../../features/stock-movements/entities/cargo-pallet.entity';
import { CargoBox } from '../../features/stock-movements/entities/cargo-box.entity';

export async function seedDatabase(): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const posRepo = AppDataSource.getRepository(WarehousePosition);
  const cargoRepo = AppDataSource.getRepository(CargoPreparation);
  const matRepo = AppDataSource.getRepository(CargoMaterial);
  const palRepo = AppDataSource.getRepository(CargoPallet);
  const boxRepo = AppDataSource.getRepository(CargoBox);

  // 1. Seed User
  const existingUser = await userRepo.findOne({ where: { email: 'admin@enterprise.com' } });
  if (!existingUser) {
    const password_hash = await bcrypt.hash('admin123', 10);
    const adminUser = userRepo.create({
      email: 'admin@enterprise.com',
      password_hash,
      full_name: 'Júlio César Jordão',
      role: 'ADMIN'
    });
    await userRepo.save(adminUser);
    console.log('[Seed] Admin user created: admin@enterprise.com / admin123');
  }

  // 2. Seed Warehouse Positions
  const posCount = await posRepo.count();
  if (posCount === 0) {
    const positionsData: Partial<WarehousePosition>[] = [
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '00', situacao: 'Ocupada', quantidade_caixas: 24, tipo_embalagem: 'Rolete', sequencia: '4', quebrado: true, peso_maximo_kg: 543, peso_atual_kg: 480 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '01', situacao: 'Reservada', quantidade_caixas: 20, tipo_embalagem: 'Rolete', sequencia: '1522', quebrado: true, peso_maximo_kg: 850, peso_atual_kg: 720 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '02', situacao: 'Livre', quantidade_caixas: 150, tipo_embalagem: 'Container', sequencia: '124', quebrado: false, peso_maximo_kg: 500, peso_atual_kg: 0 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '03', situacao: 'Bloqueada', quantidade_caixas: 150, tipo_embalagem: 'Container', sequencia: '124', quebrado: false, peso_maximo_kg: 500, peso_atual_kg: 0 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '04', situacao: 'Ocupada', quantidade_caixas: 16, tipo_embalagem: 'Container', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 810 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '05', situacao: 'Em Carga', quantidade_caixas: 16, tipo_embalagem: 'Palletizado', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 790 },
      { armazem: 'ALRA', linha: '01', box: '001', nivel: '06', situacao: 'Reservada', quantidade_caixas: 16, tipo_embalagem: 'Cabo', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 600 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '00', situacao: 'Reservada', quantidade_caixas: 4, tipo_embalagem: 'Rolete', sequencia: '4', quebrado: true, peso_maximo_kg: 200, peso_atual_kg: 180 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '01', situacao: 'Ocupada', quantidade_caixas: 6, tipo_embalagem: 'Beam', sequencia: '1522', quebrado: false, peso_maximo_kg: 850, peso_atual_kg: 820 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '02', situacao: 'Ocupada', quantidade_caixas: 12, tipo_embalagem: 'Rolete', sequencia: '999999', quebrado: false, peso_maximo_kg: 543, peso_atual_kg: 510 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '03', situacao: 'Ocupada', quantidade_caixas: 16, tipo_embalagem: 'Caixa', sequencia: '1111', quebrado: false, peso_maximo_kg: 1254, peso_atual_kg: 1100 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '04', situacao: 'Ocupada', quantidade_caixas: 16, tipo_embalagem: 'Container', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 840 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '05', situacao: 'Ocupada', quantidade_caixas: 16, tipo_embalagem: 'Palletizado', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 830 },
      { armazem: 'ALRA', linha: '01', box: '002', nivel: '06', situacao: 'Ocupada', quantidade_caixas: 16, tipo_embalagem: 'Cabo', sequencia: '999999', quebrado: false, peso_maximo_kg: 851, peso_atual_kg: 800 },
      { armazem: 'ALRA', linha: '01', box: '003', nivel: '00', situacao: 'Bloqueada', quantidade_caixas: 25, tipo_embalagem: 'Rolete', sequencia: '4', quebrado: true, peso_maximo_kg: 543, peso_atual_kg: 0 },
      { armazem: 'ALRA', linha: '02', box: '001', nivel: '00', situacao: 'Livre', quantidade_caixas: 0, tipo_embalagem: 'Palletizado', sequencia: '1', quebrado: false, peso_maximo_kg: 850, peso_atual_kg: 0 },
      { armazem: 'ALRA', linha: '02', box: '001', nivel: '01', situacao: 'Ocupada', quantidade_caixas: 10, tipo_embalagem: 'Container', sequencia: '2', quebrado: false, peso_maximo_kg: 850, peso_atual_kg: 750 },
      { armazem: 'ALRA', linha: '02', box: '002', nivel: '00', situacao: 'Ocupada', quantidade_caixas: 18, tipo_embalagem: 'Palletizado', sequencia: '3', quebrado: false, peso_maximo_kg: 900, peso_atual_kg: 880 }
    ];

    await posRepo.save(positionsData);
    console.log(`[Seed] Created ${positionsData.length} warehouse positions for ALRA.`);
  }

  // 3. Seed Cargo Preparation

  const cargoCount = await cargoRepo.count();
  if (cargoCount === 0) {
    const cargo = cargoRepo.create({
      codigo_carga: '0020421653',
      cliente_fornecedor: 'TESTE PAULO',
      codigo_sap: '100113',
      pagamento_antecipado: false,
      numero_volumes: 50,
      numero_suportes: 84,
      peso_comercial: 10414.79,
      peso_bruto: 10545.85,
      peso_liquido: 10414.79,
      observacao: 'Carga padrão para preparação manual de picking',
      status: 'EM_PREPARACAO'
    });

    const savedCargo = await cargoRepo.save(cargo);

    // Material
    const material = matRepo.create({
      cargo_id: savedCargo.id,
      material: 'ABC1234Q2',
      qualidade_qi: 'Q2',
      solicitado_kg: 0.00,
      comercial_kg: 10414.79,
      liquido_kg: 10414.79,
      bruto_kg: 10545.85,
      volumes: 50,
      suportes: 84,
      observacao: 'Lote aprovado em inspeção'
    });
    await matRepo.save(material);

    // Pallets
    const pallets = [
      { cargo_id: savedCargo.id, palete: '0021417535', armazem_local: 'TESTE-35-032-22', comercial_kg: 7.00, liquido_kg: 7.00, bruto_kg: 8.16, volumes: 1, suportes: 1 },
      { cargo_id: savedCargo.id, palete: '0021417566', armazem_local: 'TESTE-25-030-31', comercial_kg: 15.38, liquido_kg: 15.38, bruto_kg: 23.00, volumes: 2, suportes: 4 },
      { cargo_id: savedCargo.id, palete: '0021417572', armazem_local: 'TESTE-25-030-28', comercial_kg: 7.84, liquido_kg: 7.84, bruto_kg: 9.00, volumes: 1, suportes: 1 },
      { cargo_id: savedCargo.id, palete: '0021417573', armazem_local: 'TESTE-25-030-29', comercial_kg: 7.84, liquido_kg: 7.84, bruto_kg: 9.00, volumes: 1, suportes: 1 },
      { cargo_id: savedCargo.id, palete: '0021417575', armazem_local: 'TESTE-25-030-41', comercial_kg: 18.38, liquido_kg: 18.38, bruto_kg: 25.00, volumes: 2, suportes: 4 },
      { cargo_id: savedCargo.id, palete: '0021417576', armazem_local: 'TESTE-25-030-32', comercial_kg: 7.84, liquido_kg: 7.84, bruto_kg: 9.00, volumes: 1, suportes: 1 },
      { cargo_id: savedCargo.id, palete: '0021417577', armazem_local: 'TESTE-25-030-33', comercial_kg: 7.54, liquido_kg: 7.54, bruto_kg: 8.70, volumes: 1, suportes: 1 }
    ];
    await palRepo.save(pallets.map((p) => palRepo.create(p)));

    // Box
    const box = boxRepo.create({
      cargo_id: savedCargo.id,
      caixa: '5500000030',
      suportes: 1,
      comercial_kg: 9.00,
      liquido_kg: 9.00,
      bruto_kg: 10.00
    });
    await boxRepo.save(box);

    console.log('[Seed] Created Cargo Preparation #0020421653 with materials, pallets, and boxes.');
  }
}
