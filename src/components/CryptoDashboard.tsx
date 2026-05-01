import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export const CryptoDashboard = () => {
  const crypto = useMarketStore(state => state.crypto);

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bitcoin className="w-5 h-5 text-yellow-500" />
          Live Crypto Markets
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Live Socket</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(crypto).map((coin) => (
          <div key={coin.symbol} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-800/60 transition-all group flex flex-col h-40">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg">{coin.symbol}</span>
              <span className={`flex items-center gap-1 text-sm ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(coin.change24h).toFixed(2)}%
              </span>
            </div>
            <div className={`text-2xl font-mono mb-2 transition-colors duration-300 ${
              coin.isUp === true ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 
              coin.isUp === false ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 
              'text-white'
            }`}>
              ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <div className="flex-1 w-full mt-auto">
              {coin.history && coin.history.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coin.history}>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={coin.change24h >= 0 ? '#4ade80' : '#f87171'} 
                      strokeWidth={2} 
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">Waiting for data...</div>
              )}
            </div>
          </div>
        ))}
        {Object.keys(crypto).length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-500">
            Connecting to Binance WebSocket...
          </div>
        )}
      </div>
    </div>
  );
};
