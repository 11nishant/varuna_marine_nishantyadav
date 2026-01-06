export class ComplianceBalance {
  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2Eq: number
  ) {}
}

