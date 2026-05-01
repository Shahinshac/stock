

const testYahoo = async (symbol) => {
  try {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=5m`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    
    console.log(`Fetching ${symbol}...`);
    const res = await fetch(proxyUrl);
    
    if (!res.ok) {
        console.log(`HTTP Error for ${symbol}: ${res.status}`);
        return;
    }
    const data = await res.json();
    console.log(`Success for ${symbol}. Result exists:`, !!data?.chart?.result?.[0]);
  } catch(e) {
    console.log(`Exception for ${symbol}:`, e.message);
  }
};

const run = async () => {
    await testYahoo('AAPL');
    await testYahoo('RELIANCE.NS');
    await testYahoo('TATASILV.NS');
    await testYahoo('TATAMOTORS.NS');
};

run();
