import React from 'react';
import { MessageCircle, Book, Video, Mail } from 'lucide-react';

const Help: React.FC = () => {
  const helpItems = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Learn how to create and manage tokens',
      link: '#',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      link: '#',
    },
    {
      icon: MessageCircle,
      title: 'Community',
      description: 'Join our Discord community',
      link: '#',
    },
    {
      icon: Mail,
      title: 'Support',
      description: 'Get help from our team',
      link: '#',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Help Center</h1>
        <p className="text-gray-400">Get the support you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-white font-medium mb-2">How much does it cost to create a token?</h3>
            <p className="text-gray-400 text-sm">Creating a token costs 0.1 SOL, which covers the Solana network fees and our platform fee.</p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-white font-medium mb-2">How long does token creation take?</h3>
            <p className="text-gray-400 text-sm">Token creation is instant! Once you submit your token details, it will be deployed to the Solana blockchain within seconds.</p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="text-white font-medium mb-2">Can I edit my token after creation?</h3>
            <p className="text-gray-400 text-sm">Some metadata like name and description can be updated, but core properties like supply and decimals cannot be changed after deployment.</p>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-2">How do I add liquidity to my token?</h3>
            <p className="text-gray-400 text-sm">After creating your token, you can add liquidity on popular DEXs like Raydium or Orca to enable trading.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;