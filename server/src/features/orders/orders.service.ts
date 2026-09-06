import { AppDataSource } from '../../common/database/data-source';
import { ProductionOrder } from './entities/production-order.entity';
import { JewelryItem } from '../inventory/entities/jewelry-item.entity';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

// Gold spot price calculation helper ($ / troy oz ~ 31.1035 grams)
const DEFAULT_GOLD_SPOT_PRICE_USD = 2450.00; // Realistic gold spot price baseline

export class OrdersService {
  private orderRepo = AppDataSource.getRepository(ProductionOrder);
  private itemRepo = AppDataSource.getRepository(JewelryItem);

  async findAll() {
    return await this.orderRepo.find({
      relations: ['item'],
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['item']
    });

    if (!order) {
      throw new Error(`Order #${id} not found`);
    }

    return order;
  }

  async create(dto: CreateProductionOrderDto) {
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) {
      throw new Error(`Jewelry item #${dto.itemId} not found in inventory`);
    }

    // Dynamic price calculation formula:
    // Gold Price per gram = (Gold Spot Price / 31.1035) * (Karat / 24)
    // Diamond cost = Carats * $1,200 per carat average
    // Unit Price = (Gold Cost + Diamond Cost + Labor Cost) * 1.35 (35% standard margin)
    const goldPurityRatio = (item.gold_karat || 18) / 24;
    const goldPricePerGram = (DEFAULT_GOLD_SPOT_PRICE_USD / 31.1035) * goldPurityRatio;
    const itemGoldCost = Number(item.weight_grams) * goldPricePerGram;
    const itemDiamondCost = Number(item.diamond_karats || 0) * 1200;
    const itemLaborCost = Number(item.labor_cost_usd || 0);

    const unitPriceRaw = (itemGoldCost + itemDiamondCost + itemLaborCost) * 1.35;
    const calculatedUnitPrice = parseFloat(unitPriceRaw.toFixed(2));
    const totalPrice = parseFloat((calculatedUnitPrice * dto.quantity).toFixed(2));

    // Generate unique order number (e.g. ORD-2026-XXXX)
    const timestampSuffix = Date.now().toString().slice(-4);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const orderNumber = `ORD-2026-${timestampSuffix}-${randomNum}`;

    const order = this.orderRepo.create({
      order_number: orderNumber,
      client_name: dto.clientName.trim(),
      item_id: item.id,
      item,
      quantity: dto.quantity,
      gold_spot_price_at_order: DEFAULT_GOLD_SPOT_PRICE_USD,
      calculated_unit_price: calculatedUnitPrice,
      total_price: totalPrice,
      status: 'PENDING',
      delivery_date: dto.deliveryDate || undefined
    });

    return await this.orderRepo.save(order);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);
    order.status = dto.status;
    return await this.orderRepo.save(order);
  }
}
