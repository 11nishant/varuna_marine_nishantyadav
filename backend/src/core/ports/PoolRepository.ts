import { Pool } from '../domain/Pool';

export interface PoolRepository {
  create(pool: Pool): Promise<Pool>;
  findById(id: string): Promise<Pool | null>;
}

