'use client';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SolPrice from '../components/SolPrice';
import Analytics from '../components/Analytics';
import RecentTokens from '../components/RecentTokens';
import CreateToken from '../components/CreateToken';
import Help from '../components/Help';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateToken />;
      case 'help':
        return <Help />;
      default:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Real-time Solana token analytics and market data</p>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-sm mb-1">
                  Welcome back! 👋
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Live Data</span>
                </div>
              </div>
            </div>
            
            <SolPrice />
            <Analytics />
            <RecentTokens />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-64 min-h-screen">
        <main className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;