import React from 'react';
import { BarChart3, Users, Coins, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  // Simulate real-time analytics with some randomization
  const generateStats = () => {
    const baseStats = [
      {
        label: 'Total Tokens Created',
        baseValue: 12847,
        icon: Coins,
      },
      {
        label: 'Active Users',
        baseValue: 3921,
        icon: Users,
      },
      {
        label: 'Total Volume',
        baseValue: 2400000,
        icon: DollarSign,
      },
      {
        label: 'Market Cap',
        baseValue: 890000,
        icon: BarChart3,
      },
    ];

    return baseStats.map((stat) => {
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const currentValue = Math.floor(stat.baseValue * (1 + variation));
      const change = (variation * 100).toFixed(1);
      const isPositive = variation >= 0;

      let displayValue;
      if (stat.label.includes('Volume') || stat.label.includes('Market Cap')) {
        displayValue = currentValue >= 1000000 
          ? `$${(currentValue / 1000000).toFixed(1)}M`
          : `$${(currentValue / 1000).toFixed(0)}K`;
      } else {
        displayValue = currentValue.toLocaleString();
      }

      return {
        ...stat,
        value: displayValue,
        change: `${isPositive ? '+' : ''}${change}%`,
        positive: isPositive,
      };
    });
  };

  const stats = [
    ...generateStats()
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stat.positive ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
              }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Analytics;