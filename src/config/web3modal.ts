import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from './wagmi';

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID manquant');
}

createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  themeMode: 'dark',
  enableAnalytics: false,
  defaultChain: 'eip155:56', // BSC par défaut
  chains: [
    {
      chainNamespace: 'eip155',
      chainId: 56,
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