import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateProductionOrderDto } from './dto/create-production-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

export class OrdersController {
  private service = new OrdersService();

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.service.findAll();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching orders' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const order = await this.service.findById(id);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Order not found' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateProductionOrderDto = req.body;
      if (!dto.clientName || !dto.itemId || !dto.quantity) {
        res.status(400).json({ message: 'clientName, itemId, and quantity are required' });
        return;
      }

      const order = await this.service.create(dto);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error creating order' });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params['id'], 10);
      const dto: UpdateOrderStatusDto = req.body;
      if (!dto.status) {
        res.status(400).json({ message: 'status is required' });
        return;
      }

      const order = await this.service.updateStatus(id, dto);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error updating order status' });
    }
  };
}
