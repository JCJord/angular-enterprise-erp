import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StockMovementsService } from './stock-movements.service';
import { CreateCargoDto } from './dto/create-cargo.dto';

@Controller('stock-movements')
@UseGuards(AuthGuard('jwt'))
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  async getAll(
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    return this.stockMovementsService.findAll({ search, status });
  }

  @Get('cargo/:codigoCarga')
  async getByCode(@Param('codigoCarga') codigoCarga: string) {
    return this.stockMovementsService.findByCode(codigoCarga);
  }

  @Post('cargo')
  async create(@Body() dto: CreateCargoDto) {
    return this.stockMovementsService.create(dto);
  }

  @Patch('cargo/:id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'EM_PREPARACAO' | 'CONCLUIDA' | 'EXPEDIDA' | 'CANCELADA'
  ) {
    return this.stockMovementsService.updateStatus(id, status);
  }
}
