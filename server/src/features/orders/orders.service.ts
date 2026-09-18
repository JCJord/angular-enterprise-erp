import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JewelryOrder } from './entities/jewelry-order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(JewelryOrder)
    private readonly orderRepo: Repository<JewelryOrder>
  ) {}

  async findAll() {
    return this.orderRepo.find({
      relations: { customer: true, jewelry_item: true },
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { customer: true, jewelry_item: true }
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }
}
