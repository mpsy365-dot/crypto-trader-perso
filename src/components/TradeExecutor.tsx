'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { prepareSwap } from '@/lib/swapService';
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
  const [mode, setMode] = useState<'demo' | 'real'>('demo');
  const [status, setStatus] = useState<'idle' | 'preparing' | 'signing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { writeContractAsync } = useWriteContract();

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
      mode: mode
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

  const handleRealTrade = async () => {
    if (!address || amountToInvest <= 0) return;
    try {
      setStatus('preparing');
      setErrorMsg('');
      const bnbAmount = amountToInvest / ESTIMATED_BNB_PRICE;
      const txData = await prepareSwap(bnbAmount);
      setStatus('signing');
      await writeContractAsync({ 
        address: txData.to, 
        data: txData.data, 
        value: txData.value, 
        gas: txData.gas 
      });
      setStatus('success');
      logTrade(true);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Échec du swap');
      logTrade(false);
    }
  };

  let buttonText = mode === 'demo' ? '🎮 EXÉCUTER (DÉMO)' : '💰 EXÉCUTER (RÉEL)';
  let buttonStyle = mode === 'demo' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700';
  
  if (status === 'preparing') {
    buttonText = '⏳ Préparation...';
    buttonStyle = 'bg-gray-600 cursor-not-allowed';
  } else if (status === 'signing') {
    buttonText = mode === 'demo' ? '✍️ Signature simulée...' : '📱 Valide sur Trust Wallet...';
    buttonStyle = 'bg-yellow-600';
  } else if (status === 'success') {
    buttonText = '✅ TRADE EXÉCUTÉ';
    buttonStyle = 'bg-green-800';
  } else if (status === 'error') {
    buttonText = '❌ ÉCHEC';
    buttonStyle = 'bg-red-600';
  }

  if (!address) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('demo')}
          className={`flex-1 py-2 rounded font-semibold transition ${
            mode === 'demo' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          🎮 Mode Démo
        </button>
        <button
          onClick={() => setMode('real')}
          className={`flex-1 py-2 rounded font-semibold transition ${
            mode === 'real' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
          }`}
        >
          💰 Mode Réel
        </button>
      </div>

      <div className={`p-3 rounded-lg mb-4 text-sm ${
        mode === 'demo' ? 'bg-blue-900/30 border border-blue-700 text-blue-300' : 'bg-green-900/30 border border-green-700 text-green-300'
      }`}>
        {mode === 'demo' 
          ? '🧪 Simulation sans argent réel - Parfait pour tester !' 
          : '⚠️ Trade réel avec ton BNB - Frais de gaz appliqués'}
      </div>

      <button
        onClick={mode === 'demo' ? handleDemoTrade : handleRealTrade}
        disabled={status !== 'idle' && status !== 'success' && status !== 'error'}
        className={`w-full py-4 rounded-lg font-bold text-lg text-white transition ${buttonStyle}`}
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
          {mode === 'demo' 
            ? '🎉 Simulation réussie ! Le système fonctionne.' 
            : '✅ Transaction validée sur la blockchain !'}
        </div>
      )}
    </div>
  );
}