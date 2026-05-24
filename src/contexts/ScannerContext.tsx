'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';

interface TradeOpportunity {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  slPrice: number;
  tpPrice: number;
  riskPercent: number;
  riskAmount: number;
  expectedReturn: string;
  rrRatio: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  volatility: number;
  momentum: 'strong' | 'moderate' | 'weak';
  explanation: string;
  isGreenSignal: boolean;
}

interface ScannerContextType {
  data: TradeOpportunity[];
  count: number;
  auto: number;
  last: string;
  isPaused: boolean;
  executed: Set<string>;
  togglePause: () => void;
  markExecuted: (id: string) => void;
  isExecuted: (id: string) => boolean;
}

const ScannerContext = createContext<ScannerContextType | undefined>(undefined);

const COINS = [
  { symbol: 'BTC/USDT', price: 65200, baseVolatility: 0.02 },
  { symbol: 'ETH/USDT', price: 3450, baseVolatility: 0.025 },
  { symbol: 'BNB/USDT', price: 577, baseVolatility: 0.03 },
  { symbol: 'SOL/USDT', price: 148, baseVolatility: 0.04 },
  { symbol: 'XRP/USDT', price: 0.62, baseVolatility: 0.03 }
];

// 🧠 FONCTION IA : Calcule les paramètres optimaux
const calculateOptimalParams = (
  coin: typeof COINS[0],
  direction: 'BUY' | 'SELL'
) => {
  // 1. Volatilité dynamique (simulée)
  const marketNoise = 0.95 + Math.random() * 0.1; // ±5%
  const volatility = coin.baseVolatility * marketNoise;
  
  // 2. Momentum (force du mouvement)
  const momentumScore = Math.random();
  const momentum: 'strong' | 'moderate' | 'weak' = 
    momentumScore > 0.7 ? 'strong' : momentumScore > 0.4 ? 'moderate' : 'weak';
  
  // 3. Calcul du Stop Loss (basé sur la volatilité)
  const slDistance = volatility * (momentum === 'strong' ? 1.5 : momentum === 'moderate' ? 2 : 3);
  const slPrice = direction === 'BUY' 
    ? coin.price * (1 - slDistance) 
    : coin.price * (1 + slDistance);
  
  // 4. Calcul du Take Profit (ratio 1:2 à 1:3 selon confiance)
  const baseRR = momentum === 'strong' ? 3 : momentum === 'moderate' ? 2.5 : 2;
  const rrRatio = baseRR + (Math.random() - 0.5) * 0.5; // ±0.25
  const tpDistance = slDistance * rrRatio;
  const tpPrice = direction === 'BUY'
    ? coin.price * (1 + tpDistance)
    : coin.price * (1 - tpDistance);
  
  // 5. Entry price (avec petite optimisation)
  const entryAdjustment = (Math.random() - 0.5) * 0.002; // ±0.2%
  const entryPrice = coin.price * (1 + entryAdjustment);
  
  // 6. Risque par trade (% du capital)
  const confidence = momentum === 'strong' ? 85 + Math.floor(Math.random() * 10) 
                 : momentum === 'moderate' ? 70 + Math.floor(Math.random() * 15)
                 : 50 + Math.floor(Math.random() * 20);
  
  const riskPercent = confidence >= 85 ? 0.5 : confidence >= 75 ? 1 : confidence >= 65 ? 1.5 : 2;
  const riskAmount = 100 * (riskPercent / 100); // Sur base de $100 capital virtuel
  
  // 7. Gain potentiel
  const gainPercent = ((Math.abs(tpPrice - entryPrice) / entryPrice) * 100);
  
  // 8. Niveau de risque
  const riskLevel: 'low' | 'medium' | 'high' = 
    riskPercent <= 1 ? 'low' : riskPercent <= 1.5 ? 'medium' : 'high';
  
  // 9. Signal vert ? (critères stricts)
  const isGreenSignal = confidence >= 75 && riskLevel === 'low' && rrRatio >= 2 && gainPercent >= 3;
  
  // 10. Explication intelligente
  const explanations = {
    BUY: {
      strong: "Breakout confirmé + volume en hausse + RSI oversold",
      moderate: "Rebond sur support majeur + divergence haussière",
      weak: "Consolidation avec biais haussier léger"
    },
    SELL: {
      strong: "Rejet sur résistance + volume vendeur + RSI overbought",
      moderate: "Cassure de support + momentum baissier",
      weak: "Correction technique après surachat"
    }
  };
  
  return {
    entryPrice: parseFloat(entryPrice.toFixed(2)),
    slPrice: parseFloat(slPrice.toFixed(2)),
    tpPrice: parseFloat(tpPrice.toFixed(2)),
    riskPercent: parseFloat(riskPercent.toFixed(2)),
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    expectedReturn: `+${gainPercent.toFixed(2)}%`,
    rrRatio: parseFloat(rrRatio.toFixed(2)),
    confidence,
    riskLevel,
    volatility: parseFloat(volatility.toFixed(4)),
    momentum,
    explanation: explanations[direction][momentum],
    isGreenSignal
  };
};

export function ScannerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<TradeOpportunity[]>([]);
  const [count, setCount] = useState(0);
  const [auto, setAuto] = useState(0);
  const [last, setLast] = useState(new Date().toLocaleTimeString());
  const [isPaused, setIsPaused] = useState(false);
  const [executed, setExecutedState] = useState<Set<string>>(new Set());
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);
  const executedRef = useRef<Set<string>>(new Set());
  const countRef = useRef(0);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const scan = useCallback(() => {
    if (isPausedRef.current) return;

    console.log(`🔍 Scan #${countRef.current + 1} - Analyse IA en cours...`);

    const newOpps: TradeOpportunity[] = COINS.map(coin => {
      const direction = Math.random() > 0.5 ? 'BUY' : 'SELL';
      
      // 🧠 Appel à l'IA de calcul des paramètres
      const params = calculateOptimalParams(coin, direction);
      
      return {
        id: `${coin.symbol}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pair: coin.symbol,
        direction,
        ...params
      };
    });

    setData(newOpps);
    setLast(new Date().toLocaleTimeString());
    countRef.current += 1;
    setCount(countRef.current);
    
    const greenCount = newOpps.filter(o => o.isGreenSignal).length;
    console.log(`✅ Scan #${countRef.current} terminé - ${greenCount}/5 signaux verts détectés`);
  }, []);

  useEffect(() => {
    console.log('🚀 Initialisation du Scanner IA...');
    scan();
    intervalRef.current = setInterval(() => {
      console.log('⏰ Nouveau cycle d\'analyse IA...');
      scan();
    }, 30000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [scan]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const newState = !prev;
      console.log(`🔄 Scanner ${newState ? 'en pause' : 'repris'}`);
      return newState;
    });
  }, []);
  
  const markExecuted = useCallback((id: string) => {
    if (!executedRef.current.has(id)) {
      executedRef.current.add(id);
      setExecutedState(new Set(executedRef.current));
      setAuto(a => a + 1);
      console.log(`✓ Trade ${id} exécuté`);
    }
  }, []);
  
  const isExecuted = useCallback((id: string) => executedRef.current.has(id), []);

  return (
    <ScannerContext.Provider value={{ 
      data, count, auto, last, isPaused, executed, 
      togglePause, markExecuted, isExecuted 
    }}>
      {children}
    </ScannerContext.Provider>
  );
}

export function useScanner() {
  const ctx = useContext(ScannerContext);
  if (!ctx) throw new Error('useScanner doit être utilisé dans ScannerProvider');
  return ctx;
}