'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, Home, Plus } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile toggle
  const [isMinimized, setIsMinimized] = useState(false); // Desktop minimize

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        className="md:hidden p-4 bg-gray-800 fixed top-0 left-0 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} color="#8b5cf6" /> : <Menu size={24} color="#8b5cf6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 p-4 transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static ${isMinimized ? 'md:w-16' : 'md:w-64'} md:flex md:flex-col z-40 min-h-screen overflow-visible`}
      >
        <style jsx>{`
          .zigzag-pattern-sidebar {
            background: linear-gradient(135deg, #8b5cf6 25%, transparent 25%) -10px 0,
                        linear-gradient(225deg, #8b5cf6 25%, transparent 25%) -10px 0,
                        linear-gradient(315deg, #8b5cf6 25%, transparent 25%),
                        linear-gradient(45deg, #8b5cf6 25%, transparent 25%);
            background-size: 20px 20px;
            background-color: #1f2937;
            opacity: 0.3;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
          }
          @keyframes shake {
            0% { transform: translate(0, 0) rotate(0deg); }
            10% { transform: translate(-2px, -2px) rotate(-1deg); }
            20% { transform: translate(2px, 2px) rotate(1deg); }
            30% { transform: translate(-2px, 2px) rotate(-1deg); }
            40% { transform: translate(2px, -2px) rotate(1deg); }
            50% { transform: translate(0, 0) rotate(0deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          .hover\:shake:hover {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
        <div className="zigzag-pattern-sidebar" />
        <div className="flex items-center justify-between mb-8">
          {!isMinimized && (
            <h1 className="text-2xl font-bold text-white mt-12 md:mt-0">Token Launch</h1>
          )}
          <button
            className="hidden md:block mt-12 md:mt-0 hover:shake"
            onClick={toggleMinimize}
            title={isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
          >
            {isMinimized ? (
              <ChevronRight size={24} color="#8b5cf6" />
            ) : (
              <ChevronLeft size={24} color="#8b5cf6" />
            )}
          </button>
        </div>
        <nav className="space-y-4">
          <Link
            href="/"
            className={`flex items-center justify-center py-2 rounded bg-purple-500 hover:bg-purple-600 text-white hover:shake ${
              isMinimized ? 'w-10 h-10 mx-auto' : 'px-4'
            }`}
            onClick={() => setIsOpen(false)}
            title={isMinimized ? 'Home' : ''}
          >
            <Home size={24} color="#ffffff" className={isMinimized ? '' : 'mr-2'} />
            {!isMinimized && <span className="text-white">Home</span>}
          </Link>
          <Link
            href="/createToken"
            className={`flex items-center justify-center py-2 rounded bg-purple-500 hover:bg-purple-600 text-white hover:shake ${
              isMinimized ? 'w-10 h-10 mx-auto' : 'px-4'
            }`}
            onClick={() => setIsOpen(false)}
            title={isMinimized ? 'Create Token' : ''}
          >
            <Plus size={24} color="#ffffff" className={isMinimized ? '' : 'mr-2'} />
            {!isMinimized && <span className="text-white">Create Token</span>}
          </Link>
        </nav>
      </div>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}