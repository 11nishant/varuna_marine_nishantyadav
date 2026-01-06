import { Request, Response } from 'express';
import { GetRoutesUseCase } from '../../../core/application/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../core/application/SetBaselineUseCase';
import { CompareRoutesUseCase } from '../../../core/application/CompareRoutesUseCase';

export class RoutesController {
  constructor(
    private getRoutesUseCase: GetRoutesUseCase,
    private setBaselineUseCase: SetBaselineUseCase,
    private compareRoutesUseCase: CompareRoutesUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const routes = await this.getRoutesUseCase.execute();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const route = await this.setBaselineUseCase.execute(routeId);
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const comparisons = await this.compareRoutesUseCase.execute();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

