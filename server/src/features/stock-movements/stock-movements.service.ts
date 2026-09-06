import { AppDataSource } from '../../common/database/data-source';
import { CargoPreparation } from './entities/cargo-preparation.entity';
import { CargoMaterial } from './entities/cargo-material.entity';
import { CargoPallet } from './entities/cargo-pallet.entity';
import { CargoBox } from './entities/cargo-box.entity';
import { CreateCargoDto } from './dto/create-cargo.dto';

export class StockMovementsService {
  private cargoRepo = AppDataSource.getRepository(CargoPreparation);
  private matRepo = AppDataSource.getRepository(CargoMaterial);
  private palRepo = AppDataSource.getRepository(CargoPallet);
  private boxRepo = AppDataSource.getRepository(CargoBox);

  async findAll(query?: { search?: string; status?: string }) {
    const qb = this.cargoRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.materiais', 'm')
      .leftJoinAndSelect('c.paletes', 'p')
      .leftJoinAndSelect('c.caixas', 'b')
      .orderBy('c.created_at', 'DESC');

    if (query?.search) {
      const term = `%${query.search.trim()}%`;
      qb.where('(c.codigo_carga ILIKE :term OR c.cliente_fornecedor ILIKE :term OR c.codigo_sap ILIKE :term)', { term });
    }

    if (query?.status && query.status !== 'ALL') {
      qb.andWhere('c.status = :status', { status: query.status });
    }

    return await qb.getMany();
  }

  async findByCode(codigoCarga: string) {
    const cargo = await this.cargoRepo.findOne({
      where: { codigo_carga: codigoCarga },
      relations: {
        materiais: true,
        paletes: true,
        caixas: true
      }
    });

    if (!cargo) {
      throw new Error(`Cargo preparation #${codigoCarga} not found`);
    }

    return cargo;
  }

  async findById(id: number) {
    const cargo = await this.cargoRepo.findOne({
      where: { id },
      relations: {
        materiais: true,
        paletes: true,
        caixas: true
      }
    });

    if (!cargo) {
      throw new Error(`Cargo preparation #${id} not found`);
    }

    return cargo;
  }

  async create(dto: CreateCargoDto) {
    const existing = await this.cargoRepo.findOne({ where: { codigo_carga: dto.codigoCarga.trim() } });
    if (existing) {
      throw new Error(`Cargo #${dto.codigoCarga} already exists`);
    }

    const cargo = this.cargoRepo.create({
      codigo_carga: dto.codigoCarga.trim(),
      cliente_fornecedor: dto.clienteFornecedor.trim(),
      codigo_sap: dto.codigoSap.trim(),
      pagamento_antecipado: dto.pagamentoAntecipado || false,
      numero_volumes: dto.numeroVolumes || 0,
      numero_suportes: dto.numeroSuportes || 0,
      peso_comercial: dto.pesoComercial || 0,
      peso_bruto: dto.pesoBruto || 0,
      peso_liquido: dto.pesoLiquido || 0,
      observacao: dto.observacao || undefined,
      status: 'EM_PREPARACAO'
    });

    const savedCargo = await this.cargoRepo.save(cargo);

    if (dto.materiais && dto.materiais.length > 0) {
      const mats = dto.materiais.map((m) =>
        this.matRepo.create({
          cargo_id: savedCargo.id,
          material: m.material,
          qualidade_qi: m.qualidadeQi,
          solicitado_kg: m.solicitadoKg,
          comercial_kg: m.comercialKg,
          liquido_kg: m.liquidoKg,
          bruto_kg: m.brutoKg,
          volumes: m.volumes,
          suportes: m.suportes,
          observacao: m.observacao
        })
      );
      await this.matRepo.save(mats);
    }

    if (dto.paletes && dto.paletes.length > 0) {
      const pals = dto.paletes.map((p) =>
        this.palRepo.create({
          cargo_id: savedCargo.id,
          palete: p.palete,
          armazem_local: p.armazemLocal,
          comercial_kg: p.comercialKg,
          liquido_kg: p.liquidoKg,
          bruto_kg: p.brutoKg,
          volumes: p.volumes,
          suportes: p.suportes
        })
      );
      await this.palRepo.save(pals);
    }

    if (dto.caixas && dto.caixas.length > 0) {
      const boxes = dto.caixas.map((b) =>
        this.boxRepo.create({
          cargo_id: savedCargo.id,
          caixa: b.caixa,
          suportes: b.suportes,
          comercial_kg: b.comercialKg,
          liquido_kg: b.liquidoKg,
          bruto_kg: b.brutoKg
        })
      );
      await this.boxRepo.save(boxes);
    }

    return await this.findById(savedCargo.id);
  }

  async updateStatus(id: number, status: 'EM_PREPARACAO' | 'CONCLUIDA' | 'EXPEDIDA' | 'CANCELADA') {
    const cargo = await this.findById(id);
    cargo.status = status;
    return await this.cargoRepo.save(cargo);
  }
}
