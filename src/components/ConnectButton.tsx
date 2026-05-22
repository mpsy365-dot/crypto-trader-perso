'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
      >
        Connecter Trust Wallet
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-400">Ton adresse wallet :</p>
        <p className="font-mono text-sm break-all mt-1">{address}</p>
      </div>
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
      >
        Déconnecter
      </button>
    </div>
  );
}