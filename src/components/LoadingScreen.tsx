import React, { useEffect, useState } from 'react';
import { Sun, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Aligning 400W Monocrystalline Solar Roof...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next >= 100) {
          clearInterval(timer);
          setStatusText('1.2 kWh LiFePO4 Core Online • Cartwala Ready!');
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }

        if (next > 75) {
          setStatusText('Activating 4°C Ice-Free Cold Bay & 10W PA Soundbox...');
        } else if (next > 45) {
          setStatusText('Connecting PM SVANidhi 7% Subsidy Database...');
        } else if (next > 20) {
          setStatusText('Harvesting 2.2 kWh Solar Photons...');
        }
        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#FAF7F2] transition-opacity duration-600 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Animated Sun Flare Rays */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#FFB800]/25 via-[#E63946]/15 to-[#FFB800]/25 blur-3xl animate-[spin_20s_linear_infinite] pointer-events-none" />

      {/* Center Solar Emblem with Pulsing Corona & SVG Drawing */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer Rotating Sun Corona */}
        <div className="absolute w-36 h-36 rounded-full border-2 border-dashed border-[#FFB800] animate-[spin_12s_linear_infinite]" />
        <div className="absolute w-44 h-44 rounded-full border border-amber-300/40 animate-[spin_20s_linear_infinite_reverse]" />

        {/* Radiating Sun Beams */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              transform: `rotate(${i * 30}deg) translateY(-28px)`,
            }}
            className="absolute w-1 h-3.5 bg-gradient-to-t from-[#FFB800] to-transparent rounded-full animate-pulse"
          />
        ))}

        {/* Central Sun Disc */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FFB800] via-[#FFA000] to-[#E63946] flex items-center justify-center shadow-2xl shadow-[#FFB800]/50 animate-bounce duration-1000">
          <Sun className="w-12 h-12 text-white animate-spin duration-3000" />
        </div>
      </div>

      {/* Brand Title with Letter Reveal */}
      <div className="text-center space-y-1 z-10">
        <h1 className="font-heading font-black text-4xl sm:text-5xl text-[#1E1E24] tracking-tight">
          Cart<span className="text-[#E63946]">वाला</span>
        </h1>
        <p className="text-xs font-bold text-[#837560] tracking-widest uppercase">
          Chhoti Cart. Badi Soch.
        </p>
      </div>

      {/* Loading Progress Bar & Percentage Counter */}
      <div className="w-64 sm:w-80 mt-8 space-y-2.5 z-10">
        <div className="flex items-center justify-between text-xs font-bold text-[#1E1E24]">
          <span className="flex items-center space-x-1.5 text-[11px] text-[#7c5800]">
            <Zap className="w-3.5 h-3.5 text-[#FFB800] fill-[#FFB800] animate-pulse" />
            <span>Solar Boot Sequence</span>
          </span>
          <span className="font-mono text-sm font-black text-[#E63946]">
            {progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2.5 bg-neutral-200/80 rounded-full overflow-hidden p-0.5 border border-[#F2EAE0]">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#E63946] rounded-full transition-all duration-100 relative shadow-sm"
          >
            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/70 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="text-[11px] text-center text-[#514532] font-medium h-4 truncate">
          {statusText}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="absolute bottom-6 flex items-center space-x-3 text-[10px] font-bold text-[#837560]">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PM SVANidhi Approved</span>
        </span>
        <span>•</span>
        <span>Make in India 🇮🇳</span>
        <span>•</span>
        <span>AIS-156 Certified</span>
      </div>
    </div>
  );
};
