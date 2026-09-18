import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { CreateJewelryItemDto, JewelryQueryDto, UpdateJewelryItemDto } from './dto/jewelry-item.dto';

export class InventoryController {
  private service: InventoryService;

  constructor() {
    this.service = new InventoryService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: JewelryQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        search: req.query.search as string,
        category: req.query.category as any,
        metal_type: req.query.metal_type as any,
        critical_stock_only: req.query.critical_stock_only === 'true',
        sort_by: req.query.sort_by as string,
        sort_order: (req.query.sort_order as 'ASC' | 'DESC') || 'DESC'
      };

      const result = await this.service.findAll(query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao buscar itens de estoque', error: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.service.findById(req.params.id);
      if (!item) {
        res.status(404).json({ message: 'Item não encontrado' });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao carregar item', error: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateJewelryItemDto = req.body;
      if (!dto.sku || !dto.name || !dto.category || !dto.metal_type || dto.weight_grams == null) {
        res.status(400).json({ message: 'Dados incompletos para cadastro de joia' });
        return;
      }

      const created = await this.service.create(dto);
      res.status(201).json(created);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao criar joia', error: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: UpdateJewelryItemDto = req.body;
      const updated = await this.service.update(req.params.id, dto);
      if (!updated) {
        res.status(404).json({ message: 'Item não encontrado para atualização' });
        return;
      }
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao atualizar item', error: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await this.service.delete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: 'Item não encontrado para remoção' });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao deletar item', error: error.message });
    }
  };

  getStats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.service.getSummaryStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
    }
  };
}
