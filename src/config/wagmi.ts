import { createConfig, http } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Configuration de Wagmi pour Next.js
export const config = createConfig({
  chains: [bsc], // Binance Smart Chain
  connectors: [
    injected({
      target: 'metaMask', // Détecte MetaMask, Trust Wallet, Binance Wallet, etc.
    }),
  ],
  transports: {
    [bsc.id]: http(),
  },
});