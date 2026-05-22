'use client';

import { useEffect, useRef, useState } from 'react';

// On exporte le prix actuel pour les alertes
export function PriceChart({ onPriceUpdate }: { onPriceUpdate?: (price: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPrice, setCurrentPrice] = useState(600);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Données simulées
    const data: { time: number; open: number; high: number; low: number; close: number }[] = [];
    let price = 600;
    let time = Date.now() - 24 * 60 * 60 * 1000;

    for (let i = 0; i < 50; i++) {
      const open = price;
      const close = price * (1 + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      data.push({ time: time + i * 60000, open, high, low, close });
      price = close;
    }

    const drawChart = () => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const padding = 40;
      const chartWidth = canvas.width - padding * 2;
      const chartHeight = canvas.height - padding * 2;

      const prices = data.flatMap(d => [d.high, d.low]);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceRange = maxPrice - minPrice || 1;

      const candleWidth = chartWidth / data.length * 0.8;

      data.forEach((candle, i) => {
        const x = padding + i * (chartWidth / data.length) + chartWidth / data.length / 2;
        const yOpen = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
        const yClose = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
        const yHigh = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
        const yLow = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

        const isGreen = candle.close > candle.open;
        ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
        ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';

        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        const height = Math.abs(yClose - yOpen);
        ctx.fillRect(x - candleWidth / 2, Math.min(yOpen, yClose), candleWidth, Math.max(height, 1));
      });

      // Ligne de prix actuelle
      const lastPrice = data[data.length - 1].close;
      const yLast = padding + chartHeight - ((lastPrice - minPrice) / priceRange) * chartHeight;
      ctx.strokeStyle = '#3B82F6';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, yLast);
      ctx.lineTo(canvas.width - padding, yLast);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#3B82F6';
      ctx.font = '12px monospace';
      ctx.fillText(lastPrice.toFixed(2), canvas.width - padding + 5, yLast + 4);
    };

    drawChart();

    // Mise à jour temps réel
    const interval = setInterval(() => {
      const lastCandle = data[data.length - 1];
      const newCandle = {
        time: lastCandle.time + 60000,
        open: lastCandle.close,
        high: lastCandle.close * (1 + Math.random() * 0.01),
        low: lastCandle.close * (1 - Math.random() * 0.01),
        close: lastCandle.close * (1 + (Math.random() - 0.5) * 0.02),
      };
      data.push(newCandle);
      if (data.length > 50) data.shift();
      
      setCurrentPrice(newCandle.close);
      onPriceUpdate?.(newCandle.close);
      drawChart();
    }, 2000);

    return () => clearInterval(interval);
  }, [onPriceUpdate]);

  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           BNB/USDT - Temps Réel
        </h2>
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full rounded"
        />
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-400">Prix actuel :</span>
          <span className="font-mono font-bold text-blue-400">${currentPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}