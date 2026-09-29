import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'animejs';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorMode, setCursorMode] = useState<
    'default' | 'nav' | 'link' | 'three' | 'gallery' | 'cta'
  >('default');
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop/fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;

      // 1. Navigation items detection (Custom Cursor on Nav)
      if (
        target?.closest('header nav') ||
        target?.closest('header a') ||
        target?.closest('header button') ||
        target?.closest('[data-cursor="nav"]')
      ) {
        setCursorMode('nav');
        setCursorText('SELECT');
      } else if (
        target?.closest('#three-canvas-container') ||
        target?.closest('.three-viewport') ||
        target?.closest('[data-cursor="3d"]')
      ) {
        setCursorMode('three');
        setCursorText('360°');
      } else if (
        target?.closest('#horizontal-gallery') ||
        target?.closest('.gallery-card') ||
        target?.closest('[data-cursor="gallery"]')
      ) {
        setCursorMode('gallery');
        setCursorText('VIEW');
      } else if (
        target?.closest('.btn-primary') ||
        target?.closest('[data-cursor="cta"]') ||
        (target?.closest('button') && target?.textContent?.includes('Configure'))
      ) {
        setCursorMode('cta');
        setCursorText('⚡');
      } else if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.classList.contains('cursor-pointer')
      ) {
        setCursorMode('link');
        setCursorText('');
      } else {
        setCursorMode('default');
        setCursorText('');
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      // Anime.js elastic pulse on click
      if (ringRef.current) {
        animate(ringRef.current, {
          scale: [0.75, 1],
          duration: 300,
          ease: 'outElastic(1, .6)',
        });
      }
    };

    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  // Smooth trailing spring physics for the outer indicator ring
  useEffect(() => {
    let animId: number;
    const follow = () => {
      setTrailingPos((prev) => {
        const factor = cursorMode === 'nav' ? 0.35 : 0.2;
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * factor,
          y: prev.y + dy * factor,
        };
      });
      animId = requestAnimationFrame(follow);
    };
    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [pos, cursorMode]);

  if (!isVisible) return null;

  // Determine styling based on cursor mode
  const isNav = cursorMode === 'nav';
  const is3D = cursorMode === 'three';
  const isGallery = cursorMode === 'gallery';
  const isCta = cursorMode === 'cta';
  const isInteractive = cursorMode !== 'default';

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Outer Follower Ring / Morphing Badge */}
      <div
        ref={ringRef}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 0.8 : isNav ? 1.4 : is3D ? 1.7 : isGallery ? 1.6 : isCta ? 1.5 : isInteractive ? 1.3 : 1
          })`,
          transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s',
        }}
        className={`absolute rounded-full flex items-center justify-center transition-all duration-200 ${
          isNav
            ? 'w-14 h-14 border-2 border-[#FFB800] bg-gradient-to-tr from-[#FFB800]/25 to-[#E63946]/20 backdrop-blur-xs shadow-[0_0_20px_rgba(255,184,0,0.5)]'
            : is3D
            ? 'w-16 h-16 border-2 border-dashed border-[#FFB800] bg-slate-900/60 backdrop-blur-xs shadow-[0_0_25px_rgba(255,184,0,0.4)]'
            : isGallery
            ? 'w-14 h-14 border-2 border-[#E63946] bg-[#E63946]/20 backdrop-blur-xs shadow-[0_0_20px_rgba(230,57,70,0.4)]'
            : isCta
            ? 'w-12 h-12 border-2 border-[#FFB800] bg-[#FFB800]/30 shadow-[0_0_15px_#FFB800]'
            : isInteractive
            ? 'w-10 h-10 border-2 border-[#FFB800] bg-[#FFB800]/15'
            : 'w-7 h-7 border border-[#FFB800]/70'
        }`}
      >
        {/* Nav / 3D / Gallery Text badge inside cursor */}
        {cursorText && (
          <span
            className={`font-black tracking-wider text-[9px] uppercase transition-all ${
              isNav
                ? 'text-[#1E1E24] bg-[#FFB800] px-1.5 py-0.5 rounded-full shadow-xs'
                : is3D
                ? 'text-[#FFB800] font-mono'
                : isGallery
                ? 'text-white font-bold'
                : 'text-[#1E1E24]'
            }`}
          >
            {cursorText}
          </span>
        )}

        {/* Ambient spinning tick dots when in default state */}
        {!isInteractive && (
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_8s_linear_infinite]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB800] absolute -top-0.5" />
            <div className="w-1 h-1 rounded-full bg-[#E63946] absolute -bottom-0.5" />
          </div>
        )}
      </div>

      {/* Center Precise Solar Core Dot (Locks accurately to cursor tip) */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${
            isClicked ? 1.5 : 1
          })`,
          transition: 'transform 0.05s ease-out',
        }}
        className={`absolute rounded-full pointer-events-none transition-colors duration-150 ${
          isNav
            ? 'w-2 h-2 bg-[#E63946] shadow-[0_0_8px_#E63946]'
            : isInteractive
            ? 'w-2 h-2 bg-[#1E1E24]'
            : 'w-2.5 h-2.5 bg-gradient-to-tr from-[#FFB800] to-[#E63946] shadow-[0_0_8px_#FFB800]'
        }`}
      />
    </div>
  );
};
