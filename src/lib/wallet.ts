// src/lib/wallet.ts
import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains'; // CHANGEMENT: bsc au lieu de bscTestnet

export const publicClient = createPublicClient({
  chain: bsc, // CHANGEMENT: Mainnet
  transport: http(),
});