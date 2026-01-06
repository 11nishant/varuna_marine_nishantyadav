import { Pool, PoolMember } from '../../../core/domain/Pool';
import { PoolRepository } from '../../../core/ports/PoolRepository';
import prisma from '../../../infrastructure/db/prisma';

export class PrismaPoolRepository implements PoolRepository {
  async create(pool: Pool): Promise<Pool> {
    const created = await prisma.pool.create({
      data: {
        year: pool.year,
        members: {
          create: pool.members.map(m => ({
            shipId: m.shipId,
            year: pool.year,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter
          }))
        }
      },
      include: { members: true }
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Pool | null> {
    const pool = await prisma.pool.findUnique({
      where: { id },
      include: { members: true }
    });
    return pool ? this.toDomain(pool) : null;
  }

  private toDomain(pool: any): Pool {
    return new Pool(
      pool.id,
      pool.year,
      pool.createdAt,
      pool.members.map((m: any) => new PoolMember(m.shipId, m.cbBefore, m.cbAfter))
    );
  }
}

