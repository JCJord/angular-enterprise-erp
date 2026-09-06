import { Request, Response } from 'express';
import { WarehouseService } from './warehouse.service';
import { WarehouseQueryDto } from './dto/warehouse-query.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

export class WarehouseController {
  private service = new WarehouseService();

  getPositions = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: WarehouseQueryDto = {
        armazem: req.query['armazem'] as string,
        linhaInicial: req.query['linhaInicial'] as string,
        linhaFinal: req.query['linhaFinal'] as string,
        boxInicial: req.query['boxInicial'] as string,
        boxFinal: req.query['boxFinal'] as string,
        nivelInicial: req.query['nivelInicial'] as string,
        nivelFinal: req.query['nivelFinal'] as string,
        situacao: req.query['situacao'] as string,
        tipoEmbalagem: req.query['tipoEmbalagem'] as string,
        quebrado: req.query['quebrado'] !== undefined ? req.query['quebrado'] === 'true' : undefined,
        search: req.query['search'] as string,
        page: req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1,
        limit: req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 15
      };

      const result = await this.service.findPositions(query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching positions' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const pos = await this.service.findById(id);
      res.json(pos);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Position not found' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreatePositionDto = req.body;
      if (!dto.armazem || !dto.linha || !dto.box || !dto.nivel) {
        res.status(400).json({ message: 'armazem, linha, box, and nivel are required' });
        return;
      }

      const created = await this.service.create(dto);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error creating position' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const dto: UpdatePositionDto = req.body;
      const updated = await this.service.update(id, dto);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error updating position' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const result = await this.service.delete(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error deleting position' });
    }
  };

  getHeatmap = async (req: Request, res: Response): Promise<void> => {
    try {
      const armazem = (req.query['armazem'] as string) || 'ALRA';
      const heatmap = await this.service.getHeatmapData(armazem);
      res.json(heatmap);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error calculating heatmap' });
    }
  };
}
