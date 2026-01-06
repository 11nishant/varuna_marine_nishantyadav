import { ComplianceRepository } from '../ports/ComplianceRepository';

export class GetAdjustedCbUseCase {
  constructor(private complianceRepository: ComplianceRepository) {}

  async execute(shipId: string, year: number): Promise<number> {
    return this.complianceRepository.findAdjustedCb(shipId, year);
  }
}

