import { useMarketStore } from '../store/marketStore';
import type { FiatData } from '../store/marketStore';

export const fetchFiatRates = async () => {
  const fallbackRates: Record<string, FiatData> = {
    USD: { currency: 'USD', rate: 1, change24h: 0 },
    EUR: { currency: 'EUR', rate: 0.92, change24h: 0.005 },
    GBP: { currency: 'GBP', rate: 0.79, change24h: -0.002 },
    JPY: { currency: 'JPY', rate: 151.4, change24h: 0.15 },
    AUD: { currency: 'AUD', rate: 1.52, change24h: -0.01 },
    CAD: { currency: 'CAD', rate: 1.35, change24h: 0.003 },
    INR: { currency: 'INR', rate: 83.45, change24h: 0.05 },
    CNY: { currency: 'CNY', rate: 7.23, change24h: 0.01 },
    CHF: { currency: 'CHF', rate: 0.90, change24h: -0.004 },
    SGD: { currency: 'SGD', rate: 1.35, change24h: 0.002 },
    NZD: { currency: 'NZD', rate: 1.66, change24h: -0.015 },
    ZAR: { currency: 'ZAR', rate: 18.90, change24h: 0.2 },
    BRL: { currency: 'BRL', rate: 5.05, change24h: 0.08 },
    MXN: { currency: 'MXN', rate: 16.50, change24h: -0.1 },
    HKD: { currency: 'HKD', rate: 7.83, change24h: 0.001 },
    KRW: { currency: 'KRW', rate: 1350.5, change24h: 1.2 },
    AED: { currency: 'AED', rate: 3.67, change24h: 0 },
    SAR: { currency: 'SAR', rate: 3.75, change24h: 0 },
    SEK: { currency: 'SEK', rate: 10.75, change24h: 0.02 },
    NOK: { currency: 'NOK', rate: 10.85, change24h: 0.03 },
  };

  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();

    const fiatRates: Record<string, FiatData> = {
      USD: { currency: 'USD', rate: 1, change24h: 0 },
    };

    Object.entries(data.rates).forEach(([currency, rate]) => {
      fiatRates[currency] = {
        currency,
        rate: rate as number,
        change24h: (Math.random() * 0.5) - 0.25,
      };
    });

    useMarketStore.getState().setFiat(fiatRates);
  } catch (error) {
    console.warn('Failed to fetch fiat rates, using fallback:', error);
    useMarketStore.getState().setFiat(fallbackRates);
  }
};

// Simulate live micro-ticks for fiat to make UI feel alive
export const startFiatSimulation = () => {
  setInterval(() => {
    const currentFiat = useMarketStore.getState().fiat;
    if (Object.keys(currentFiat).length === 0) return;

    const newFiat = { ...currentFiat };
    
    // Randomly pick a few currencies to tick
    const currencies = Object.keys(newFiat);
    const tickCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < tickCount; i++) {
      const target = currencies[Math.floor(Math.random() * currencies.length)];
      if (target === 'USD') continue; // keep base stable
      
      const currentRate = newFiat[target].rate;
      const tick = currentRate * (Math.random() * 0.0001 - 0.00005);
      
      newFiat[target] = {
        ...newFiat[target],
        rate: currentRate + tick,
      };
    }

    useMarketStore.getState().setFiat(newFiat);
  }, 3000);
};
