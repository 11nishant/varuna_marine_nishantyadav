import { Route } from '../domain/Route';
import { RouteRepository } from '../ports/RouteRepository';

export class SetBaselineUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    return this.routeRepository.setBaseline(routeId);
  }
}

