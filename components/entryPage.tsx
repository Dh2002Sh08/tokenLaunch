'use client';

import { useState, useEffect, useRef } from 'react';

interface Token {
  name: string;
  ticker: string;
  marketCap: number;
  kingOfTheHill: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
}

export default function TokenLaunchHome() {
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  const bgClasses = ["bg-gray-800", "bg-gray-900", "bg-gray-700", "bg-gray-800"];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgClasses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('/api/sol-price', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (isMounted) {
          if (data.error) throw new Error(data.error);
          setSolPrice(data.solana.usd);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to fetch SOL price${solPrice !== null ? ` (Last known: $${solPrice.toFixed(2)})` : ''}`);
          console.error('SOL price fetch error:', err);
        }
      }
    };
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setTokens([
      { name: 'MoonCoin', ticker: 'MOON', marketCap: 42000, kingOfTheHill: true },
      { name: 'StarToken', ticker: 'STAR', marketCap: 15000, kingOfTheHill: false },
      { name: 'PudgyPengu', ticker: 'PENGU', marketCap: 69000, kingOfTheHill: false },
      { name: 'AstroBucks', ticker: 'ASTRO', marketCap: 28000, kingOfTheHill: false },
      { name: 'CosmoCoin', ticker: 'COSMO', marketCap: 52000, kingOfTheHill: false },
      { name: 'RocketFuel', ticker: 'FUEL', marketCap: 37000, kingOfTheHill: false },
    ]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 5 + 2,
          color: Math.random() > 0.5 ? '#8b5cf6' : '#9ca3af',
          life: 60,
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.radius *= 0.98;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 60;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`relative min-h-screen transition-colors duration-1000 ${bgClasses[bgIndex]}`}>
      <style jsx>{`
        .zigzag-pattern {
          background: linear-gradient(135deg, #6b21a8 25%, transparent 25%) -10px 0,
                      linear-gradient(225deg, #6b21a8 25%, transparent 25%) -10px 0,
                      linear-gradient(315deg, #6b21a8 25%, transparent 25%),
                      linear-gradient(45deg, #6b21a8 25%, transparent 25%);
          background-size: 20px 20px;
          background-color: #1f2937;
          opacity: 0.2;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
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
      <div className="zigzag-pattern" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50 z-10"
      />
      <div className="relative max-w-7xl mx-auto px-6 py-10 space-y-10 z-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold text-white">Token Launch Platform</h1>
          <a
            href="https://docs.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg shadow hover:shake"
          >
            Documentation
          </a>
        </div>

        <div className="text-right text-xl font-semibold text-gray-300">
          Live Solana Price:{' '}
          <span className="text-purple-400">
            {error ? error : solPrice !== null ? `$${solPrice.toFixed(2)}` : 'Loading...'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-gray-900 shadow-xl rounded-xl p-6 border border-gray-700 transform hover:shake transition duration-300">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Total Tokens Created</h3>
            <p className="text-3xl font-bold text-purple-400">127</p>
          </div>

          <div className="bg-gray-900 shadow-xl rounded-xl p-6 border border-gray-700 transform hover:shake transition duration-300">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-purple-400">342</p>
          </div>

          <div className="bg-gray-900 shadow-xl rounded-xl p-6 border border-gray-700 transform hover:shake transition duration-300">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Top Gainer Today</h3>
            <p className="text-xl text-green-400 font-bold">Pumpzilla (PUMPZ)</p>
            <p className="text-sm text-gray-400">+248% in last 24 hours</p>
          </div>
        </div>

        <div className="bg-gray-900 shadow-xl rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-6">Recently Created Tokens</h3>
          {tokens.length > 0 ? (
            <ul className="space-y-4">
              {tokens.map((token, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 hover:shake transition"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-medium">
                      {token.name} ({token.ticker})
                    </span>
                    {token.kingOfTheHill && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                        King of the Hill
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 font-semibold">
                    ${token.marketCap.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No tokens available</p>
          )}
        </div>

        <div className="text-center mt-10">
          <p className="text-md text-gray-300">
            Ready to launch your token? Use the <strong>Create Token</strong> button in the sidebar to get started.
          </p>
        </div>
      </div>
    </div>
  );
}