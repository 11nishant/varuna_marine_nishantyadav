import { Comparison } from '../domain/Comparison';
import { RouteRepository } from '../ports/RouteRepository';

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ

export class CompareRoutesUseCase {
  constructor(private routeRepository: RouteRepository) {}

  async execute(): Promise<Comparison[]> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route found');
    }

    const allRoutes = await this.routeRepository.findAll();
    const comparisons: Comparison[] = [];

    for (const route of allRoutes) {
      if (route.routeId === baseline.routeId) continue;

      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= TARGET_INTENSITY;

      comparisons.push(
        new Comparison(
          route.routeId,
          baseline.ghgIntensity,
          route.ghgIntensity,
          percentDiff,
          compliant
        )
      );
    }

    return comparisons;
  }
}

