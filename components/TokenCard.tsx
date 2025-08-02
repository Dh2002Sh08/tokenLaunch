import React from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Star } from 'lucide-react';

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

interface TokenCardProps {
  token: Token;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const isPositive = token.change >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25">
            <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{token.name}</h3>
            <p className="text-gray-400 text-sm">${token.symbol}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Star className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Price</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">
              ${token.price < 1 ? token.price.toFixed(6) : token.price.toFixed(2)}
            </span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{token.change.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Market Cap</span>
          <span className="text-white font-medium">{token.marketCap}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Volume</span>
          <span className="text-white font-medium">{token.volume}</span>
        </div>

        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">
              Created by <span className="text-purple-400 hover:text-purple-300 cursor-pointer">{token.creator}</span>
            </p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-xs">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;