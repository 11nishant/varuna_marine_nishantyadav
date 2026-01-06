import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

export class PoolingController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  async createPool(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;
      if (!year || !shipIds || !Array.isArray(shipIds)) {
        res.status(400).json({ error: 'year and shipIds array are required' });
        return;
      }
      const pool = await this.createPoolUseCase.execute(parseInt(year), shipIds);
      res.json(pool);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

