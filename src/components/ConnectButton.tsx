'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { useState, useEffect } from 'react';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-gray-800 rounded-lg text-gray-400">
        Chargement...
      </button>
    );
  }

  if (!address || !isConnected) {
    return (
      <button
        onClick={() => {
          if (connectors.length > 0) {
            connect({ connector: connectors[0] });
          }
        }}
        disabled={isPending || connectors.length === 0}
        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-lg transition shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Connexion...' : 'Connecter Wallet'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-sm font-mono text-green-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
      <button
        onClick={() => disconnect()}
        className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition"
      >
        Disconnect
      </button>
    </div>
  );
}