'use client';

import { useEffect } from 'react';
import { useScanner } from '@/contexts/ScannerContext';
import { ArrowUpRight, ArrowDownRight, CheckCircle, RefreshCw, Zap, Target, ShieldAlert, TrendingUp, Wallet } from 'lucide-react';

// Props du composant avec gestion des soldes
interface AIOpportunityScannerProps {
  onTradeApproved?: (trade: any) => void;
  hasSufficientBalance?: (symbol: string, minUSD?: number) => boolean;
  balances?: Record<string, { symbol: string; balance: string; balanceUSD: number; hasMin20: boolean }>;
  isConnected?: boolean;
}

export default function AIOpportunityScanner({ 
  onTradeApproved,
  hasSufficientBalance = () => false,
  balances = {},
  isConnected = false
}: AIOpportunityScannerProps) {
  const { data, count, auto, last, isPaused, executed, togglePause, markExecuted, isExecuted } = useScanner();

  // Auto-exécution des signaux verts AVEC vérification de solde
  useEffect(() => {
  if (isPaused) return;
  
  data.forEach((opp, idx) => {
    const symbol = opp.pair.split('/')[0];
    
    if (opp.isGreenSignal && !isExecuted(opp.id)) {
      // 🔐 Vérification STRICTE du solde
      const canAutoExecute = hasSufficientBalance(symbol, 20);
      
      setTimeout(() => {
        if (canAutoExecute) {
          console.log(`✅ Auto-exécution: ${opp.pair} (Solde: $${balances[symbol]?.balanceUSD ?? 0})`);
          if (onTradeApproved) onTradeApproved(opp);
          markExecuted(opp.id);
        } else {
          console.log(`❌ BLOQUÉ: ${opp.pair} - Solde insuffisant ($${balances[symbol]?.balanceUSD ?? 0} < $20)`);
          markExecuted(opp.id); // Marque comme "vu" pour ne pas réessayer
        }
      }, idx * 500);
    }
  });
}, [data, isPaused, onTradeApproved, markExecuted, isExecuted, hasSufficientBalance, balances]);

  const handleValidate = (opp: any) => {
    if (onTradeApproved) onTradeApproved(opp);
    markExecuted(opp.id);
  };

  // Helper pour extraire le symbole et le solde
  const getBalanceInfo = (pair: string) => {
    const symbol = pair.split('/')[0];
    return balances[symbol];
  };

  return (
    <div className="space-y-4">
      {/* Résumé des soldes (si wallet connecté) */}
      {isConnected && Object.keys(balances).length > 0 && (
        <div className="bg-gray-800/30 p-3 rounded-lg border border-white/5">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
            <Wallet className="w-3 h-3" />
            Soldes disponibles pour auto-trading (min. $20) :
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(balances).map(coin => (
              <span 
                key={coin.symbol}
                className={`px-2 py-1 text-xs rounded font-mono flex items-center gap-1 ${
                  coin.hasMin20 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                }`}
                title={`${coin.balance} ${coin.symbol} ≈ $${coin.balanceUSD}`}
              >
                {coin.symbol}: ${coin.balanceUSD} {coin.hasMin20 && '✓'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800/50 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
          <h2 className="text-lg font-bold text-white">Scanner IA {isPaused ? 'En Pause' : 'Actif'}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-3 text-xs">
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-400">Scans: </span><span className="text-white font-bold">{count}</span>
            </div>
            <div className="bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700">
              <span className="text-gray-400">Auto: </span><span className="text-green-400 font-bold">{auto}</span>
            </div>
          </div>
          <button onClick={togglePause} className="px-4 py-2 rounded-lg font-bold text-sm border transition-colors"
            style={{ backgroundColor: isPaused ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: isPaused ? '#f87171' : '#4ade80', borderColor: isPaused ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)', minWidth: '110px' }}>
            {isPaused ? '▶ Activer' : '⏸ Pause'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between text-xs text-gray-400 px-2">
        <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3" />Dernier: {last}</span>
        <span className={isPaused ? 'text-gray-500' : 'text-amber-400'}>{isPaused ? 'Arrêté' : 'Prochain: 30s'}</span>
      </div>

      {/* Liste des opportunités */}
      <div className="space-y-3">
        {data.map((opp) => {
          const isDone = isExecuted(opp.id);
          const balanceInfo = getBalanceInfo(opp.pair);
          
          return (
            <div key={`${opp.id}-${opp.pair}`} className={`p-4 rounded-xl border ${isDone ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-900/60 border-white/10'}`}>
              <div className="flex flex-col lg:flex-row gap-4">
                
                {/* Info principale */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-bold text-white text-lg">{opp.pair}</span>
                    <span className={`px-2 py-0.5 text-xs rounded font-bold ${opp.direction === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {opp.direction === 'BUY' ? 'ACHAT' : 'VENTE'}
                    </span>
                    {opp.isGreenSignal && <span className="px-2 py-0.5 text-xs bg-green-500 text-black rounded font-bold animate-pulse">✓ SIGNAL VERT</span>}
                    <span className={`px-2 py-0.5 text-xs rounded ${opp.momentum === 'strong' ? 'bg-purple-500/20 text-purple-400' : opp.momentum === 'moderate' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {opp.momentum === 'strong' ? '🚀 Strong' : opp.momentum === 'moderate' ? '⚡ Moderate' : '🐌 Weak'}
                    </span>
                    
                    {/* Badge de solde */}
                    {balanceInfo && (
                      <span className={`px-2 py-0.5 text-xs rounded font-bold flex items-center gap-1 border ${
                        balanceInfo.hasMin20 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`} title={`${balanceInfo.balance} ${opp.pair.split('/')[0]}`}>
                        💰 ${balanceInfo.balanceUSD} {balanceInfo.hasMin20 ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{opp.explanation}</p>
                  
                  {/* Paramètres calculés par l'IA */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-gray-500 flex items-center gap-1"><Target className="w-3 h-3"/> Entry</p>
                      <p className="font-mono text-white font-bold">${opp.entryPrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      <p className="text-gray-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Stop Loss</p>
                      <p className="font-mono text-red-400 font-bold">${opp.slPrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                      <p className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Take Profit</p>
                      <p className="font-mono text-green-400 font-bold">${opp.tpPrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      <p className="text-gray-500">Risque</p>
                      <p className="font-mono text-amber-400 font-bold">{opp.riskPercent}% (${opp.riskAmount})</p>
                    </div>
                  </div>
                </div>

                {/* Stats droite */}
                <div className="flex lg:flex-col gap-4 lg:gap-2 items-center lg:items-end justify-between lg:justify-center min-w-[140px]">
                  <div className="text-center lg:text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Confiance IA</p>
                    <p className={`text-xl font-bold ${opp.confidence >= 75 ? 'text-green-400' : opp.confidence >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{opp.confidence}%</p>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Ratio R:R</p>
                    <p className={`text-xl font-bold ${opp.rrRatio >= 2 ? 'text-green-400' : 'text-amber-400'}`}>{opp.rrRatio}x</p>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-[10px] text-gray-500 uppercase">Gain Potentiel</p>
                    <p className="text-xl font-bold text-amber-400">{opp.expectedReturn}</p>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center">
                  {isDone ? (
                    <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-2 rounded-lg border border-green-500/30">
                      <CheckCircle className="w-4 h-4" /><span className="font-bold text-sm">Exécuté</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleValidate(opp)} 
                      className={`px-6 py-2 rounded-lg font-bold text-sm ${opp.direction === 'BUY' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white transition whitespace-nowrap ${!balanceInfo?.hasMin20 ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={!balanceInfo?.hasMin20}
                      title={!balanceInfo?.hasMin20 ? `Solde insuffisant: $${balanceInfo?.balanceUSD ?? 0} < $20` : 'Valider ce trade'}
                    >
                      {balanceInfo?.hasMin20 ? 'Valider' : 'Solde < $20'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300">
        <Zap className="w-4 h-4 inline mr-2" />
        IA Active: Auto-exécution uniquement si solde ≥ $20 • Paramètres optimisés en temps réel
      </div>
    </div>
  );
}