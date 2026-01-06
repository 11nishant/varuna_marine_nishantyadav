import { Route } from '../../../core/domain/Route';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import prisma from '../../../infrastructure/db/prisma';

export class PrismaRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const routes = await prisma.route.findMany();
    return routes.map(this.toDomain);
  }

  async findById(id: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { id } });
    return route ? this.toDomain(route) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { routeId } });
    return route ? this.toDomain(route) : null;
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First, unset all baselines
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });

    // Set the new baseline
    const route = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true }
    });

    return this.toDomain(route);
  }

  async findBaseline(): Promise<Route | null> {
    const route = await prisma.route.findFirst({ where: { isBaseline: true } });
    return route ? this.toDomain(route) : null;
  }

  private toDomain(route: any): Route {
    return new Route(
      route.id,
      route.routeId,
      route.vesselType,
      route.fuelType,
      route.year,
      route.ghgIntensity,
      route.fuelConsumption,
      route.distance,
      route.totalEmissions,
      route.isBaseline
    );
  }
}

