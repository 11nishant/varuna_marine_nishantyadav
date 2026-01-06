import { ComplianceRepository } from '../ports/ComplianceRepository';
import { BankRepository } from '../ports/BankRepository';

export class ApplyBankedUseCase {
  constructor(
    private complianceRepository: ComplianceRepository,
    private bankRepository: BankRepository
  ) {}

  async execute(shipId: string, year: number, amount: number): Promise<void> {
    const available = await this.bankRepository.getTotalBanked(shipId, year);
    if (amount > available) {
      throw new Error(`Insufficient banked amount. Available: ${available}, Requested: ${amount}`);
    }

    await this.bankRepository.applyBanked(shipId, year, amount);
  }
}

