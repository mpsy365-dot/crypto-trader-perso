'use client';

import { useEffect, useState } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi';
import { config } from '@/config/wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined');
}

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        themeMode: 'dark',
        enableAnalytics: false,
      });
      setInitialized(true);
    }
  }, [initialized]);

  return <>{children}</>;
}