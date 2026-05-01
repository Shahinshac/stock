import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { LineChart as LineChartIcon, TrendingUp, TrendingDown } from 'lucide-react';

export const StockTracker = () => {
  const stocks = useMarketStore(state => state.stocks);

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-blue-500" />
          US Equities (Simulated Live)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(stocks).map((stock) => (
          <div key={stock.symbol} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-bold text-lg">{stock.symbol}</span>
                <div className={`text-2xl font-mono transition-colors duration-300 ${
                  stock.isUp === true ? 'text-green-400' : 
                  stock.isUp === false ? 'text-red-400' : 
                  'text-white'
                }`}>
                  ${stock.price.toFixed(2)}
                </div>
              </div>
              <span className={`flex items-center gap-1 text-sm ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(stock.changePercent).toFixed(2)}%
              </span>
            </div>
            
            <div className="h-32 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.history}>
                  <YAxis domain={['auto', 'auto']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={stock.changePercent >= 0 ? '#4ade80' : '#f87171'} 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false} // Disable animation for performance with live ticks
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
        {Object.keys(stocks).length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-500">
            Initializing market simulation...
          </div>
        )}
      </div>
    </div>
  );
};
