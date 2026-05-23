'use client';

import { useAccount, useBalance, useReadContract } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { erc20Abi, formatEther } from 'viem';

// Adresse USDT sur BSC Mainnet
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

export function BalanceDisplay() {
  const { address } = useAccount();

  // Balance BNB
  const { data: bnbBalance } = useBalance({
    address,
    chainId: bsc.id,
  });

  // Balance USDT via contrat ERC20
  const { data: usdtBalance } = useReadContract({
    address: USDT_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  if (!address) return null;

  // Conversion des balances
  const bnbFormatted = bnbBalance?.value ? formatEther(bnbBalance.value) : '0';
  const usdtFormatted = usdtBalance ? formatEther(usdtBalance as bigint) : '0';

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3">Tes Soldes</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <div>
            <p className="text-gray-400 text-sm">BNB</p>
            <p className="text-xs text-gray-500">BNB</p>
          </div>
          <p className="text-yellow-400 font-mono font-medium">
            {parseFloat(bnbFormatted).toFixed(4)}
          </p>
        </div>
        
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <div>
            <p className="text-gray-400 text-sm">USDT</p>
            <p className="text-xs text-gray-500">BSC</p>
          </div>
          <p className="text-green-400 font-mono font-medium">
            {parseFloat(usdtFormatted).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}