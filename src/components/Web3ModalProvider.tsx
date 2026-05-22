'use client';

import { useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from '@/config/wagmi';

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        themeMode: 'dark',
        enableAnalytics: false,
        defaultChain: 'eip155:56', // BSC Mainnet
        chains: [
          {
            chainNamespace: 'eip155',
            chainId: 56, // BSC Mainnet
            name: 'BNB Smart Chain',
            currency: 'BNB',
            explorer: 'https://bscscan.com',
            rpcUrl: 'https://bsc-dataseed.binance.org',
          },
          {
            chainNamespace: 'eip155',
            chainId: 137,
            name: 'Polygon',
            currency: 'MATIC',
            explorer: 'https://polygonscan.com',
            rpcUrl: 'https://polygon-rpc.com',
          },
        ],
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Initialisation...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}