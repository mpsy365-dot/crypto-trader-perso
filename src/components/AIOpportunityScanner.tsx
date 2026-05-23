'use client';

import { useState, useEffect } from 'react';
import { Brain, ArrowUpRight, ArrowDownRight, ShieldCheck, Zap } from 'lucide-react';

const COINS = [
  { symbol: 'BTC', price: 65000 },
  { symbol: 'ETH', price: 3400 },
  { symbol: 'BNB', price: 577 },
  { symbol: 'SOL', price: 145 },
  { symbol: 'XRP', price: 0.55 },
];

interface TradeOpportunity {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: string;
  explanation: string;
  reason: string;
}

export function AIOpportunityScanner({ onTradeApproved }: { onTradeApproved?: (trade: TradeOpportunity) => void }) {
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const scanMarket = async () => {
      setLoading(true);
      setScanProgress(0);
      
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setScanProgress(prev => prev < 90 ? prev + 10 : 90);
      }, 200);

      await new Promise(r => setTimeout(r, 2500));
      clearInterval(progressInterval);
      setScanProgress(100);

      const mockOpportunities: TradeOpportunity[] = [
        {
          id: '1',
          pair: 'SOL/USDT',
          direction: 'BUY',
          entryPrice: 145.20,
          tpPrice: 160.00,
          slPrice: 140.00,
          confidence: 88,
          riskLevel: 'low',
          expectedReturn: '+10.2%',
          explanation: 'Solana montre une force relative incroyable face au marché.',
          reason: '🚀 Breakout du triangle haussier'
        },
        {
          id: '2',
          pair: 'BTC/USDT',
          direction: 'SELL',
          entryPrice: 64800,
          tpPrice: 61000,
          slPrice: 66500,
          confidence: 72,
          riskLevel: 'medium',
          expectedReturn: '+5.8%',
          explanation: 'Le Bitcoin teste une résistance majeure historique.',
          reason: '⚠️ Divergence RSI baissière'
        },
        {
          id: '3',
          pair: 'ETH/USDT',
          direction: 'BUY',
          entryPrice: 3380,
          tpPrice: 3650,
          slPrice: 3250,
          confidence: 81,
          riskLevel: 'low',
          expectedReturn: '+8.0%',
          explanation: 'L\'Ethereum est sous-aché et prêt pour un rebond technique.',
          reason: '📉 Support fort validé 3 fois'
        }
      ];
      
      setOpportunities(mockOpportunities);
      setLoading(false);
    };
    
    scanMarket();
  }, []);

  const handleApprove = (opp: TradeOpportunity) => {
    if (onTradeApproved) onTradeApproved(opp);
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-xl text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-amber-400 animate-spin"></div>
          <Brain className="absolute inset-0 m-auto w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">L'IA Analyse le Marché</h3>
        <p className="text-gray-400 mb-6">Scan de {COINS.length} actifs majeurs en cours...</p>
        
        <div className="w-full max-w-xs mx-auto bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300" 
            style={{ width: `${scanProgress}%` }}
          ></div>
        </div>
        <span className="text-xs text-amber-400 font-mono">{scanProgress}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="bg-amber-500/20 p-1.5 rounded-lg">🧠</span>
          Opportunités Détectées
        </h2>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">
          Mis à jour à l'instant
        </span>
      </div>

      {/* Cartes d'opportunités */}
      {opportunities.map(opp => (
        <div key={opp.id} className="glass-panel rounded-xl p-5 relative overflow-hidden group hover:border-white/20 transition">
          {/* Bandeau couleur direction */}
          <div className={`absolute top-0 left-0 w-1 h-full ${opp.direction === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Info Gauche */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl font-bold text-white">{opp.pair}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  opp.direction === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {opp.direction === 'BUY' ? 'ACHETER' : 'VENDRE'}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {opp.confidence}% <ShieldCheck className="w-3 h-3 text-amber-400"/> Confiance
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-3 font-medium italic">"{opp.explanation}"</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-400">{opp.reason}</span>
              </div>
            </div>

            {/* Stats Droite */}
            <div className="flex flex-col justify-center items-end gap-3 min-w-[180px]">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Entrée</p>
                  <p className="font-mono text-sm text-white">${opp.entryPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Risque</p>
                  <p className={`font-mono text-sm ${opp.riskLevel === 'low' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {opp.riskLevel === 'low' ? 'Faible 🟢' : 'Moyen 🟡'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Take Profit</p>
                  <p className="font-mono text-sm text-green-400">${opp.tpPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Stop Loss</p>
                  <p className="font-mono text-sm text-red-400">${opp.slPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="w-full h-px bg-white/10 my-1"></div>
              
              <div className="text-right">
                <p className="text-[10px] uppercase text-gray-500">Gain Potentiel</p>
                <p className="text-xl font-bold text-green-400">{opp.expectedReturn}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
            <button 
              onClick={() => handleApprove(opp)}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                opp.direction === 'BUY' 
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white' 
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
              }`}
            >
              {opp.direction === 'BUY' ? <ArrowUpRight className="w-4 h-4"/> : <ArrowDownRight className="w-4 h-4"/>}
              Approuver & Exécuter
            </button>
            <button className="px-4 py-3 rounded-lg font-bold text-sm bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition">
              Ignorer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}