import React, { useState, useEffect } from 'react';
import { Sun, Sparkles } from 'lucide-react';

export const PageScrollProgress: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState('Overview');

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));

      // Detect current active section based on scroll position
      const sections = [
        { id: 'home', label: 'Overview' },
        { id: 'the-cart', label: '3D Night Bazaar' },
        { id: 'horizontal-gallery', label: 'Bazaar Showcase' },
        { id: 'features', label: 'Engineering & Solar' },
        { id: 'growth-ladder', label: 'Growth Ladder' },
        { id: 'economics', label: 'Economics & ROI' },
        { id: 'build-cart', label: 'Configure Cart' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i].label);
            break;
          }
        }
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      {/* Top Floating Page Scroll Line Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-[100] h-1.5 bg-black/15 backdrop-blur-xs pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946] transition-[width] duration-75 ease-out relative"
          style={{ width: `${scrollPercent}%` }}
        >
          {/* Glowing Solar Head */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FFB800] shadow-[0_0_12px_#FFB800,0_0_24px_#E63946] border border-white" />
        </div>
      </div>

      {/* Discreet Section & Percentage Pill on Top Right (subtle, non-intrusive) */}
      <div className="fixed top-3 right-4 z-40 hidden sm:flex items-center space-x-1.5 bg-[#121826]/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-lg pointer-events-none transition-opacity duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
        <span className="text-[#FFB800] font-mono">{Math.round(scrollPercent)}%</span>
        <span className="text-zinc-400">•</span>
        <span className="text-zinc-200 truncate max-w-[120px]">{activeSection}</span>
      </div>
    </>
  );
};
