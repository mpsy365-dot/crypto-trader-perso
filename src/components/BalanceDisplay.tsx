'use client';

import { useAccount, useBalance } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';

export function BalanceDisplay() {
  const { address } = useAccount();

  // Récupérer le solde BNB
  const { data: bnbBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: bscTestnet.id,
  });

  // Adresse USDT sur BSC Testnet
  const usdtAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';

  // Récupérer le solde USDT
  const { data: usdtBalance } = useBalance({
    address: address as `0x${string}`,
    token: usdtAddress as `0x${string}`,
    chainId: bscTestnet.id,
  });

  if (!address) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-center">💰 Tes Soldes</h2>
      
      <div className="space-y-3">
        {/* BNB */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">BNB</span>
            <span className="text-xl font-bold text-yellow-400">
              {bnbBalance?.formatted ? parseFloat(bnbBalance.formatted).toFixed(4) : '0.0000'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {bnbBalance?.symbol || 'BNB'}
          </p>
        </div>

        {/* USDT */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">USDT</span>
            <span className="text-xl font-bold text-green-400">
              {usdtBalance?.formatted ? parseFloat(usdtBalance.formatted).toFixed(2) : '0.00'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {usdtBalance?.symbol || 'USDT'} (Testnet)
          </p>
        </div>
      </div>

      {/* Info Testnet */}
      <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
        <p className="text-xs text-yellow-400 text-center">
          ⚠️ Tu es sur le <strong>Testnet BSC</strong> - Utilise le faucet pour obtenir des BNB test
        </p>
      </div>

      {/* Lien vers le faucet */}
      <div className="mt-3 text-center">
        <a
          href="https://testnet.binance.org/faucet-smart"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          🚰 Obtenir des BNB gratuits (Faucet)
        </a>
      </div>
    </div>
  );
}