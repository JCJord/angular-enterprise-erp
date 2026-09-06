import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { CreateJewelryItemDto } from './dto/create-jewelry-item.dto';
import { UpdateJewelryItemDto } from './dto/update-jewelry-item.dto';

export class InventoryController {
  private service = new InventoryService();

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query['search'] as string | undefined;
      const category = req.query['category'] as string | undefined;
      const page = req.query['page'] ? parseInt(req.query['page'] as string, 10) : 1;
      const limit = req.query['limit'] ? parseInt(req.query['limit'] as string, 10) : 10;

      const result = await this.service.findAll({ search, category, page, limit });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching inventory' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const item = await this.service.findById(id);
      res.json(item);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Item not found' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateJewelryItemDto = req.body;
      if (!dto.sku || !dto.name || !dto.category || !dto.material || dto.weightGrams === undefined || dto.laborCostUsd === undefined) {
        res.status(400).json({ message: 'Missing required fields: sku, name, category, material, weightGrams, laborCostUsd' });
        return;
      }

      const item = await this.service.create(dto);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error creating item' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const dto: UpdateJewelryItemDto = req.body;
      const item = await this.service.update(id, dto);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error updating item' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const result = await this.service.delete(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error deleting item' });
    }
  };
}
