import React from 'react';
import { useMarketStore } from '../store/marketStore';

export const Watchlist = () => {
  const stocks = useMarketStore(state => state.stocks);
  const crypto = useMarketStore(state => state.crypto);
  const selectedAssetId = useMarketStore(state => state.selectedAssetId);
  const setSelectedAsset = useMarketStore(state => state.setSelectedAsset);

  const formatPrice = (price: number, currency?: string) => {
    if (currency === 'INR') return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-80 border-r border-slate-800/50 bg-slate-900/30 overflow-y-auto flex flex-col custom-scrollbar">
      <div className="p-4 border-b border-slate-800/50 sticky top-0 bg-slate-900/90 backdrop-blur z-10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Watchlist</h3>
      </div>
      
      <div className="flex-1">
        {/* Stocks */}
        {Object.values(stocks).map(stock => (
          <button
            key={stock.symbol}
            onClick={() => setSelectedAsset(stock.symbol)}
            className={`w-full text-left p-4 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex justify-between items-center ${selectedAssetId === stock.symbol ? 'bg-slate-800/80 border-l-2 border-l-blue-500' : ''}`}
          >
            <div>
              <div className="font-bold text-slate-200">{stock.symbol}</div>
              <div className="text-xs text-slate-500 truncate w-32">{stock.name}</div>
            </div>
            <div className="text-right">
              <div className={`font-mono transition-colors duration-300 ${stock.isUp === true ? 'text-green-400' : stock.isUp === false ? 'text-red-400' : 'text-slate-200'}`}>
                {formatPrice(stock.price, stock.currency)}
              </div>
              <div className={`text-xs ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}

        {/* Crypto */}
        {Object.values(crypto).map(coin => (
          <button
            key={coin.symbol}
            onClick={() => setSelectedAsset(coin.symbol)}
            className={`w-full text-left p-4 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex justify-between items-center ${selectedAssetId === coin.symbol ? 'bg-slate-800/80 border-l-2 border-l-blue-500' : ''}`}
          >
            <div>
              <div className="font-bold text-slate-200">{coin.symbol}</div>
              <div className="text-xs text-slate-500">Crypto</div>
            </div>
            <div className="text-right">
              <div className={`font-mono transition-colors duration-300 ${coin.isUp === true ? 'text-green-400' : coin.isUp === false ? 'text-red-400' : 'text-slate-200'}`}>
                {formatPrice(coin.price, 'USD')}
              </div>
              <div className={`text-xs ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
