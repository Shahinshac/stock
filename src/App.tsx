import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { TickerTape } from './components/TickerTape';
import { CryptoDashboard } from './components/CryptoDashboard';
import { StockTracker } from './components/StockTracker';
import { CurrencyConverter } from './components/CurrencyConverter';
import { Watchlist } from './components/Watchlist';
import { ProfessionalChart } from './components/ProfessionalChart';
import { Auth } from './components/Auth';
import { useAuthStore } from './store/authStore';

import { initCryptoStream } from './services/cryptoService';
import { fetchFiatRates, startFiatSimulation } from './services/fiatService';
import { initStockSimulation } from './services/stockService';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) return; // Only init data if authenticated
    // Initialize all data services on mount
    initCryptoStream();
    
    fetchFiatRates().then(() => {
      startFiatSimulation();
    });

    initStockSimulation();
  }, [user]);

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <TickerTape />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeView === 'dashboard' && (
            <>
              <CryptoDashboard />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <StockTracker />
                </div>
                <div className="xl:col-span-1">
                  <CurrencyConverter />
                </div>
              </div>
            </>
          )}

          {activeView === 'markets' && (
            <div className="absolute top-16 left-0 right-0 bottom-0 flex">
              <Watchlist />
              <div className="flex-1 bg-slate-950/50">
                <ProfessionalChart />
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-8 backdrop-blur-xl">
              <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-sm text-slate-400">Toggle dark mode interface</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center p-1 justify-end">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Live Ticks</h3>
                    <p className="text-sm text-slate-400">Enable or disable simulated market noise</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center p-1 justify-end">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
