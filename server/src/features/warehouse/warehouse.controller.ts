import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WarehouseService } from './warehouse.service';
import { WarehouseQueryDto } from './dto/warehouse-query.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('warehouse')
@UseGuards(AuthGuard('jwt'))
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('positions')
  async getPositions(@Query() query: WarehouseQueryDto) {
    return this.warehouseService.findPositions(query);
  }

  @Get('positions/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findById(id);
  }

  @Post('positions')
  async create(@Body() dto: CreatePositionDto) {
    return this.warehouseService.create(dto);
  }

  @Put('positions/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePositionDto
  ) {
    return this.warehouseService.update(id, dto);
  }

  @Delete('positions/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.delete(id);
  }

  @Get('heatmap')
  async getHeatmap(@Query('armazem') armazem?: string) {
    return this.warehouseService.getHeatmapData(armazem);
  }
}
