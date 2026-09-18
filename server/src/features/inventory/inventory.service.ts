import { Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '../../common/database/data-source';
import { JewelryItem } from './entities/jewelry-item.entity';
import { CreateJewelryItemDto, JewelryQueryDto, UpdateJewelryItemDto } from './dto/jewelry-item.dto';

export class InventoryService {
  private repo: Repository<JewelryItem>;

  constructor() {
    this.repo = AppDataSource.getRepository(JewelryItem);
  }

  async findAll(query: JewelryQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb: SelectQueryBuilder<JewelryItem> = this.repo.createQueryBuilder('item');

    // Text search on SKU or Name
    if (query.search && query.search.trim()) {
      qb.andWhere('(LOWER(item.name) LIKE LOWER(:search) OR LOWER(item.sku) LIKE LOWER(:search))', {
        search: `%${query.search.trim()}%`
      });
    }

    // Filter by Category
    if (query.category) {
      qb.andWhere('item.category = :category', { category: query.category });
    }

    // Filter by Metal Type
    if (query.metal_type) {
      qb.andWhere('item.metal_type = :metalType', { metalType: query.metal_type });
    }

    // Filter by Critical Stock
    if (query.critical_stock_only === true || String(query.critical_stock_only) === 'true') {
      qb.andWhere('item.stock_quantity <= item.min_stock_alert');
    }

    // Sorting
    const allowedSortFields: Record<string, string> = {
      sku: 'item.sku',
      name: 'item.name',
      weight_grams: 'item.weight_grams',
      stock_quantity: 'item.stock_quantity',
      base_price: 'item.base_price',
      created_at: 'item.created_at'
    };

    const sortColumn = query.sort_by && allowedSortFields[query.sort_by] ? allowedSortFields[query.sort_by] : 'item.created_at';
    const sortOrder = query.sort_order === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(sortColumn, sortOrder);

    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string): Promise<JewelryItem | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(dto: CreateJewelryItemDto): Promise<JewelryItem> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateJewelryItemDto): Promise<JewelryItem | null> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) return null;

    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getSummaryStats() {
    const totalItems = await this.repo.count();
    
    const criticalItems = await this.repo
      .createQueryBuilder('item')
      .where('item.stock_quantity <= item.min_stock_alert')
      .getCount();

    const sumResult = await this.repo
      .createQueryBuilder('item')
      .select('SUM(item.weight_grams * item.stock_quantity)', 'total_weight_grams')
      .addSelect('SUM(item.base_price * item.stock_quantity)', 'total_stock_value')
      .getRawOne();

    return {
      totalItems,
      criticalItems,
      totalWeightGrams: Number(sumResult?.total_weight_grams || 0),
      totalStockValue: Number(sumResult?.total_stock_value || 0),
      dailyGoldQuotation: 420.50 // R$/g Ouro 18k cotação do dia
    };
  }
}
