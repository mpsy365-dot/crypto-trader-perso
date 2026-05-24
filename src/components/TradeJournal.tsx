'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Trash2 } from 'lucide-react';

interface Trade {
  id: string;
  date: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  entryPrice?: number;
  exit?: number;
  sl?: number;
  tp?: number;
  position: number;
  risk: number;
  profit?: number;
  status: 'pending' | 'success' | 'failed';
  mode: 'demo' | 'real';
}

export function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les trades depuis localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('traderPro_trades');
    if (savedTrades) {
      try {
        const parsed = JSON.parse(savedTrades);
        setTrades(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Erreur lecture trades:', e);
        setTrades([]);
      }
    }
    setLoading(false);
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('traderPro_trades', JSON.stringify(trades));
    }
  }, [trades, loading]);

  // Helper pour obtenir le prix d'entrée
  const getEntryPrice = (trade: Trade): number => {
    return trade.entryPrice ?? trade.entry ?? 0;
  };

  // Helper pour formater un prix en toute sécurité
  const formatPrice = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };

  // Calculer le profit total par jour
  const getDailyStats = () => {
    const stats: { [key: string]: { count: number; profit: number; wins: number; losses: number } } = {};
    
    trades.forEach(trade => {
      if (trade.status === 'success' && trade.profit !== undefined) {
        const date = new Date(trade.date).toLocaleDateString('fr-FR');
        if (!stats[date]) {
          stats[date] = { count: 0, profit: 0, wins: 0, losses: 0 };
        }
        stats[date].count++;
        stats[date].profit += trade.profit;
        if (trade.profit > 0) stats[date].wins++;
        else stats[date].losses++;
      }
    });
    
    return stats;
  };

  // Calculer le profit total global
  const totalProfit = trades
    .filter(t => t.status === 'success' && t.profit !== undefined)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const totalTrades = trades.filter(t => t.status === 'success').length;
  const winRate = totalTrades > 0 
    ? ((trades.filter(t => (t.profit || 0) > 0).length / totalTrades) * 100).toFixed(1)
    : '0.0';

  const clearHistory = () => {
    if (confirm('Supprimer tout l\'historique ?')) {
      setTrades([]);
      localStorage.removeItem('traderPro_trades');
    }
  };

  const refreshTrades = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  const dailyStats = getDailyStats();

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="bg-purple-500/20 p-2 rounded-lg">📊</span>
          Journal de Trading
        </h2>
        <div className="flex gap-2">
          <button
            onClick={refreshTrades}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center gap-2 border border-blue-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2 border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Vider
          </button>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-xs mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{totalTrades}</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-xs mb-1">Win Rate</p>
          <p className={`text-2xl font-bold ${parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            {winRate}%
          </p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-xs mb-1">Profit Total</p>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-xs mb-1">Jours actifs</p>
          <p className="text-2xl font-bold text-white">{Object.keys(dailyStats).length}</p>
        </div>
      </div>

      {/* Stats par jour */}
      {Object.entries(dailyStats).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Résumé par jour
          </h3>
          <div className="grid gap-3">
            {Object.entries(dailyStats).sort((a, b) => b[0].localeCompare(a[0])).map(([date, stats]) => (
              <div key={date} className="bg-gray-800/30 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{date}</span>
                    <span className="text-gray-400 text-sm">{stats.count} trades</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-green-400 text-sm">✓ {stats.wins}</span>
                    <span className="text-red-400 text-sm">✗ {stats.losses}</span>
                    <span className={`font-bold text-lg ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${stats.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des trades */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Historique des opérations
        </h3>

        {trades.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-white/5">
            <p className="text-gray-400">Aucun trade enregistré. Lance ton premier trade !</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {trades.slice().reverse().map((trade, index) => {
              // 🔐 SÉCURITÉ CLÉ : Génère une clé unique même si trade.id est dupliqué ou manquant
              const safeKey = trade.id 
                ? `${trade.id}-${index}-${Date.now()}` 
                : `fallback-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
              
              const entryPrice = getEntryPrice(trade);
              const profit = trade.profit ?? 0;
              
              return (
                <div
                  key={safeKey} // ← Clé garantie unique ✅
                  className={`p-4 rounded-xl border transition-all ${
                    trade.status === 'success'
                      ? profit > 0
                        ? 'bg-green-900/10 border-green-500/30'
                        : profit < 0
                        ? 'bg-red-900/10 border-red-500/30'
                        : 'bg-gray-800/50 border-white/10'
                      : 'bg-gray-800/30 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-white text-lg">{trade.pair}</span>
                        <span className={`px-2 py-0.5 text-xs rounded font-bold ${
                          trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.type === 'BUY' ? 'ACHAT' : 'VENTE'}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded font-bold ${
                          trade.mode === 'demo' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {trade.mode === 'demo' ? 'DÉMO' : 'RÉEL'}
                        </span>
                        {trade.status === 'success' && (
                          <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400 font-bold">
                            ✓ SUCCÈS
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Date/Heure</p>
                          <p className="text-gray-300 font-mono">
                            {new Date(trade.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Position</p>
                          <p className="text-white font-mono">${formatPrice(trade.position)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Entrée</p>
                          <p className="text-white font-mono">${formatPrice(entryPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Risque</p>
                          <p className="text-red-400 font-mono">${formatPrice(trade.risk)}</p>
                        </div>
                      </div>
                    </div>

                    {trade.status === 'success' && (
                      <div className="ml-4 text-right">
                        <p className="text-gray-500 text-xs mb-1">Résultat</p>
                        <p className={`text-2xl font-bold flex items-center gap-1 ${
                          profit > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {profit > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          ${formatPrice(profit)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}