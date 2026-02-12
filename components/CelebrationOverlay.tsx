
import React, { useEffect, useState } from 'react';
import { Trophy, X, PartyPopper } from 'lucide-react';

interface CelebrationOverlayProps {
  onClose: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onClose }) => {
  /* Replaced JSX.Element with React.ReactElement to resolve namespace error */
  const [confetti, setConfetti] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    // Generate simple CSS confetti
    const newConfetti = Array.from({ length: 50 }).map((_, i) => {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 2;
      const duration = 2 + Math.random() * 3;
      const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <div 
          key={i}
          className="confetti"
          style={{
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${duration}s`,
            backgroundColor: color
          }}
        />
      );
    });
    setConfetti(newConfetti);

    // Auto close after 8 seconds?
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-700">
      {confetti}
      
      <div className="relative z-10 text-center space-y-8 max-w-2xl transform transition-all duration-700 scale-100 scale-up-in">
        <button 
          onClick={onClose}
          className="absolute -top-12 -right-12 p-2 text-slate-400 hover:text-white rounded-full transition-colors"
        >
          <X size={32} />
        </button>

        <div className="flex justify-center">
          <div className="h-32 w-32 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-bounce">
            <Trophy size={64} className="text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            WE WON!
          </h1>
          <p className="text-2xl text-blue-400 font-bold uppercase tracking-[0.3em]">
            Goal Achieved
          </p>
          <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
            Your agency just hit the revenue target! Take a moment to celebrate your incredible team's hard work and dedication.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-white text-slate-950 rounded-full font-black text-lg hover:bg-slate-200 transition-all shadow-xl shadow-white/10 flex items-center space-x-3"
          >
            <PartyPopper size={24} />
            <span>KEEP CRUSHING IT</span>
          </button>
        </div>
      </div>

      {/* "Cracker" effects - floating icons */}
      <div className="absolute top-1/4 left-1/4 animate-pulse opacity-50">
        <PartyPopper size={48} className="text-blue-500 rotate-12" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-pulse opacity-50 delay-700">
        <PartyPopper size={48} className="text-cyan-500 -rotate-12" />
      </div>
    </div>
  );
};

export default CelebrationOverlay;
