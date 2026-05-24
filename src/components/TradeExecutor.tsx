'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { saveTrade } from '@/lib/journal';
import { Zap, Shield, CheckCircle } from 'lucide-react';

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

  const getButtonText = () => {
    if (status === 'preparing') return '⏳ Préparation...';
    if (status === 'signing') return '✍️ Signature...';
    if (status === 'success') return '✅ TRADE EXÉCUTÉ';
    if (status === 'error') return '❌ ÉCHEC';
    return mode === 'demo' ? '🎮 EXÉCUTER (DÉMO)' : '💰 EXÉCUTER (RÉEL)';
  };

  const getButtonClass = () => {
    const base = "w-full text-lg font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (status === 'preparing' || status === 'signing') {
      return `${base} bg-gray-700 text-gray-400 cursor-wait`;
    }
    if (status === 'success') {
      return `${base} bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5`;
    }
    if (status === 'error') {
      return `${base} bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5`;
    }
    if (mode === 'demo') {
      return `${base} bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20`;
    }
    return `${base} bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5`;
  };

  if (!address) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Shield className="w-12 h-12 mx-auto mb-3 text-gray-600" />
        <p>Connecte ton wallet pour exécuter des trades</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
        <button
          onClick={() => setMode('demo')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            mode === 'demo' 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🎮 Démo
        </button>
        <button
          onClick={() => setMode('real')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            mode === 'real' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          💰 Réel
        </button>
      </div>

      {/* Info Banner */}
      <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
        mode === 'demo' 
          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' 
          : 'bg-green-500/10 border border-green-500/20 text-green-300'
      }`}>
        <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>
          {mode === 'demo' 
            ? 'Simulation sans risque - Parfait pour tester ta stratégie' 
            : 'Trade réel avec ton BNB - Frais de gaz appliqués'}
        </p>
      </div>

      {/* Execute Button */}
      <button
        onClick={mode === 'demo' ? handleDemoTrade : undefined}
        disabled={status !== 'idle' && status !== 'success' && status !== 'error'}
        className={getButtonClass()}
      >
        {getButtonText()}
      </button>

      {/* Status Messages */}
      {status === 'error' && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
          {errorMsg || 'Une erreur est survenue'}
        </div>
      )}
      
      {status === 'success' && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {mode === 'demo' ? 'Simulation réussie ! 🎉' : 'Transaction validée sur la blockchain ! ✅'}
        </div>
      )}

      {/* Trade Summary */}
      {amountToInvest > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Position</p>
            <p className="font-mono text-white">${amountToInvest.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Risque</p>
            <p className="font-mono text-red-400">${riskAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">R:R Ratio</p>
            <p className="font-mono text-amber-400">{rrRatio.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Gain Potentiel</p>
            <p className="font-mono text-green-400">${((tpPrice - entryPrice) * (amountToInvest / entryPrice)).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}