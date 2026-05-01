const testCorsProxy = async () => {
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/TATASILV.NS?range=1d&interval=5m`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) {
     console.log("Error status:", res.status);
     const text = await res.text();
     console.log("Error body:", text.substring(0, 100));
     return;
  }
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2).substring(0, 500));
};
testCorsProxy();
