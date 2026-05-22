'use client';

import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  price: number;
  type: 'above' | 'below';
  active: boolean;
  triggered: boolean;
}

export function PriceAlerts({ currentPrice }: { currentPrice: number }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newType, setNewType] = useState<'above' | 'below'>('above');

  // Demander la permission pour les notifications navigateur
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Vérifier les alertes à chaque changement de prix
  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.active || alert.triggered) return;

      const isTriggered = alert.type === 'above' 
        ? currentPrice >= alert.price 
        : currentPrice <= alert.price;

      if (isTriggered) {
        // Marquer comme déclenché
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, triggered: true } : a
        ));

        // Notification navigateur
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🔔 Alerte BNB/USDT`, {
            body: `Le prix a ${alert.type === 'above' ? 'dépassé' : 'chuté sous'} $${alert.price} !`,
            icon: '/favicon.ico'
          });
        }

        // Son d'alerte (optionnel)
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==');
          audio.play().catch(() => {});
        } catch (e) {}
      }
    });
  }, [currentPrice, alerts]);

  const addAlert = () => {
    const price = parseFloat(newPrice);
    if (!price || price <= 0) return;

    const alert: Alert = {
      id: Date.now().toString(),
      price,
      type: newType,
      active: true,
      triggered: false,
    };

    setAlerts([...alerts, alert]);
    setNewPrice('');
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const resetAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, triggered: false } : a
    ));
  };

  return (
    <div className="mt-8 w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🔔 Alertes de Prix
      </h2>

      {/* Formulaire d'ajout */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Prix cible (ex: 650)"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-white"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as 'above' | 'below')}
          className="bg-gray-800 border border-gray-700 rounded p-2 text-white"
        >
          <option value="above">Au-dessus ↑</option>
          <option value="below">En-dessous ↓</option>
        </select>
        <button
          onClick={addAlert}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded font-medium transition"
        >
          +
        </button>
      </div>

      {/* Liste des alertes */}
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Aucune alerte active</p>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 rounded-lg flex justify-between items-center ${
                alert.triggered ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-gray-800'
              }`}
            >
              <div>
                <span className={`font-mono font-bold ${
                  alert.type === 'above' ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${alert.price.toFixed(2)}
                </span>
                <span className="text-gray-400 text-sm ml-2">
                  {alert.type === 'above' ? '↑ Au-dessus' : '↓ En-dessous'}
                </span>
                {alert.triggered && (
                  <span className="ml-2 text-xs bg-yellow-600 px-2 py-0.5 rounded text-white">
                    ✅ DÉCLENCHÉ
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {alert.triggered && (
                  <button
                    onClick={() => resetAlert(alert.id)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition"
                  >
                    🔄 Reset
                  </button>
                )}
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-xs bg-red-900/50 hover:bg-red-900 text-red-300 px-2 py-1 rounded transition"
                >
                  ️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center">
        💡 Active les notifications du navigateur pour recevoir les alertes
      </p>
    </div>
  );
}