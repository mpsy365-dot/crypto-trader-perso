'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (!address) {
    return (
      <div className="flex gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
          >
            Connect Wallet
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="bg-gray-800 px-4 py-2 rounded-lg">
        <span className="text-sm font-mono text-green-400">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
      <button
        onClick={() => disconnect()}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
      >
        Disconnect
      </button>
    </div>
  );
}