import { useMarketStore } from '../store/marketStore';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
const SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'adausdt', 'xrpusdt'];

let ws: WebSocket | null = null;

export const initCryptoStream = () => {
  if (ws) return;

  const streams = SYMBOLS.map((s) => `${s}@ticker`).join('/');
  ws = new WebSocket(`${BINANCE_WS_URL}/${streams}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Binance payload format for @ticker
    if (data.s && data.c && data.P) {
      const symbol = data.s.replace('USDT', '');
      const price = parseFloat(data.c);
      const change24h = parseFloat(data.P);

      useMarketStore.getState().updateCrypto(symbol, {
        price,
        change24h
      });
    }
  };

  ws.onclose = () => {
    console.log('Binance WS disconnected. Reconnecting...');
    ws = null;
    setTimeout(initCryptoStream, 3000);
  };
};
