'use client';

import { ConnectButton } from '@/components/ConnectButton';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { RiskCalculator } from '@/components/RiskCalculator';
import { TradeExecutor } from '@/components/TradeExecutor';
import { TradeJournal } from '@/components/TradeJournal';
import { PriceChart } from '@/components/PriceChart';
import { PriceAlerts } from '@/components/PriceAlerts';
import { useState, useCallback } from 'react';

export default function Home() {
  const [tradeParams, setTradeParams] = useState({
    positionSize: 0,
    entryPrice: 0,
    slPrice: 0,
    tpPrice: 0,
    riskAmount: 0,
    rrRatio: 0,
  });
  
  const [currentPrice, setCurrentPrice] = useState(600);

  // ✅ Mémoïsation pour éviter la boucle infinie
  const handleRiskResult = useCallback((result: {
    position: number;
    entry: number;
    sl: number;
    tp: number;
    risk: number;
    rr: number;
  }) => {
    setTradeParams({
      positionSize: result.position,
      entryPrice: result.entry,
      slPrice: result.sl,
      tpPrice: result.tp,
      riskAmount: result.risk,
      rrRatio: result.rr,
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-950 text-white">
      <h1 className="text-2xl font-bold mb-2">🔐 Trader Perso</h1>
      <p className="mb-8 text-gray-400">Ton assistant de trading automatisé</p>
      
      <ConnectButton />
      <BalanceDisplay />
      
      <RiskCalculator onResult={handleRiskResult} />
      
      <TradeExecutor {...tradeParams} />
      <TradeJournal />
      
      <PriceChart onPriceUpdate={setCurrentPrice} />
      <PriceAlerts currentPrice={currentPrice} />

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2026 - Développé par <span className="text-blue-400 font-bold">TAREK BOUSSEBCI</span></p>
      </footer>

      <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
        <p>© 2026 - Développé par <span className="text-blue-400 font-bold">TAREK BOUSSEBCI</span> 🔐</p>
      </footer>

    </main>
  );
}