import { AppDataSource } from '../../common/database/data-source';
import { WarehousePosition } from './entities/warehouse-position.entity';
import { WarehouseQueryDto } from './dto/warehouse-query.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

export class WarehouseService {
  private repo = AppDataSource.getRepository(WarehousePosition);

  async findPositions(query: WarehouseQueryDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 15, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('p');

    if (query.armazem && query.armazem.trim() !== '') {
      qb.andWhere('p.armazem = :armazem', { armazem: query.armazem.trim() });
    }

    if (query.linhaInicial && query.linhaFinal) {
      qb.andWhere('p.linha >= :linhaIni AND p.linha <= :linhaFim', {
        linhaIni: query.linhaInicial.padStart(2, '0'),
        linhaFim: query.linhaFinal.padStart(2, '0')
      });
    }

    if (query.boxInicial && query.boxFinal) {
      qb.andWhere('p.box >= :boxIni AND p.box <= :boxFim', {
        boxIni: query.boxInicial.padStart(3, '0'),
        boxFim: query.boxFinal.padStart(3, '0')
      });
    }

    if (query.nivelInicial && query.nivelFinal) {
      qb.andWhere('p.nivel >= :nivelIni AND p.nivel <= :nivelFim', {
        nivelIni: query.nivelInicial.padStart(2, '0'),
        nivelFim: query.nivelFinal.padStart(2, '0')
      });
    }

    if (query.situacao && query.situacao !== '(Todos)' && query.situacao.trim() !== '') {
      qb.andWhere('p.situacao = :situacao', { situacao: query.situacao.trim() });
    }

    if (query.tipoEmbalagem && query.tipoEmbalagem.trim() !== '') {
      qb.andWhere('p.tipo_embalagem = :tipoEmbalagem', { tipoEmbalagem: query.tipoEmbalagem.trim() });
    }

    if (query.quebrado !== undefined) {
      qb.andWhere('p.quebrado = :quebrado', { quebrado: query.quebrado });
    }

    if (query.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      qb.andWhere('(p.linha ILIKE :term OR p.box ILIKE :term OR p.nivel ILIKE :term OR p.situacao ILIKE :term OR p.tipo_embalagem ILIKE :term)', { term });
    }

    qb.orderBy('p.linha', 'ASC')
      .addOrderBy('p.box', 'ASC')
      .addOrderBy('p.nivel', 'ASC')
      .skip(skip)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number) {
    const pos = await this.repo.findOne({ where: { id } });
    if (!pos) throw new Error(`Warehouse position #${id} not found`);
    return pos;
  }

  async create(dto: CreatePositionDto) {
    const existing = await this.repo.findOne({
      where: {
        armazem: dto.armazem,
        linha: dto.linha.padStart(2, '0'),
        box: dto.box.padStart(3, '0'),
        nivel: dto.nivel.padStart(2, '0')
      }
    });

    if (existing) {
      throw new Error(`Position ${dto.armazem}-${dto.linha}-${dto.box}-${dto.nivel} already exists`);
    }

    const pos = this.repo.create({
      armazem: dto.armazem,
      linha: dto.linha.padStart(2, '0'),
      box: dto.box.padStart(3, '0'),
      nivel: dto.nivel.padStart(2, '0'),
      situacao: dto.situacao || 'Livre',
      quantidade_caixas: dto.quantidadeCaixas || 0,
      tipo_embalagem: dto.tipoEmbalagem || 'Palletizado',
      sequencia: dto.sequencia || '1',
      quebrado: dto.quebrado || false,
      peso_maximo_kg: dto.pesoMaximoKg || 850,
      peso_atual_kg: dto.pesoAtualKg || 0
    });

    return await this.repo.save(pos);
  }

  async update(id: number, dto: UpdatePositionDto) {
    const pos = await this.findById(id);

    if (dto.situacao !== undefined) pos.situacao = dto.situacao;
    if (dto.quantidadeCaixas !== undefined) pos.quantidade_caixas = dto.quantidadeCaixas;
    if (dto.tipoEmbalagem !== undefined) pos.tipo_embalagem = dto.tipoEmbalagem;
    if (dto.sequencia !== undefined) pos.sequencia = dto.sequencia;
    if (dto.quebrado !== undefined) pos.quebrado = dto.quebrado;
    if (dto.pesoMaximoKg !== undefined) pos.peso_maximo_kg = dto.pesoMaximoKg;
    if (dto.pesoAtualKg !== undefined) pos.peso_atual_kg = dto.pesoAtualKg;

    return await this.repo.save(pos);
  }

  async delete(id: number) {
    const pos = await this.findById(id);
    await this.repo.remove(pos);
    return { success: true, message: `Position #${id} removed` };
  }

  async getHeatmapData(armazem = 'ALRA') {
    const positions = await this.repo.find({
      where: { armazem },
      order: { linha: 'ASC', box: 'ASC', nivel: 'ASC' }
    });

    const total = positions.length;
    const occupied = positions.filter((p) => p.situacao === 'Ocupada').length;
    const reserved = positions.filter((p) => p.situacao === 'Reservada').length;
    const free = positions.filter((p) => p.situacao === 'Livre').length;
    const blocked = positions.filter((p) => p.situacao === 'Bloqueada').length;
    const inTransit = positions.filter((p) => p.situacao === 'Em Carga').length;

    const occupancyRate = total > 0 ? parseFloat(((occupied / total) * 100).toFixed(1)) : 0;

    // Grouping by Linha and Box for the 2D Grid
    const matrix: Record<string, Record<string, WarehousePosition[]>> = {};

    for (const p of positions) {
      if (!matrix[p.linha]) matrix[p.linha] = {};
      if (!matrix[p.linha][p.box]) matrix[p.linha][p.box] = [];
      matrix[p.linha][p.box].push(p);
    }

    return {
      armazem,
      summary: {
        total,
        occupied,
        reserved,
        free,
        blocked,
        inTransit,
        occupancyRate
      },
      matrix
    };
  }
}
