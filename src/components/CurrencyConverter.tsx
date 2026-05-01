import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { ArrowRightLeft, DollarSign } from 'lucide-react';

export const CurrencyConverter = () => {
  const fiat = useMarketStore(state => state.fiat);
  
  const [amount, setAmount] = useState<string>('100');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('EUR');

  const currencies = Object.keys(fiat);

  const calculateConversion = () => {
    if (!fiat[from] || !fiat[to]) return 0;
    const baseAmount = parseFloat(amount) || 0;
    
    // Convert 'from' to USD first (since USD is our base rate 1)
    // Actually, Frankfurter API returns rates based on the `from` param we requested.
    // If we requested `from=USD`, then fiat[currency].rate is the value of 1 USD in `currency`.
    // Example: fiat['EUR'].rate = 0.92 means 1 USD = 0.92 EUR.
    
    const amountInUSD = baseAmount / fiat[from].rate;
    return amountInUSD * fiat[to].rate;
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Fiat Converter
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 focus-within:border-blue-500/50 transition-colors">
          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">You Pay</label>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-2xl font-mono text-white outline-none w-full"
            />
            <select 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg py-1 px-2 outline-none cursor-pointer"
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <button 
            className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full border border-slate-600 transition-colors"
            onClick={() => { setFrom(to); setTo(from); }}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">You Get</label>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono text-white w-full">
              {calculateConversion().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </div>
            <select 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg py-1 px-2 outline-none cursor-pointer"
            >
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
