import React, { useEffect, useState } from 'react';
import { apiClient } from '../../infrastructure/apiClient';

interface AdjustedCb {
  shipId: string;
  year: number;
  adjustedCb: number;
}

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [shipIds, setShipIds] = useState<string[]>(['R001', 'R002']);
  const [adjustedCbs, setAdjustedCbs] = useState<AdjustedCb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newShipId, setNewShipId] = useState('');

  useEffect(() => {
    loadAdjustedCbs();
  }, [shipIds, year]);

  const loadAdjustedCbs = async () => {
    try {
      setLoading(true);
      setError(null);
      const cbs = await Promise.all(
        shipIds.map((id) => apiClient.getAdjustedCb(id, year))
      );
      setAdjustedCbs(cbs);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addShip = () => {
    if (newShipId && !shipIds.includes(newShipId)) {
      setShipIds([...shipIds, newShipId]);
      setNewShipId('');
    }
  };

  const removeShip = (id: string) => {
    setShipIds(shipIds.filter((sid) => sid !== id));
  };

  const handleCreatePool = async () => {
    try {
      setLoading(true);
      setError(null);
      const pool = await apiClient.createPool(year, shipIds);
      alert(`Pool created successfully! ID: ${pool.id}`);
      // Reload adjusted CBs to show updated values
      await loadAdjustedCbs();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const totalCb = adjustedCbs.reduce((sum, cb) => sum + cb.adjustedCb, 0);
  const isValidPool = totalCb >= 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Pooling (Article 21)</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Ship ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newShipId}
                onChange={(e) => setNewShipId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addShip()}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., R003"
              />
              <button
                onClick={addShip}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pool Members</h3>
          <div className={`px-4 py-2 rounded ${isValidPool ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            Pool Sum: {totalCb.toFixed(2)} tCO₂e {isValidPool ? '✅' : '❌'}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB After</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adjustedCbs.map((cb) => (
                  <tr key={cb.shipId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cb.shipId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cb.adjustedCb.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cb.adjustedCb.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => removeShip(cb.shipId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <button
          onClick={handleCreatePool}
          disabled={!isValidPool || shipIds.length === 0 || loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Pool
        </button>
        {!isValidPool && (
          <p className="mt-2 text-sm text-red-600">Pool sum must be &gt;= 0 to create pool</p>
        )}
      </div>
    </div>
  );
}

