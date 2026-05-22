'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wagmi';
import { useState } from 'react';
import { Web3ModalProvider } from '@/components/Web3ModalProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ModalProvider>
          {children}
        </Web3ModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}