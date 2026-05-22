'use client';
import { useState, useEffect } from 'react';
import { getJournal, clearJournal, TradeRecord } from '@/lib/journal';

export function TradeJournal() {
  const [trades, setTrades] = useState<TradeRecord[]>([]);

  useEffect(() => {
    setTrades(getJournal());
  }, []);

  const refresh = () => setTrades(getJournal());

  return (
    <div className="mt-8 w-full max-w-2xl bg-gray-900 p-6 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">📓 Journal de Trading</h2>
        <button onClick={refresh} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition">🔄 Actualiser</button>
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-lg">
          <p className="text-2xl mb-2">📭</p>
          <p>Aucun trade enregistré. Lance ton premier trade !</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Paire</th>
                <th className="py-2 px-2">Position</th>
                <th className="py-2 px-2">Risque</th>
                <th className="py-2 px-2">R:R</th>
                <th className="py-2 px-2">Mode</th>
                <th className="py-2 px-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-2 px-2 text-gray-300">{new Date(t.date).toLocaleString()}</td>
                  <td className="py-2 px-2 font-medium">{t.pair || 'N/A'}</td>
                  <td className="py-2 px-2 text-blue-400 font-mono">
                    ${(t.position || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-red-400 font-mono">
                    -${(t.risk || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 text-green-400 font-mono">
                    1 : {(t.ratio || 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      t.mode === 'demo' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {t.mode?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      t.status === 'success' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {t.status === 'success' ? '✅ SUCCÈS' : '❌ ÉCHEC'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {trades.length > 0 && (
        <button 
          onClick={() => { clearJournal(); setTrades([]); }} 
          className="mt-4 text-xs text-red-500 hover:text-red-400 hover:underline transition"
        >
          🗑️ Vider l'historique
        </button>
      )}
    </div>
  );
}