import { create } from 'zustand';

export interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  isUp: boolean | null; // null = no change, true = up tick, false = down tick
  history: { time: string; price: number }[];
}

export interface FiatData {
  currency: string;
  rate: number;
  change24h: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  isUp: boolean | null;
  history: { time: string; price: number }[];
  currency: 'USD' | 'INR';
}

interface MarketState {
  crypto: Record<string, CryptoData>;
  fiat: Record<string, FiatData>;
  stocks: Record<string, StockData>;
  selectedAssetId: string | null;
  
  updateCrypto: (symbol: string, data: Partial<CryptoData>) => void;
  setFiat: (data: Record<string, FiatData>) => void;
  updateStock: (symbol: string, data: Partial<StockData>) => void;
  initStock: (symbol: string, data: StockData) => void;
  setSelectedAsset: (id: string) => void;
  loadDynamicAsset: (asset: { symbol: string, name: string, price: number, changePercent: number, history: any[], currency: string }) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  crypto: {},
  fiat: {},
  stocks: {},
  selectedAssetId: null,

  setSelectedAsset: (id) => set({ selectedAssetId: id }),

  updateCrypto: (symbol, data) => set((state) => {
    const prev = state.crypto[symbol];
    const newPrice = data.price ?? prev?.price;
    const oldPrice = prev?.price ?? newPrice;
    
    let isUp: boolean | null = null;
    if (newPrice > oldPrice) isUp = true;
    else if (newPrice < oldPrice) isUp = false;

    return {
      crypto: {
        ...state.crypto,
        [symbol]: {
          ...prev,
          ...data,
          symbol,
          isUp,
          history: [...(prev?.history || []), { time: new Date().toLocaleTimeString(), price: newPrice }].slice(-30), // keep last 30 data points
        }
      }
    };
  }),

  setFiat: (data) => set({ fiat: data }),

  initStock: (symbol, data) => set((state) => ({
    stocks: {
      ...state.stocks,
      [symbol]: data
    }
  })),

  updateStock: (symbol, data) => set((state) => {
    const prev = state.stocks[symbol];
    if (!prev) return state;

    const newPrice = data.price ?? prev.price;
    const oldPrice = prev.price;
    
    let isUp: boolean | null = null;
    if (newPrice > oldPrice) isUp = true;
    else if (newPrice < oldPrice) isUp = false;

    return {
      stocks: {
        ...state.stocks,
        [symbol]: {
          ...prev,
          ...data,
          isUp,
          history: data.history ?? prev.history
        }
      }
    };
  }),

  loadDynamicAsset: (asset) => set((state) => ({
    stocks: {
      ...state.stocks,
      [asset.symbol]: {
        symbol: asset.symbol,
        name: asset.name,
        price: asset.price,
        changePercent: asset.changePercent,
        history: asset.history,
        currency: asset.currency as 'USD' | 'INR',
        isUp: asset.changePercent >= 0,
      }
    },
    selectedAssetId: asset.symbol
  })),
}));
