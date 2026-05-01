import { useMarketStore } from '../store/marketStore';

const SEED_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 173.50, volatility: 0.0005, currency: 'USD' as const },
  { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 405.20, volatility: 0.0004, currency: 'USD' as const },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 880.10, volatility: 0.0015, currency: 'USD' as const },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 175.34, volatility: 0.0020, currency: 'USD' as const },
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind.', basePrice: 2950.40, volatility: 0.0008, currency: 'INR' as const },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', basePrice: 3890.15, volatility: 0.0005, currency: 'INR' as const },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', basePrice: 1530.80, volatility: 0.0010, currency: 'INR' as const },
];

export const initStockSimulation = () => {
  const store = useMarketStore.getState();
  
  SEED_STOCKS.forEach(stock => {
    // Generate some initial history
    const history = [];
    let currentPrice = stock.basePrice;
    
    // 30 data points for the area chart
    for (let i = 30; i >= 0; i--) {
      const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      history.push({ time, price: currentPrice });
      currentPrice = currentPrice * (1 + (Math.random() * stock.volatility * 2 - stock.volatility));
    }

    const changePercent = ((currentPrice - stock.basePrice) / stock.basePrice) * 100;

    store.initStock(stock.symbol, {
      symbol: stock.symbol,
      name: stock.name,
      currency: stock.currency,
      price: currentPrice,
      changePercent,
      isUp: null,
      history
    });
  });

  // Start live ticks
  setInterval(() => {
    const currentState = useMarketStore.getState();
    const allStockSymbols = Object.keys(currentState.stocks);
    if (allStockSymbols.length === 0) return;
    
    // Pick 1-3 random stocks to tick every second
    const numTicks = Math.floor(Math.random() * 3) + 1;
    for(let i = 0; i < numTicks; i++) {
      const targetSymbol = allStockSymbols[Math.floor(Math.random() * allStockSymbols.length)];
      const stockData = currentState.stocks[targetSymbol];
      if (!stockData) continue;

      // Use a default volatility for dynamic assets if they don't have one in SEED_STOCKS
      const seedStock = SEED_STOCKS.find(s => s.symbol === targetSymbol);
      const volatility = seedStock ? seedStock.volatility : 0.0005;
      
      const tickDelta = stockData.price * (Math.random() * volatility * 2 - volatility);
      const newPrice = stockData.price + tickDelta;
      
      const newHistory = [...stockData.history.slice(1), { 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        price: newPrice 
      }];

      // For dynamic assets, basePrice is not known, so we estimate changePercent from the first point in history
      const basePrice = seedStock ? seedStock.basePrice : (stockData.history[0]?.price || newPrice);
      const changePercent = ((newPrice - basePrice) / basePrice) * 100;

      currentState.updateStock(targetSymbol, {
        price: newPrice,
        changePercent,
        history: newHistory
      });
    }
  }, 1000);
};
