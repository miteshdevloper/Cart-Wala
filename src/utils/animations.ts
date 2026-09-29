import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, random } from 'animejs';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let globalLenis: Lenis | null = null;

/**
 * Initializes buttery smooth Lenis scrolling synchronized with GSAP ScrollTrigger
 */
export function initSmoothScrolling(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Destroy previous instance if any
  if (globalLenis) {
    globalLenis.destroy();
  }

  // Create high-performance Lenis instance
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  globalLenis = lenis;

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // Return cleanup function
  return () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    globalLenis = null;
  };
}

export function getLenis(): Lenis | null {
  return globalLenis;
}

/**
 * Scrolls smoothly to target element or offset using Lenis
 */
export function scrollToElement(selectorOrEl: string | HTMLElement, offset: number = -60): void {
  if (globalLenis) {
    globalLenis.scrollTo(selectorOrEl, { offset, duration: 1.2 });
  } else {
    const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}

/**
 * Anime.js Particle Sparkle Burst for interactive buttons and celebrations
 */
export function triggerSolarBurst(x: number, y: number, color = '#FFB800'): void {
  if (typeof window === 'undefined') return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${x}px`;
  container.style.top = `${y}px`;
  container.style.pointerEvents = 'none';
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  const particlesCount = 18;
  const particles: HTMLSpanElement[] = [];

  for (let i = 0; i < particlesCount; i++) {
    const p = document.createElement('span');
    p.style.position = 'absolute';
    p.style.width = `${Math.floor(Math.random() * 6) + 4}px`;
    p.style.height = p.style.width;
    p.style.borderRadius = '50%';
    p.style.backgroundColor = Math.random() > 0.4 ? color : '#E63946';
    p.style.boxShadow = `0 0 10px ${color}`;
    container.appendChild(p);
    particles.push(p);
  }

  animate(particles, {
    translateX: () => random(-70, 70),
    translateY: () => random(-70, 70),
    scale: [1.4, 0],
    opacity: [1, 0],
    ease: 'outExpo',
    duration: 650,
    onComplete: () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  });
}

/**
 * Barba-style smooth page transition curtain using Anime.js
 */
export function playCurtainTransition(onMidpoint?: () => void): void {
  if (typeof window === 'undefined') return;

  let curtain = document.getElementById('bazaar-transition-curtain');
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.id = 'bazaar-transition-curtain';
    curtain.className =
      'fixed inset-0 z-[100001] pointer-events-none bg-gradient-to-br from-[#0F172A] via-[#1E1E24] to-[#7F1D1D] flex flex-col items-center justify-center';
    curtain.innerHTML = `
      <div class="curtain-content flex flex-col items-center space-y-3 opacity-0 text-white">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFB800] to-[#E63946] flex items-center justify-center shadow-lg shadow-[#FFB800]/40">
          <span class="text-2xl font-black">⚡</span>
        </div>
        <div class="text-sm font-black tracking-widest uppercase text-[#FFB800]">Cartवाला • Night Shift Active</div>
      </div>
    `;
    document.body.appendChild(curtain);
  }

  curtain.style.pointerEvents = 'auto';
  curtain.style.transform = 'translateY(100%)';

  const content = curtain.querySelector('.curtain-content');
  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
  });

  tl.to(curtain, {
    y: '0%',
    duration: 0.45,
    onComplete: () => {
      if (onMidpoint) onMidpoint();
    },
  })
    .to(content, { opacity: 1, scale: 1, duration: 0.2 })
    .to(content, { opacity: 0, duration: 0.15, delay: 0.15 })
    .to(curtain, {
      y: '-100%',
      duration: 0.45,
      onComplete: () => {
        if (curtain) {
          curtain.style.pointerEvents = 'none';
        }
      },
    });
}
