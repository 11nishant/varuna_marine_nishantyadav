import React, { useState } from 'react';
import RoutesTab from './adapters/ui/components/RoutesTab';
import CompareTab from './adapters/ui/components/CompareTab';
import BankingTab from './adapters/ui/components/BankingTab';
import PoolingTab from './adapters/ui/components/PoolingTab';

function App() {
  const [activeTab, setActiveTab] = useState<'routes' | 'compare' | 'banking' | 'pooling'>('routes');

  console.log('frontend: App render', activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ textShadow: '1px 1px 0 #e5e7eb, 2px 2px 0 #d1d5db, 3px 3px 0 #9ca3af' }}
          >
            Fuel EU Maritime Compliance Dashboard
          </h1>
          
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tabs">
            {(['routes', 'compare', 'banking', 'pooling'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'compare' && <CompareTab />}
        {activeTab === 'banking' && <BankingTab />}
        {activeTab === 'pooling' && <PoolingTab />}
      </main>
    </div>
  );
}

export default App;

