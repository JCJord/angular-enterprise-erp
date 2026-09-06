import { Request, Response } from 'express';
import { StockMovementsService } from './stock-movements.service';
import { CreateCargoDto } from './dto/create-cargo.dto';

export class StockMovementsController {
  private service = new StockMovementsService();

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query['search'] as string;
      const status = req.query['status'] as string;
      const result = await this.service.findAll({ search, status });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching stock movements' });
    }
  };

  getByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const codigoCarga = req.params['codigoCarga'];
      const result = await this.service.findByCode(codigoCarga);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Cargo not found' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateCargoDto = req.body;
      if (!dto.codigoCarga || !dto.clienteFornecedor || !dto.codigoSap) {
        res.status(400).json({ message: 'codigoCarga, clienteFornecedor, and codigoSap are required' });
        return;
      }

      const result = await this.service.create(dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error creating cargo' });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const { status } = req.body;
      if (!status) {
        res.status(400).json({ message: 'status is required' });
        return;
      }

      const result = await this.service.updateStatus(id, status);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error updating status' });
    }
  };
}
