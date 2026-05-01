import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ProfessionalChart = () => {
  const selectedAssetId = useMarketStore(state => state.selectedAssetId);
  const stocks = useMarketStore(state => state.stocks);
  const crypto = useMarketStore(state => state.crypto);

  if (!selectedAssetId) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <p>Select an asset from the watchlist or search to view details.</p>
      </div>
    );
  }

  const asset = stocks[selectedAssetId] || crypto[selectedAssetId];
  if (!asset) return null;

  const isStock = 'currency' in asset;
  const currencySymbol = isStock && asset.currency === 'INR' ? '₹' : '$';
  const change = isStock ? asset.changePercent : asset.change24h;
  const isUp = change >= 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-400 text-xs mb-1">{payload[0].payload.time}</p>
          <p className={`font-mono font-bold text-lg ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {currencySymbol}{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-slate-800/50 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{asset.symbol}</h1>
          <p className="text-slate-400">{isStock ? asset.name : 'Cryptocurrency'}</p>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-mono transition-colors duration-300 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {currencySymbol}{asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-lg mt-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(2)}% (1D)
          </div>
        </div>
      </div>

      {/* Timeframes */}
      <div className="px-8 py-4 flex gap-2">
        {['1H', '1D', '1W', '1M', '1Y'].map(tf => (
          <button key={tf} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${tf === '1D' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 w-full px-8 pb-8 min-h-[400px]">
        {asset.history && asset.history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={asset.history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isUp ? '#4ade80' : '#f87171'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isUp ? '#4ade80' : '#f87171'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#475569" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="#475569"
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => `${currencySymbol}${val.toLocaleString()}`}
                orientation="right"
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isUp ? '#4ade80' : '#f87171'} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">Loading chart data...</div>
        )}
      </div>
    </div>
  );
};
