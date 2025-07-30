import { NextResponse } from 'next/server';

export async function GET() {
  const maxRetries = 3;
  let delay = 1000;
  const solanaContractAddress = 'So11111111111111111111111111111111111111112';

  // Try DEXScreener API
  for (let retries = maxRetries; retries > 0; retries--) {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${solanaContractAddress}`,
        { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new Error(`DEXScreener HTTP error: ${response.status}`);
      }
      const data = await response.json();
      if (!data.pairs || data.pairs.length === 0) {
        throw new Error('No SOL price data available');
      }
      // Use the first pair's price (assuming it's the most liquid, e.g., SOL/USDC)
      return NextResponse.json({ solana: { usd: parseFloat(data.pairs[0].priceUsd) } });
    } catch (err) {
      console.warn(`DEXScreener fetch failed (${retries} retries left): ${err}`);
      if (retries === 1) {
        // Mock fallback if DEXScreener fails
        console.warn('Falling back to mock SOL price');
        return NextResponse.json({ solana: { usd: 180.88 } });
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  return NextResponse.json({ error: 'Failed to fetch SOL price from DEXScreener' }, { status: 500 });
}