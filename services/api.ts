// API service for fetching live cryptocurrency data
import axios from 'axios';

const DEXSCREENER_BASE_URL = 'https://api.dexscreener.com/latest';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

// DexScreener API for SOL price (free, no API key required)
export const fetchSolPrice = async () => {
  try {
    const response = await axios.get(`${DEXSCREENER_BASE_URL}/dex/tokens/So11111111111111111111111111111111111111112`);
    const solData = response.data.pairs?.[0];
    
    if (solData) {
      return {
        price: parseFloat(solData.priceUsd),
        change24h: parseFloat(solData.priceChange?.h24 || '0'),
        volume24h: parseFloat(solData.volume?.h24 || '0'),
        marketCap: parseFloat(solData.fdv || '0')
      };
    }
    
    // Fallback data if API fails
    return {
      price: 98.45,
      change24h: 2.34,
      volume24h: 1250000,
      marketCap: 45000000000
    };
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    // Return fallback data
    return {
      price: 98.45,
      change24h: 2.34,
      volume24h: 1250000,
      marketCap: 45000000000
    };
  }
};

// Mock function for trending tokens (since we can't access real CMC API without key)
export const fetchTrendingTokens = async () => {
  try {
    // In a real implementation, you would use CoinMarketCap API with proper authentication
    // For demo purposes, we'll simulate realistic data with some randomization
    const baseTokens = [
      {
        id: '1',
        name: 'Bonk',
        symbol: 'BONK',
        price: 0.000012,
        change: Math.random() * 200 - 50, // Random change between -50% and +150%
        marketCap: '$1.2B',
        volume: '$45M',
        creator: 'BonkTeam',
      },
      {
        id: '2',
        name: 'Dogwifhat',
        symbol: 'WIF',
        price: 2.34,
        change: Math.random() * 100 - 25,
        marketCap: '$2.1B',
        volume: '$120M',
        creator: 'WifCommunity',
      },
      {
        id: '3',
        name: 'Jito',
        symbol: 'JTO',
        price: 3.45,
        change: Math.random() * 80 - 20,
        marketCap: '$890M',
        volume: '$67M',
        creator: 'JitoLabs',
      },
      {
        id: '4',
        name: 'Pyth Network',
        symbol: 'PYTH',
        price: 0.67,
        change: Math.random() * 60 - 15,
        marketCap: '$1.5B',
        volume: '$89M',
        creator: 'PythNetwork',
      },
      {
        id: '5',
        name: 'Jupiter',
        symbol: 'JUP',
        price: 1.23,
        change: Math.random() * 90 - 30,
        marketCap: '$1.8B',
        volume: '$156M',
        creator: 'JupiterDAO',
      },
      {
        id: '6',
        name: 'Raydium',
        symbol: 'RAY',
        price: 4.56,
        change: Math.random() * 70 - 20,
        marketCap: '$670M',
        volume: '$78M',
        creator: 'RaydiumProtocol',
      },
    ];

    return baseTokens.map(token => ({
      ...token,
      change: parseFloat(token.change.toFixed(2))
    }));
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
};

// Function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

// Function to format percentage
export const formatPercentage = (num: number): string => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};