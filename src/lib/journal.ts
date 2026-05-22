// src/lib/journal.ts
export interface TradeRecord {
  id: string;
  date: string;
  pair: string;
  entry: number;
  sl: number;
  tp: number;
  risk: number;
  position: number;
  ratio: number;
  status: 'success' | 'failed';
  mode: 'demo' | 'real';
}

const STORAGE_KEY = 'trader_perso_journal';

export function saveTrade(trade: TradeRecord) {
  const existing = getJournal();
  existing.unshift(trade); // Ajoute au début (plus récent en haut)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getJournal(): TradeRecord[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearJournal() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}