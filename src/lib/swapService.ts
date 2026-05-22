// src/lib/swapService.ts
const API_KEY = process.env.NEXT_PUBLIC_1INCH_API_KEY;
const CHAIN_ID = 56; // BSC MAINNET (pas Testnet !)
const BASE_URL = 'https://api.1inch.dev/swap/v5.2';

// Tokens sur BSC MAINNET
const NATIVE_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'; // BNB natif
const USDT_MAINNET = '0x55d398326f99059fF775485246999027B3197955'; // USDT réel

export interface SwapResult {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  gas: bigint;
}

export async function prepareSwap(amountInBNB: number): Promise<SwapResult> {
  if (!API_KEY) {
    throw new Error("Clé API 1inch manquante");
  }

  try {
    const amountInWei = BigInt(Math.floor(amountInBNB * 1e18));
    
    const url = `${BASE_URL}/${CHAIN_ID}/swap?from=${NATIVE_TOKEN}&to=${USDT_MAINNET}&amount=${amountInWei.toString()}&slippage=1`;

    console.log("📡 Appel 1inch:", url);

    const response = await fetch(url, {
      headers: { 
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    return {
      to: data.tx.to,
      data: data.tx.data,
      value: BigInt(data.tx.value || "0"),
      gas: BigInt(data.tx.gas)
    };
  } catch (error: any) {
    console.error("💥 Erreur:", error);
    throw error;
  }
}