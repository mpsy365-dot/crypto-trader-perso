import { bsc } from 'wagmi/chains';

export const web3ModalConfig = {
  themeMode: 'dark',
  enableAnalytics: false,
  defaultChain: bsc,
  chains: [
    {
      chainNamespace: 'eip155',
      chainId: '0x38', // BSC Mainnet
    },
  ],
};