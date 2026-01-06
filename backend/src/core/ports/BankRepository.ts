import { BankEntry } from '../domain/BankEntry';

export interface BankRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry | null>;
  save(bankEntry: BankEntry): Promise<BankEntry>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
}

