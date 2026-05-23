'use client';

import { useEffect, useRef, useState } from 'react';

const COINS = [
  { symbol: 'BTC/USDT', price: 65000, color: '#f7931a' },
  { symbol: 'ETH/USDT', price: 3400, color: '#627eea' },
  { symbol: 'BNB/USDT', price: 577, color: '#f0b90b' },
  { symbol: 'SOL/USDT', price: 145, color: '#14f195' },
  { symbol: 'XRP/USDT', price: 0.55, color: '#ffffff' },
];

export function PriceChart({ onPriceUpdate }: { onPriceUpdate?: (price: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPrice, setCurrentPrice] = useState(COINS[2].price);
  const [selectedCoin, setSelectedCoin] = useState(COINS[2]);
  const [timeframe, setTimeframe] = useState('1H');

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simulation des données pour le coin choisi
    const data: any[] = [];
    let price = selectedCoin.price;
    let time = Date.now() - 24 * 60 * 60 * 1000;

    for (let i = 0; i < 50; i++) {
      const volatility = selectedCoin.price > 100 ? 0.002 : 0.005;
      const open = price;
      const close = price * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * 0.001);
      const low = Math.min(open, close) * (1 - Math.random() * 0.001);
      
      data.push({ time: time + i * 60000, open, high, low, close });
      price = close;
    }

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#08090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;

      const prices = data.flatMap(d => [d.high, d.low]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice || 1;

      const candleWidth = chartWidth / data.length * 0.7;

      data.forEach((candle: any, i: number) => {
        const x = padding + i * (chartWidth / data.length) + chartWidth / data.length / 2;
        const yOpen = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
        const yClose = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
        const yHigh = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
        const yLow = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

        const isGreen = candle.close > candle.open;
        ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
        ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
        ctx.lineWidth = 1.5;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const height = Math.abs(yClose - yOpen);
        ctx.fillRect(x - candleWidth / 2, Math.min(yOpen, yClose), candleWidth, Math.max(height, 1));
      });

      // Grid lines (subtle)
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 0.5;
      for(let i=0; i<5; i++) {
        const y = padding + (chartHeight * i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
    };

    drawChart();

    const interval = setInterval(() => {
      const lastCandle = data[data.length - 1];
      const volatility = selectedCoin.price > 100 ? 0.001 : 0.005;
      const newCandle = {
        time: lastCandle.time + 60000,
        open: lastCandle.close,
        high: lastCandle.close * (1 + Math.random() * volatility),
        low: lastCandle.close * (1 - Math.random() * volatility),
        close: lastCandle.close * (1 + (Math.random() - 0.5) * volatility),
      };
      data.push(newCandle);
      if (data.length > 50) data.shift();
      
      setCurrentPrice(newCandle.close);
      onPriceUpdate?.(newCandle.close);
      drawChart();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedCoin, timeframe, onPriceUpdate]);

  const handleCoinChange = (coin: any) => {
    setSelectedCoin(coin);
    setCurrentPrice(coin.price);
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      {/* Header du Graphique */}
      <div className="p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold`} style={{backgroundColor: selectedCoin.color + '20', color: selectedCoin.color}}>
               {selectedCoin.symbol.split('/')[0].substring(0,2)}
             </div>
             <div>
               <h2 className="text-lg font-bold text-white">{selectedCoin.symbol}</h2>
               <span className={`text-xs font-mono ${currentPrice > selectedCoin.price ? 'text-green-400' : 'text-red-400'}`}>
                 ${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}
               </span>
             </div>
          </div>
          <div className="flex gap-1 bg-black/40 rounded-lg p-1">
            {['1H', '4H', '1D', '1W'].map(tf => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-bold rounded ${timeframe === tf ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Sélecteur de Crypto */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
          {COINS.map(coin => (
            <button
              key={coin.symbol}
              onClick={() => handleCoinChange(coin)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                selectedCoin.symbol === coin.symbol 
                  ? 'border-amber-400 bg-amber-400/10 text-amber-400' 
                  : 'border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {coin.symbol.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} width={800} height={400} className="w-full cursor-crosshair" />
      
      {/* Footer info */}
      <div className="p-3 bg-black/30 flex justify-between text-xs text-gray-500 border-t border-white/5">
        <span> Auto-Update 2s</span>
        <span>📊 Volume 24h: +12%</span>
        <span> Alerts: ON</span>
      </div>
    </div>
  );
}