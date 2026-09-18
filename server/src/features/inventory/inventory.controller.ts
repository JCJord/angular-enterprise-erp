import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateJewelryItemDto,
  JewelryQueryDto,
  UpdateJewelryItemDto
} from './dto/jewelry-item.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getAll(@Query() query: JewelryQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('stats')
  async getStats() {
    return this.inventoryService.getSummaryStats();
  }

  @Get('summary/stats')
  async getSummaryStats() {
    return this.inventoryService.getSummaryStats();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateJewelryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateJewelryItemDto
  ) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.delete(id);
  }
}
