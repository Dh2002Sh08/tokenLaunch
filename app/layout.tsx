"use client";
import Sidebar from '@/components/Sidebar';
// import Sidebar from '../components/Sidebar';
import './globals.css';
import { SolanaWalletProvider } from "@/components/WalletProvider";
import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  // Canvas particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const particleCount = 3;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: Math.random() * 5 + 2,
          color: Math.random() > 0.5 ? '#8b5cf6' : '#9ca3af', // Match dark theme
          life: 60,
        });
      }
    };

    // Animate particles
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.radius *= 0.98; // Shrink over time
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 60; // Fade out
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
    <html lang="en">
      <body className="bg-gray-900 text-white relative">
        <style jsx>{`
          .zigzag-pattern-layout {
            background: linear-gradient(135deg, #6b21a8 25%, transparent 25%) -10px 0,
                        linear-gradient(225deg, #6b21a8 25%, transparent 25%) -10px 0,
                        linear-gradient(315deg, #6b21a8 25%, transparent 25%),
                        linear-gradient(45deg, #6b21a8 25%, transparent 25%);
            background-size: 20px 20px;
            background-color: #1f2937;
            opacity: 0.15;
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
        <div className="zigzag-pattern-layout" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
          style={{ zIndex: 0 }}
        />
        <SolanaWalletProvider>
          <div className="flex min-h-screen bg-transparent text-white">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-6 md:p-8 overflow-auto hover:shake">
              {children}
            </main>
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}