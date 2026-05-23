'use client';

import { useState, useCallback } from 'react';
import { ConnectButton } from '@/components/ConnectButton';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { RiskCalculator } from '@/components/RiskCalculator';
import { TradeExecutor } from '@/components/TradeExecutor';
import { TradeJournal } from '@/components/TradeJournal';
import { PriceChart } from '@/components/PriceChart';
import { AIOpportunityScanner } from '@/components/AIOpportunityScanner';
import { AlertTriangle, Activity, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chart' | 'ai' | 'journal'>('chart');
  const [tradeParams, setTradeParams] = useState({
    positionSize: 0,
    entryPrice: 0,
    slPrice: 0,
    tpPrice: 0,
    riskAmount: 0,
    rrRatio: 0,
  });

  const handleRiskResult = useCallback((result: any) => {
   setTradeParams({
    ...result,
    amountToInvest: result.positionSize, // ← Ajoute cette ligne
   });
  }, []);

  const handleAITradeApproval = (opportunity: any) => {
    // Pré-remplir les données
    setTradeParams({
      positionSize: 100,
      entryPrice: opportunity.entryPrice,
      slPrice: opportunity.slPrice,
      tpPrice: opportunity.tpPrice,
      riskAmount: 20,
      rrRatio: (opportunity.tpPrice - opportunity.entryPrice) / (opportunity.entryPrice - opportunity.slPrice),
    });
    // Forcer le scroll ou l'ouverture de l'exécuteur
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pb-12">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-amber-700 p-2 rounded-lg">
              <TrendingUp className="text-black w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">TRADER <span className="text-amber-400">PRO</span></h1>
              <p className="text-xs text-gray-500 font-medium">by Tarek Boussebci</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              LIVE
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        
        {/* STATS RAPIDES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Portefeuille", value: "$1,245.00", icon: <Shield className="w-4 h-4 text-amber-400" />, change: "+2.4%" },
            { label: "Profit 24h", value: "+$45.20", icon: <TrendingUp className="w-4 h-4 text-green-400" />, change: "+12%" },
            { label: "Trades Gagnés", value: "85%", icon: <Activity className="w-4 h-4 text-blue-400" />, change: "+2" },
            { label: "Risque Max", value: "1.2%", icon: <AlertTriangle className="w-4 h-4 text-red-400" />, change: "Safe" },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-4 rounded-xl hover:border-white/20 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-xs font-medium uppercase">{stat.label}</span>
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-green-400 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-2 border-b border-white/10 pb-1">
          {[
            { id: 'chart', label: ' Analyse Technique', icon: '📈' },
            { id: 'ai', label: '🤖 AI Opportunities', icon: '🧠' },
            { id: 'journal', label: '📓 Journal', icon: '📒' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-t-lg text-sm font-bold transition flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white border-b-2 border-amber-400' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLONNE GAUCHE (Graphique / IA) */}
          <div className="lg:col-span-2">
            {activeTab === 'chart' && <PriceChart />}
            {activeTab === 'ai' && <AIOpportunityScanner onTradeApproved={handleAITradeApproval} />}
            {activeTab === 'journal' && <TradeJournal />}
          </div>

          {/* COLONNE DROITE (Risk & Execution) */}
          <div className="space-y-6">
            <RiskCalculator onResult={handleRiskResult} />
            <TradeExecutor 
              amountToInvest={tradeParams.positionSize}
              entryPrice={tradeParams.entryPrice}
              slPrice={tradeParams.slPrice}
              tpPrice={tradeParams.tpPrice}
              riskAmount={tradeParams.riskAmount}
              rrRatio={tradeParams.rrRatio}
            />
            <BalanceDisplay />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-12 py-6 text-center border-t border-white/5">
        <p className="text-xs text-gray-600">
          © 2026 TraderPro — Developed with precision by <span className="text-amber-500">Tarek Boussebci</span>
        </p>
      </footer>
    </main>
  );
}