import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchSolPrice, formatNumber, formatPercentage } from '../services/api';

const SolPrice: React.FC = () => {
  const [solData, setSolData] = useState({
    price: 98.45,
    change24h: 2.34,
    volume24h: 1250000,
    marketCap: 45000000000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchSolPrice();
      setSolData(data);
      setLoading(false);
    };

    // Fetch initial data
    fetchData();

    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = solData.change24h >= 0;
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-gray-400 text-sm font-medium">SOL/USD</h3>
            {loading && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">
              ${solData.price.toFixed(2)}
            </span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{formatPercentage(solData.change24h)}</span>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">24h Volume:</span>
              <span className="text-gray-300">{formatNumber(solData.volume24h)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Market Cap:</span>
              <span className="text-gray-300">{formatNumber(solData.marketCap)}</span>
            </div>
          </div>
        </div>
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">SOL</span>
        </div>
      </div>
    </div>
  );
};

export default SolPrice;