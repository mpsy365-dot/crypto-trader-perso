'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';

interface RiskResult {
  positionSize: number;
  entryPrice: number;
  slPrice: number;
  tpPrice: number;
  riskAmount: number;
  rrRatio: number;
}

interface RiskCalculatorProps {
  onResult: (result: RiskResult) => void;
}

export function RiskCalculator({ onResult }: RiskCalculatorProps) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const [virtualCapital, setVirtualCapital] = useState<number>(100);
  const [entryPrice, setEntryPrice] = useState<string>('600');
  const [slPrice, setSlPrice] = useState<string>('570');
  const [tpPrice, setTpPrice] = useState<string>('660');
  const [riskPercent, setRiskPercent] = useState<number>(1);

  // Calculs mémoïsés pour éviter les re-rendus inutiles
  const calculations = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0;
    const sl = parseFloat(slPrice) || 0;
    const tp = parseFloat(tpPrice) || 0;

    const slDistance = entry > 0 ? Math.abs(entry - sl) / entry : 0;
    const capitalToUse = virtualCapital;
    const riskAmount = capitalToUse * (riskPercent / 100);
    const positionSize = slDistance > 0 ? riskAmount / slDistance : 0;
    const rewardDistance = entry > 0 ? Math.abs(tp - entry) / entry : 0;
    const riskRewardRatio = slDistance > 0 ? rewardDistance / slDistance : 0;

    return {
      positionSize,
      entryPrice: entry,
      slPrice: sl,
      tpPrice: tp,
      riskAmount,
      rrRatio: riskRewardRatio
    };
  }, [entryPrice, slPrice, tpPrice, virtualCapital, riskPercent]);

  // Envoyer les résultats au parent quand ils changent
  useEffect(() => {
    onResult(calculations);
  }, [calculations, onResult]);

  const handleCalculate = useCallback(() => {
    onResult(calculations);
  }, [calculations, onResult]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        🎯 Risk Calculator
      </h3>

      {/* Capital Input */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Capital Virtuel ($)</label>
        <input
          type="number"
          value={virtualCapital}
          onChange={(e) => setVirtualCapital(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 transition"
          placeholder="100"
        />
      </div>

      {/* Prix Inputs */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Entrée</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 transition"
            placeholder="600"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Stop Loss</label>
          <input
            type="number"
            value={slPrice}
            onChange={(e) => setSlPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-400 transition"
            placeholder="570"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Take Profit</label>
          <input
            type="number"
            value={tpPrice}
            onChange={(e) => setTpPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400 transition"
            placeholder="660"
          />
        </div>
      </div>

      {/* Risk % Slider */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Risque par trade : <span className="text-amber-400 font-bold">{riskPercent}%</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={riskPercent}
          onChange={(e) => setRiskPercent(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      {/* Results Display */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Position Size:</span>
          <span className="font-mono text-white">${calculations.positionSize.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Risque Max:</span>
          <span className="font-mono text-red-400">${calculations.riskAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">R:R Ratio:</span>
          <span className={`font-mono font-bold ${
            calculations.rrRatio >= 2 ? 'text-green-400' : 
            calculations.rrRatio >= 1 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {calculations.rrRatio.toFixed(2)}x
          </span>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-3 rounded-lg transition shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
      >
        Calculer & Appliquer
      </button>
    </div>
  );
}