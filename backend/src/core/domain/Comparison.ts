export class Comparison {
  constructor(
    public readonly routeId: string,
    public readonly baselineGhgIntensity: number,
    public readonly comparisonGhgIntensity: number,
    public readonly percentDiff: number,
    public readonly compliant: boolean
  ) {}
}

