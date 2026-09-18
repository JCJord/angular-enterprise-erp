import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>
  ) {}

  async findAll() {
    return this.customerRepo.find({
      order: { name: 'ASC' }
    });
  }

  async findById(id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: { orders: true }
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }
}
