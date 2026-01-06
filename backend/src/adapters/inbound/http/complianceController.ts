import { Request, Response } from 'express';
import { CalculateComplianceBalanceUseCase } from '../../../core/application/CalculateComplianceBalanceUseCase';
import { GetAdjustedCbUseCase } from '../../../core/application/GetAdjustedCbUseCase';

export class ComplianceController {
  constructor(
    private calculateCbUseCase: CalculateComplianceBalanceUseCase,
    private getAdjustedCbUseCase: GetAdjustedCbUseCase
  ) {}

  async getCb(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }
      const cb = await this.calculateCbUseCase.execute(
        shipId as string,
        parseInt(year as string)
      );
      res.json(cb);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAdjustedCb(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }
      const adjustedCb = await this.getAdjustedCbUseCase.execute(
        shipId as string,
        parseInt(year as string)
      );
      res.json({ shipId, year: parseInt(year as string), adjustedCb });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

