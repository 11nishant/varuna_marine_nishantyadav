import { ComplianceBalance } from '../domain/ComplianceBalance';

export interface ComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  save(compliance: ComplianceBalance): Promise<ComplianceBalance>;
  findAdjustedCb(shipId: string, year: number): Promise<number>;
}

