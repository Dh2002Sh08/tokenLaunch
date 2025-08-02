import React, { useState, useEffect } from 'react';
import TokenCard from './TokenCard';
import { fetchTrendingTokens } from '../services/api';

// Interface for the expected API response
interface ApiToken {
  id?: string;
  name?: string;
  symbol?: string;
  price?: number;
  change24h?: number;
  change?: number;
  volume24h?: number;
  volume?: number;
  marketCap?: number;
  image?: string;
  creator?: string;
}

// Interface for the TokenCard component
interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: string;
  volume: string;
  image: string;
  creator: string;
}

const RecentTokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true);
        const trendingTokens = await fetchTrendingTokens();
        if (!Array.isArray(trendingTokens)) {
          console.error('Invalid API response: trendingTokens is not an array');
          setTokens([]);
        } else {
          const mappedTokens = (trendingTokens as unknown as ApiToken[]).map((token) => ({
            id: token.id ?? `token-${Math.random()}`,
            name: token.name ?? 'Unknown',
            symbol: token.symbol ?? 'UNK',
            price: token.price ?? 0,
            change: token.change24h ?? token.change ?? 0,
            volume: (token.volume24h ?? token.volume ?? 0).toString(),
            marketCap: (token.marketCap ?? 0).toString(),
            image: token.image ?? '',
            creator: token.creator ?? 'Unknown',
          }));
          setTokens(mappedTokens);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();

    const interval = setInterval(loadTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-white">Trending Tokens</h2>
          {loading && (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
        <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
          View All
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token, index) => (
            <TokenCard key={token.id || `token-${index}`} token={token} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTokens;