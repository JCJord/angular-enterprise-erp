import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }
}
