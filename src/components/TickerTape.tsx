import React from 'react';
import { useMarketStore } from '../store/marketStore';

export const TickerTape = () => {
  const crypto = useMarketStore(state => state.crypto);
  const stocks = useMarketStore(state => state.stocks);

  const items = [
    ...Object.values(crypto).map(c => ({
      symbol: c.symbol,
      price: c.price,
      change: c.change24h,
      isUp: c.isUp,
      type: 'crypto'
    })),
    ...Object.values(stocks).map(s => ({
      symbol: s.symbol,
      price: s.price,
      change: s.changePercent,
      isUp: s.isUp,
      type: 'stock'
    }))
  ];

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800/50 overflow-hidden py-2 flex relative shadow-sm">
      <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 border-r border-slate-800/50 last:border-none">
            <span className="font-bold text-slate-300">{item.symbol}</span>
            <span className={`font-mono transition-colors duration-300 ${item.isUp === true ? 'text-green-400' : item.isUp === false ? 'text-red-400' : 'text-slate-100'}`}>
              ${item.price.toFixed(2)}
            </span>
            <span className={`text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
