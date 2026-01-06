import { ComplianceBalance } from '../../../core/domain/ComplianceBalance';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { BankRepository } from '../../../core/ports/BankRepository';
import prisma from '../../../infrastructure/db/prisma';

export class PrismaComplianceRepository implements ComplianceRepository {
  constructor(private bankRepository: BankRepository) {}

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const compliance = await prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } }
    });
    return compliance ? this.toDomain(compliance) : null;
  }

  async save(compliance: ComplianceBalance): Promise<ComplianceBalance> {
    const saved = await prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: compliance.shipId, year: compliance.year } },
      update: { cbGco2Eq: compliance.cbGco2Eq },
      create: {
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2Eq: compliance.cbGco2Eq
      }
    });
    return this.toDomain(saved);
  }

  async findAdjustedCb(shipId: string, year: number): Promise<number> {
    const compliance = await this.findByShipAndYear(shipId, year);
    if (!compliance) {
      return 0;
    }

    // Get total banked amount applied
    const banked = await this.bankRepository.getTotalBanked(shipId, year);
    
    // Adjusted CB = original CB - banked amount applied
    return compliance.cbGco2Eq - banked;
  }

  private toDomain(compliance: any): ComplianceBalance {
    return new ComplianceBalance(
      compliance.id,
      compliance.shipId,
      compliance.year,
      compliance.cbGco2Eq
    );
  }
}

