
import React, { useEffect, useState } from 'react';
import { Trophy, X, Zap, Code2, Binary } from 'lucide-react';

interface CelebrationOverlayProps {
  onClose: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onClose }) => {
  const [matrixRain, setMatrixRain] = useState<React.ReactElement[]>([]);
  const [particles, setParticles] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    // Generate Matrix-style code rain
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]();:=+-*/%$#@!&|^~';
    const rainColumns = Array.from({ length: 40 }).map((_, colIndex) => {
      const left = (colIndex / 40) * 100;
      const delay = Math.random() * 3;
      const duration = 3 + Math.random() * 4;
      const chars = Array.from({ length: 8 + Math.floor(Math.random() * 12) }).map((_, charIndex) => {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const opacity = (charIndex / 15) * 0.8;
        return (
          <span 
            key={charIndex}
            style={{ 
              opacity: Math.max(0.1, opacity),
              display: 'block',
              lineHeight: '1.2'
            }}
          >
            {char}
          </span>
        );
      });
      
      return (
        <div
          key={colIndex}
          className="matrix-rain"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          {chars}
        </div>
      );
    });
    setMatrixRain(rainColumns);

    // Generate particle explosion
    const particleElements = Array.from({ length: 30 }).map((_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const delay = Math.random() * 0.3;
      const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <div
          key={i}
          className="particle"
          style={{
            '--tx': `${x}px`,
            '--ty': `${y}px`,
            animationDelay: `${delay}s`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          } as React.CSSProperties}
        />
      );
    });
    setParticles(particleElements);

    // Auto close after 8 seconds
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-fade-in">
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {matrixRain}
      </div>
      
      {/* Particle Explosion */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles}
      </div>
      
      <div className="relative z-10 text-center space-y-8 max-w-2xl transform transition-all duration-700 scale-100 scale-up-in">
        <button 
          onClick={onClose}
          className="absolute -top-12 -right-12 p-2 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <X size={32} />
        </button>

        <div className="flex justify-center">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-500 to-cyan-400 rounded-full animate-ping opacity-75" />
            <div className="relative h-32 w-32 bg-linear-to-tr from-emerald-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.6)] animate-pulse border-2 border-emerald-400/50">
              <Trophy size={64} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black italic tracking-tighter bg-linear-to-b from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            MISSION COMPLETE
          </h1>
          <div className="flex items-center justify-center gap-3">
            <Code2 className="text-emerald-400 animate-pulse" size={24} />
            <p className="text-2xl text-emerald-400 font-bold uppercase tracking-[0.3em] font-mono">
              Goal Achieved
            </p>
            <Binary className="text-cyan-400 animate-pulse" size={24} />
          </div>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Your agency just hit the revenue target! Take a moment to celebrate your incredible team's hard work and dedication.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button 
            onClick={onClose}
            className="group px-10 py-4 bg-linear-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-full font-black text-lg transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-400/50 flex items-center space-x-3 border-2 border-emerald-400/50"
          >
            <Zap size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="font-mono">CONTINUE MISSION</span>
          </button>
        </div>
      </div>

      {/* Floating tech icons */}
      <div className="absolute top-1/4 left-1/4 animate-pulse opacity-30">
        <Code2 size={48} className="text-emerald-500 rotate-12" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse opacity-30" style={{ animationDelay: '0.7s' }}>
        <Binary size={48} className="text-cyan-500 -rotate-12" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-pulse opacity-20" style={{ animationDelay: '1.4s' }}>
        <Zap size={56} className="text-blue-500 rotate-45" />
      </div>
    </div>
  );
};

export default CelebrationOverlay;
