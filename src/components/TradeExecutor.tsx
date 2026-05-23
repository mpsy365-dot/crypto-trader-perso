'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { saveTrade } from '@/lib/journal';

const ESTIMATED_BNB_PRICE = 600;

interface TradeExecutorProps {
  amountToInvest: number;
  entryPrice: number;
  slPrice: number;
  tpPrice: number;
  riskAmount: number;
  rrRatio: number;
}

export function TradeExecutor({ 
  amountToInvest, 
  entryPrice, 
  slPrice, 
  tpPrice, 
  riskAmount, 
  rrRatio 
}: TradeExecutorProps) {
  const { address } = useAccount();
  const [status, setStatus] = useState<'idle' | 'preparing' | 'signing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const logTrade = (success: boolean) => {
    saveTrade({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      pair: 'BNB/USDT',
      entry: entryPrice,
      sl: slPrice,
      tp: tpPrice,
      risk: riskAmount,
      position: amountToInvest,
      ratio: rrRatio,
      status: success ? 'success' : 'failed',
      mode: 'demo'
    });
  };

  const handleDemoTrade = async () => {
    if (!address || amountToInvest <= 0) return;
    try {
      setStatus('preparing');
      setErrorMsg('');
      await new Promise(r => setTimeout(r, 1000));
      setStatus('signing');
      await new Promise(r => setTimeout(r, 1500));
      setStatus('success');
      logTrade(true);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
      logTrade(false);
    }
  };

  const buttonText = status === 'preparing' ? '⏳ Préparation...' :
                     status === 'signing' ? '✍️ Signature simulée...' :
                     status === 'success' ? '✅ TRADE EXÉCUTÉ' :
                     status === 'error' ? '❌ ÉCHEC' :
                     '🎮 EXÉCUTER (DÉMO)';
  

  if (!address) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="p-3 rounded-lg mb-4 text-sm bg-blue-900/30 border border-blue-700 text-blue-300">
        🧪 Mode Démo - Simulation sans argent réel
      </div>

      <button
  onClick={() => setMode('demo')}
  className={`btn-secondary w-full ${mode === 'demo' ? 'border-amber-400/50' : ''}`}
>
  🎮 Mode Démo
</button>

<button
  onClick={handleDemoTrade}
  disabled={status !== 'idle' && status !== 'success' && status !== 'error'}
  className={`btn-green w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed`}
>
  {buttonText}
</button>

      {status === 'error' && (
        <div className="mt-3 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {errorMsg}
        </div>
      )}
      
      {status === 'success' && (
        <div className="mt-3 p-3 bg-green-900/50 border border-green-700 rounded text-green-200 text-sm text-center">
          🎉 Simulation réussie ! Le système fonctionne.
        </div>
      )}
    </div>
  );
}