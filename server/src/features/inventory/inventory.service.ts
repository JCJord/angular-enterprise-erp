import { Like, AppDataSource } from '../../common/database/data-source';
import { JewelryItem } from './entities/jewelry-item.entity';
import { CreateJewelryItemDto } from './dto/create-jewelry-item.dto';
import { UpdateJewelryItemDto } from './dto/update-jewelry-item.dto';

export class InventoryService {
  private repo = AppDataSource.getRepository(JewelryItem);

  async findAll(query?: { search?: string; category?: string; page?: number; limit?: number }) {
    const page = Math.max(Number(query?.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query?.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('item');

    if (query?.search && query.search.trim() !== '') {
      const term = `%${query.search.trim()}%`;
      qb.where('(item.name ILIKE :term OR item.sku ILIKE :term OR item.material ILIKE :term)', { term });
    }

    if (query?.category && query.category.trim() !== 'All' && query.category.trim() !== '') {
      qb.andWhere('item.category = :category', { category: query.category.trim() });
    }

    qb.orderBy('item.created_at', 'DESC').skip(skip).take(limit);

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
    const item = await this.repo.findOne({ where: { id } });
    if (!item) {
      throw new Error(`Jewelry item with ID ${id} not found`);
    }
    return item;
  }

  async create(dto: CreateJewelryItemDto) {
    const existing = await this.repo.findOne({ where: { sku: dto.sku.trim() } });
    if (existing) {
      throw new Error(`SKU ${dto.sku} already exists`);
    }

    const item = this.repo.create({
      sku: dto.sku.trim().toUpperCase(),
      name: dto.name.trim(),
      category: dto.category.trim(),
      material: dto.material.trim(),
      gold_karat: dto.goldKarat || 18,
      weight_grams: dto.weightGrams,
      diamond_karats: dto.diamondKarats || 0.00,
      labor_cost_usd: dto.laborCostUsd,
      stock_quantity: dto.stockQuantity || 0,
      image_url: dto.imageUrl || undefined
    });

    return await this.repo.save(item);
  }

  async update(id: number, dto: UpdateJewelryItemDto) {
    const item = await this.findById(id);

    if (dto.name !== undefined) item.name = dto.name.trim();
    if (dto.category !== undefined) item.category = dto.category.trim();
    if (dto.material !== undefined) item.material = dto.material.trim();
    if (dto.goldKarat !== undefined) item.gold_karat = dto.goldKarat;
    if (dto.weightGrams !== undefined) item.weight_grams = dto.weightGrams;
    if (dto.diamondKarats !== undefined) item.diamond_karats = dto.diamondKarats;
    if (dto.laborCostUsd !== undefined) item.labor_cost_usd = dto.laborCostUsd;
    if (dto.stockQuantity !== undefined) item.stock_quantity = dto.stockQuantity;
    if (dto.imageUrl !== undefined) item.image_url = dto.imageUrl;

    return await this.repo.save(item);
  }

  async delete(id: number) {
    const item = await this.findById(id);
    await this.repo.remove(item);
    return { success: true, message: `Item ${item.sku} deleted successfully` };
  }
}
