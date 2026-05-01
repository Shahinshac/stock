export interface YahooSearchResult {
  symbol: string;
  shortname: string;
  longname: string;
  exchange: string;
  quoteType: string;
}

export const searchYahooFinance = async (query: string): Promise<YahooSearchResult[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`/api/yahoo-search?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      console.error(`Search failed with status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    
    if (data.quotes) {
      return data.quotes.map((q: any) => ({
        symbol: q.symbol,
        shortname: q.shortname || q.longname || q.symbol,
        longname: q.longname || q.shortname || '',
        exchange: q.exchange,
        quoteType: q.quoteType
      }));
    }
    return [];
  } catch (error) {
    console.error('Yahoo Finance Search Error:', error);
    return [];
  }
};

export const fetchAssetChartData = async (symbol: string) => {
  try {
    const res = await fetch(`/api/yahoo-chart?symbol=${encodeURIComponent(symbol)}`);
    
    if (!res.ok) {
      console.warn(`Chart fetch failed for ${symbol} with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    
    const result = data.chart?.result?.[0];
    if (!result) return null;

    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;
    const previousClose = result.meta.previousClose;
    const currency = result.meta.currency;

    if (!timestamps || !prices) return null;

    const history = timestamps.map((ts: number, i: number) => {
      // Find the last valid price if there are nulls (trading halts)
      let price = prices[i];
      let j = i;
      while (price === null && j > 0) {
        j--;
        price = prices[j];
      }
      
      return {
        time: new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: price || previousClose
      };
    }).filter((h: any) => h.price !== null);

    const currentPrice = history.length > 0 ? history[history.length - 1].price : previousClose;
    const changePercent = ((currentPrice - previousClose) / previousClose) * 100;

    return {
      price: currentPrice,
      changePercent,
      history,
      currency
    };

  } catch (error) {
    console.error('Yahoo Finance Chart Fetch Error:', error);
    return null;
  }
};
