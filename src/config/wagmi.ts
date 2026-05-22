import { createConfig, http } from 'wagmi';
import { bsc, polygon, bscTestnet, polygonAmoy } from 'wagmi/chains';
import { walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [bsc, polygon, bscTestnet, polygonAmoy],
  transports: {
    [bsc.id]: http(),
    [polygon.id]: http(),
    [bscTestnet.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      showQrModal: false,
    }),
  ],
});