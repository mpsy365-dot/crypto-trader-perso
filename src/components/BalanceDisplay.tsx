'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { bsc } from 'wagmi/chains';

export function BalanceDisplay() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  // FIX HYDRATATION
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: bnbBalance } = useBalance({
    address,
    chainId: bsc.id,
  });

  const { data: usdtBalance } = useBalance({
    address,
    chainId: bsc.id,
    token: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
  });

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="text-center py-8 text-gray-400 bg-gray-900/60 rounded-xl border border-white/10">
        <p>Connecte ton wallet pour voir tes soldes</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Tes Soldes</h2>
      
      <div className="space-y-2">
        {/* BNB Balance */}
        <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-bold">BNB</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">BNB</p>
              <p className="text-xs text-gray-400">BSC</p>
            </div>
          </div>
          <p className="text-sm font-mono text-white">
            {bnbBalance ? parseFloat(bnbBalance.formatted).toFixed(4) : '0.0000'}
          </p>
        </div>

        {/* USDT Balance */}
        <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400 text-xs font-bold">USDT</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">USDT</p>
              <p className="text-xs text-gray-400">BSC</p>
            </div>
          </div>
          <p className="text-sm font-mono text-white">
            {usdtBalance ? parseFloat(usdtBalance.formatted).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}