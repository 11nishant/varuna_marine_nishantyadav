import React, { useEffect, useState } from 'react';
import { apiClient } from '../../infrastructure/apiClient';
import type { ComplianceBalance } from '../../infrastructure/apiClient';

export default function BankingTab() {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyAmount, setApplyAmount] = useState('');

  useEffect(() => {
    loadCb();
  }, [shipId, year]);

  const loadCb = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getCb(shipId, year);
      setCb(data);
    } catch (err) {
      setError((err as Error).message);
      setCb(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.bankSurplus(shipId, year);
      await loadCb();
      alert('Surplus banked successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.applyBanked(shipId, year, parseFloat(applyAmount));
      await loadCb();
      setApplyAmount('');
      alert('Banked amount applied successfully!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Banking (Article 20)</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ship ID</label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={loadCb}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Load Compliance Balance
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {cb && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Balance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">CB Before</p>
              <p className="text-2xl font-bold">{cb.cbGco2Eq.toFixed(2)} tCO₂e</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-2xl font-bold ${cb.cbGco2Eq > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cb.cbGco2Eq > 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
            <div>
              <button
                onClick={handleBank}
                disabled={cb.cbGco2Eq <= 0 || loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Bank Surplus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Apply Banked Surplus</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (tCO₂e)</label>
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApply}
              disabled={!applyAmount || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Apply Banked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

