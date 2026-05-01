import React, { useState, useEffect } from 'react';
import { Search, Bell, UserCircle, Loader2 } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { searchYahooFinance, fetchAssetChartData } from '../services/yahooFinanceService';
import type { YahooSearchResult } from '../services/yahooFinanceService';

export const Topbar = ({ onViewChange }: { onViewChange: (view: string) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YahooSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const setSelectedAsset = useMarketStore(state => state.setSelectedAsset);
  const loadDynamicAsset = useMarketStore(state => state.loadDynamicAsset);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const data = await searchYahooFinance(query);
      setResults(data);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (result: YahooSearchResult) => {
    setQuery('');
    setResults([]);
    onViewChange('markets');
    
    // Check if we already have it in store, if so just select it
    const currentStocks = useMarketStore.getState().stocks;
    if (currentStocks[result.symbol]) {
      setSelectedAsset(result.symbol);
      return;
    }

    // Otherwise, fetch it dynamically
    const chartData = await fetchAssetChartData(result.symbol);
    if (chartData) {
      loadDynamicAsset({
        symbol: result.symbol,
        name: result.shortname,
        price: chartData.price,
        changePercent: chartData.changePercent,
        history: chartData.history,
        currency: chartData.currency
      });
    } else {
      alert(`Could not fetch data for ${result.symbol}`);
    }
  };

  return (
    <div className="h-16 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 z-50">
      <div className="relative w-96">
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks, crypto, ETFs..." 
          className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isSearching && <Loader2 className="w-4 h-4 text-slate-400 animate-spin mr-2" />}
        </div>
        
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
            {results.map((result, idx) => (
              <button
                key={`${result.symbol}-${idx}`}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">{result.symbol}</div>
                  <div className="text-xs text-slate-400 truncate w-64">{result.shortname}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 bg-slate-900 rounded text-slate-400 block">{result.quoteType}</span>
                  <span className="text-[10px] text-slate-500">{result.exchange}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
