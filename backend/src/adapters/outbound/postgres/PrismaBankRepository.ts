import { BankEntry } from '../../../core/domain/BankEntry';
import { BankRepository } from '../../../core/ports/BankRepository';
import prisma from '../../../infrastructure/db/prisma';

export class PrismaBankRepository implements BankRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry | null> {
    const entry = await prisma.bankEntry.findUnique({
      where: { shipId_year: { shipId, year } }
    });
    return entry ? this.toDomain(entry) : null;
  }

  async save(bankEntry: BankEntry): Promise<BankEntry> {
    const saved = await prisma.bankEntry.upsert({
      where: { shipId_year: { shipId: bankEntry.shipId, year: bankEntry.year } },
      update: { amountGco2Eq: bankEntry.amountGco2Eq },
      create: {
        shipId: bankEntry.shipId,
        year: bankEntry.year,
        amountGco2Eq: bankEntry.amountGco2Eq
      }
    });
    return this.toDomain(saved);
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const entry = await this.findByShipAndYear(shipId, year);
    return entry ? entry.amountGco2Eq : 0;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    const entry = await this.findByShipAndYear(shipId, year);
    if (!entry) {
      throw new Error('No banked amount found');
    }

    if (amount > entry.amountGco2Eq) {
      throw new Error('Insufficient banked amount');
    }

    await prisma.bankEntry.update({
      where: { shipId_year: { shipId, year } },
      data: { amountGco2Eq: entry.amountGco2Eq - amount }
    });
  }

  private toDomain(entry: any): BankEntry {
    return new BankEntry(
      entry.id,
      entry.shipId,
      entry.year,
      entry.amountGco2Eq
    );
  }
}

