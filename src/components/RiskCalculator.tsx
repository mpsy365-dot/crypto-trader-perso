'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

interface RiskResult {
  position: number;
  entry: number;
  sl: number;
  tp: number;
  risk: number;
  rr: number;
}

interface RiskCalculatorProps {
  onResult: (result: RiskResult) => void;
}

export function RiskCalculator({ onResult }: RiskCalculatorProps) {
  const { address } = useAccount();
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
      position: positionSize,
      entry,
      sl,
      tp,
      risk: riskAmount,
      rr: riskRewardRatio
    };
  }, [entryPrice, slPrice, tpPrice, virtualCapital, riskPercent]);

  // ✅ useEffect stable avec useCallback
  useEffect(() => {
    onResult(calculations);
  }, [calculations, onResult]);

  if (!address) return null;

  return (
    <div className="mt-8 w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🧠 Risk Engine</h2>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Capital Virtuel ($) - Pour tester</label>
        <input
          type="number"
          value={virtualCapital}
          onChange={(e) => setVirtualCapital(Number(e.target.value))}
          className="input-premium"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Prix Entrée</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="input-premium"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stop Loss</label>
          <input
            type="number"
            value={slPrice}
            onChange={(e) => setSlPrice(e.target.value)}
            className="input-premium"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Take Profit</label>
          <input
            type="number"
            value={tpPrice}
            onChange={(e) => setTpPrice(e.target.value)}
            className="input-premium"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Risque Max (%)</label>
          <input
            type="number"
            value={riskPercent}
            onChange={(e) => setRiskPercent(Number(e.target.value))}
            className="input-premium"
          />
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 border border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Montant à investir :</span>
          <span className="font-bold text-blue-400">${calculations.position.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Perte max (si SL) :</span>
          <span className="font-bold text-red-400">-${calculations.risk.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Ratio Risque/Récompense :</span>
          <span className={`font-bold ${calculations.rr >= 1.5 ? 'text-green-400' : 'text-yellow-400'}`}>
            1 : {calculations.rr.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}