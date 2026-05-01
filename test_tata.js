const testTata = async () => {
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/TATASILV.NS?range=1d&interval=5m`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
  const res = await fetch(proxyUrl);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
};
testTata();
