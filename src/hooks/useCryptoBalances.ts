'use client';

import { useAccount, useBalance } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { useMemo } from 'react';

// Liste des cryptos supportées avec leurs adresses de token (BSC)
export const SUPPORTED_COINS = [
  { symbol: 'BNB', name: 'BNB', address: undefined, decimals: 18 }, // Native
  { symbol: 'BTC', name: 'BTCB', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', decimals: 18 },
  { symbol: 'ETH', name: 'ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18 },
  { symbol: 'SOL', name: 'SOL', address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF', decimals: 18 },
  { symbol: 'XRP', name: 'XRP', address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE', decimals: 18 },
  { symbol: 'USDT', name: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18 },
];

// Prix approximatifs en USD (à remplacer par un oracle en prod)
const PRICES_USD: Record<string, number> = {
  BNB: 577,
  BTC: 65200,
  ETH: 3450,
  SOL: 148,
  XRP: 0.62,
  USDT: 1,
};

export function useCryptoBalances() {
  const { address } = useAccount();

  // Récupère les balances réelles depuis la blockchain
  const bnbBalance = useBalance({
    address,
    chainId: bsc.id,
  });

  const usdtBalance = useBalance({
    address,
    chainId: bsc.id,
    token: '0x55d398326f99059fF775485246999027B3197955',
  });

  // Construit l'objet balances avec les VRAIES données
  const balances = useMemo(() => {
    const result: Record<string, { symbol: string; balance: string; balanceUSD: number; hasMin20: boolean }> = {};
    
    // BNB
    const bnbFormatted = bnbBalance.data?.formatted ?? '0';
    const bnbUSD = parseFloat(bnbFormatted) * PRICES_USD.BNB;
    result.BNB = {
      symbol: 'BNB',
      balance: parseFloat(bnbFormatted).toFixed(4),
      balanceUSD: parseFloat(bnbUSD.toFixed(2)),
      hasMin20: bnbUSD >= 20,
    };

    // USDT
    const usdtFormatted = usdtBalance.data?.formatted ?? '0';
    const usdtUSD = parseFloat(usdtFormatted) * PRICES_USD.USDT;
    result.USDT = {
      symbol: 'USDT',
      balance: parseFloat(usdtFormatted).toFixed(4),
      balanceUSD: parseFloat(usdtUSD.toFixed(2)),
      hasMin20: usdtUSD >= 20,
    };

    // Autres cryptos (simulées à 0 pour l'instant)
    ['BTC', 'ETH', 'SOL', 'XRP'].forEach(symbol => {
      result[symbol] = {
        symbol,
        balance: '0.0000',
        balanceUSD: 0,
        hasMin20: false,
      };
    });
    
    return result;
  }, [bnbBalance.data, usdtBalance.data]);

  // Fonction pour vérifier si une crypto a assez de solde
  const hasSufficientBalance = (symbol: string, minUSD: number = 20): boolean => {
    return balances[symbol]?.hasMin20 ?? false;
  };

  return {
    balances,
    hasSufficientBalance,
    isConnected: !!address,
  };
}