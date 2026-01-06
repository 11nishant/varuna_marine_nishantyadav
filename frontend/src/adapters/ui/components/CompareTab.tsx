import React, { useEffect, useState } from 'react';
import { apiClient } from '../../infrastructure/apiClient';
import type { Comparison } from '../../infrastructure/apiClient';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CompareTab() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getComparison();
      setComparisons(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-600 py-8">Error: {error}</div>;

  const chartData = {
    labels: comparisons.map((c) => c.routeId),
    datasets: [
      {
        label: 'Baseline GHG Intensity',
        data: comparisons.map((c) => c.baselineGhgIntensity),
        backgroundColor: 'rgba(3, 105, 161, 0.85)',
        borderColor: 'rgba(3, 105, 161, 1)',
        borderWidth: 1,
      },
      {
        label: 'Comparison GHG Intensity',
        data: comparisons.map((c) => c.comparisonGhgIntensity),
        backgroundColor: 'rgba(219, 39, 119, 0.85)',
        borderColor: 'rgba(219, 39, 119, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Route Comparison</h2>
        <p className="text-gray-600">Target Intensity: <strong>89.3368 gCO₂e/MJ</strong></p>
      </div>

      <div className="mb-8">
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Baseline GHG Intensity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comparison GHG Intensity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Difference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {comparisons.map((comp) => (
              <tr key={comp.routeId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.routeId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.baselineGhgIntensity.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.comparisonGhgIntensity.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.percentDiff.toFixed(2)}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {comp.compliant ? <span className="text-green-600">✅</span> : <span className="text-red-600">❌</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

