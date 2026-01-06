import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../core/application/ApplyBankedUseCase';

export class BankingController {
  constructor(
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedUseCase: ApplyBankedUseCase
  ) {}

  async bank(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.body;
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }
      const bankEntry = await this.bankSurplusUseCase.execute(shipId, parseInt(year));
      res.json(bankEntry);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async apply(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;
      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }
      await this.applyBankedUseCase.execute(shipId, parseInt(year), parseFloat(amount));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

