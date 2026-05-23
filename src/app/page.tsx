'use client';

import { useState, useCallback } from 'react';
import { ConnectButton } from '@/components/ConnectButton';
import { BalanceDisplay } from '@/components/BalanceDisplay';
import { RiskCalculator } from '@/components/RiskCalculator';
import { TradeExecutor } from '@/components/TradeExecutor';
import { TradeJournal } from '@/components/TradeJournal';
import { PriceChart } from '@/components/PriceChart';
import { AIOpportunityScanner } from '@/components/AIOpportunityScanner';
import { Shield, TrendingUp, Activity, AlertTriangle, BarChart3, Brain, BookOpen } from 'lucide-react';

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
    setTradeParams(result);
  }, []);

  const handleAITradeApproval = (opportunity: any) => {
    setTradeParams({
      positionSize: 100,
      entryPrice: opportunity.entryPrice,
      slPrice: opportunity.slPrice,
      tpPrice: opportunity.tpPrice,
      riskAmount: 20,
      rrRatio: (opportunity.tpPrice - opportunity.entryPrice) / (opportunity.entryPrice - opportunity.slPrice),
    });
    setActiveTab('chart'); // Switch to chart to show execution
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  };

  return (
    <main className="min-h-screen pb-20 bg-[#050505] text-white selection:bg-amber-500/30">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-700 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <TrendingUp className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                TRADER <span className="text-amber-400">PRO</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">by Tarek Boussebci</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Portefeuille", value: "$1,245.00", icon: <Shield className="w-5 h-5 text-amber-400" />, change: "+2.4%", color: "text-amber-400" },
            { label: "Profit 24h", value: "+$45.20", icon: <TrendingUp className="w-5 h-5 text-green-400" />, change: "+12%", color: "text-green-400" },
            { label: "Trades Gagnés", value: "85%", icon: <Activity className="w-5 h-5 text-blue-400" />, change: "+2", color: "text-blue-400" },
            { label: "Risque Max", value: "1.2%", icon: <AlertTriangle className="w-5 h-5 text-red-400" />, change: "Safe", color: "text-red-400" },
          ].map((stat, i) => (
            <div key={i} className="card-glass group hover:bg-white/5">
              <div className="flex justify-between items-start mb-3">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition">{stat.icon}</div>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className={`text-xs font-bold mt-1 ${stat.color}`}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <div className="flex gap-1">
            {[
              { id: 'chart', label: 'Analyse Technique', icon: <BarChart3 className="w-4 h-4"/> },
              { id: 'ai', label: 'AI Opportunities', icon: <Brain className="w-4 h-4"/> },
              { id: 'journal', label: 'Journal', icon: <BookOpen className="w-4 h-4"/> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id 
                    ? 'text-amber-400 border-amber-400 bg-white/5' 
                    : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-600 font-medium">v2.0 • Luxury Edition</div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Charts / AI) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'chart' && <PriceChart />}
            {activeTab === 'ai' && <AIOpportunityScanner onTradeApproved={handleAITradeApproval} />}
            {activeTab === 'journal' && (
              <div className="card-glass">
                <TradeJournal />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Controls) */}
          <div className="space-y-6">
            <div className="card-glass">
              <RiskCalculator onResult={handleRiskResult} />
            </div>
            
            <div className="card-glass">
              <TradeExecutor {...tradeParams} />
            </div>
            
            <div className="card-glass">
              <BalanceDisplay />
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 py-8 text-center border-t border-white/5 bg-black/20">
        <p className="text-xs text-gray-600 font-medium">
          © 2026 TraderPro — Developed with precision by <span className="text-amber-500">Tarek Boussebci</span>
        </p>
      </footer>
    </main>
  );
}