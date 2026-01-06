const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface Comparison {
  routeId: string;
  baselineGhgIntensity: number;
  comparisonGhgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export interface ComplianceBalance {
  id: string;
  shipId: string;
  year: number;
  cbGco2Eq: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2Eq: number;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  createdAt: string;
  members: PoolMember[];
}

class ApiClient {
  async getRoutes(): Promise<Route[]> {
    const response = await fetch(`${API_BASE_URL}/routes`);
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await fetch(`${API_BASE_URL}/routes/${routeId}/baseline`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to set baseline');
    return response.json();
  }

  async getComparison(): Promise<Comparison[]> {
    const response = await fetch(`${API_BASE_URL}/routes/comparison`);
    if (!response.ok) throw new Error('Failed to fetch comparison');
    return response.json();
  }

  async getCb(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await fetch(`${API_BASE_URL}/compliance/cb?shipId=${shipId}&year=${year}`);
    if (!response.ok) throw new Error('Failed to fetch compliance balance');
    return response.json();
  }

  async getAdjustedCb(shipId: string, year: number): Promise<{ shipId: string; year: number; adjustedCb: number }> {
    const response = await fetch(`${API_BASE_URL}/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
    if (!response.ok) throw new Error('Failed to fetch adjusted compliance balance');
    return response.json();
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const response = await fetch(`${API_BASE_URL}/banking/bank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipId, year })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to bank surplus');
    }
    return response.json();
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/banking/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipId, year, amount })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to apply banked amount');
    }
  }

  async createPool(year: number, shipIds: string[]): Promise<Pool> {
    const response = await fetch(`${API_BASE_URL}/pools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, shipIds })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create pool');
    }
    return response.json();
  }
}

export const apiClient = new ApiClient();

