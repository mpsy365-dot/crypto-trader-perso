'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';

// Importe la configuration que nous venons de créer
import { config } from '@/config/wagmi';

export function Providers(props: { children: ReactNode }) {
  // Crée une instance de QueryClient qui persiste entre les rendus
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}