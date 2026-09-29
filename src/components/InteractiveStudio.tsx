import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Sun,
  Shield,
  Volume2,
  Moon,
  ChevronRight,
  CheckCircle2,
  Maximize2,
  Flame,
  BatteryCharging,
  Layers,
  ArrowDown,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeCartScene } from './ThreeCartScene';
import { triggerSolarBurst } from '../utils/animations';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeatureChapter {
  id: string;
  stepIndex: number;
  badge: string;
  title: string;
  hindiTitle: string;
  description: string;
  specs: { label: string; value: string }[];
  highlight: string;
}

const CHAPTERS: FeatureChapter[] = [
  {
    id: 'night-bazaar',
    stepIndex: 0,
    badge: '🌙 Night Bazaar Experience (Default)',
    title: 'The Night Shift Awakening: 6 PM to 11 PM',
    hindiTitle: 'नाइट बाजार का बादशाह • सौर ऊर्जा की चमक',
    description:
      'Over 70% of street vendor revenue is generated after sunset. While standard thelas burn coughing kerosene lanterns or pay ₹150 every night for hazardous diesel generator wires, Cartवाला illuminates the bustling bazaar with 4 warm incandescent Edison bulbs powered 100% by the daytime solar harvest.',
    specs: [
      { label: 'Night Lighting', value: '4x 3000K Warm Edison Fairy Bulbs' },
      { label: 'Operating Cost', value: '₹0 / Night (Zero Generator Rent)' },
      { label: 'Vendor Dignity', value: 'Zero Fumes, Zero Noise, Clean Light' },
    ],
    highlight: 'Silent, warm golden illumination that naturally pulls evening bazaar foot traffic.',
  },
  {
    id: 'solar-roof',
    stepIndex: 1,
    badge: '☀️ 400W Monocrystalline Canopy',
    title: '2.2 kWh Daily Harvest Under Bharat’s Sun',
    hindiTitle: '400W सोलर छत • दिनभर चार्जिंग',
    description:
      'Engineered with commercial-grade A+ monocrystalline solar silicon with 21.8% efficiency. The aerodynamic 25-degree tilt automatically sheds monsoon downpours while insulating the vendor from blistering 45°C summer heatwaves.',
    specs: [
      { label: 'Rated Peak Power', value: '400 Watts Peak (Monocrystalline)' },
      { label: 'Daily Energy Generation', value: '2.1 – 2.4 kWh per sunny day' },
      { label: 'Weather Rating', value: 'IP67 Heavy-Rain Storm Sealed' },
    ],
    highlight: 'Charges the core battery completely in 4.5 peak sun hours while running all equipment.',
  },
  {
    id: 'prep-counter',
    stepIndex: 2,
    badge: '🍉 Food-Grade Stainless Bay & Chiller',
    title: 'FSSAI-Ready Hygienic Counter & 4°C Cold Storage',
    hindiTitle: '304 स्टेनलेस स्टील काउंटर • बिना बर्फ का चिलर',
    description:
      'Street food safety starts with mirror-finish 304 austenitic stainless steel. Four modular Gastronorm inserts keep fresh sev, chutneys, and diced toppings crisp and covered. An integrated active cold-bay chiller eliminates messy, melting ice blocks.',
    specs: [
      { label: 'Counter Material', value: 'SUS 304 Food-Grade Stainless Steel' },
      { label: 'Cold Storage', value: 'Solid-State Active 4°C Cold Chiller' },
      { label: 'Protection', value: 'Tempered Sneeze Guard Glass Barrier' },
    ],
    highlight: 'Customers see pristine hygiene and transparent prep, justifying 20-30% premium pricing.',
  },
  {
    id: 'smart-soundbox',
    stepIndex: 3,
    badge: '📢 10W PA Soundbox & UPI Digital QR Mast',
    title: 'Acoustic Voice Marketing & Instant Audio UPI',
    hindiTitle: '10W स्मार्ट साउंडबॉक्स • आवाज से पेमेंट अलर्ट',
    description:
      'Vendor vocal fatigue ends here. The weatherproof 10W public address horn loops authentic regional announcements (आइए आइए! ताजा जूस! / गरमा-गरम कड़क चाय!). The illuminated UPI QR mast chirps payment confirmations loudly so not a single rupee is lost in bazaar chaos.',
    specs: [
      { label: 'Audio Power', value: '10W RMS Weatherproof Horn' },
      { label: 'Digital Payments', value: 'Illuminated UPI Stand + Audio Chime' },
      { label: 'Voice Modes', value: 'Pre-recorded Hindi/Bilingual + Custom Mic' },
    ],
    highlight: 'No throat strain, 100% audit-proof UPI audio alerts, and high customer trust.',
  },
  {
    id: 'battery-core',
    stepIndex: 4,
    badge: '🔋 AIS-156 Battery Core & Heavy-Duty Chassis',
    title: '1.2 kWh LiFePO4 Fireproof Core & Exploded Assembly',
    hindiTitle: '1.2kWh LiFePO4 सुरक्षित बैटरी • 8+ साल की उम्र',
    description:
      'Unlike hazardous lead-acid batteries that fail in 12 months, our Lithium Iron Phosphate (LiFePO4) chemistry delivers 3,000+ full charge cycles. Concealed inside a locked, anti-tamper steel undercarriage safe with puncture-resistant radial thela wheels.',
    specs: [
      { label: 'Battery Chemistry', value: 'LiFePO4 (Non-combustible, AIS-156)' },
      { label: 'Lifespan', value: '3,000+ Cycles (8+ Years Daily Use)' },
      { label: 'Payload Capacity', value: '250 kg Balanced Heavy-Duty Frame' },
    ],
    highlight: 'Inspect the exploded 3D layout to see the balanced center of gravity and chassis engineering.',
  },
];

export const InteractiveStudio: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Setup GSAP ScrollTrigger to sync scroll progress to 3D scene camera & features
  useEffect(() => {
    if (!containerRef.current || !cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll('.scrolly-chapter-card');

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => setActiveStep(index),
        onEnterBack: () => setActiveStep(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const handleStepJump = (e: React.MouseEvent, index: number) => {
    setActiveStep(index);
    triggerSolarBurst(e.clientX, e.clientY);
    const cardEl = document.getElementById(`scrolly-card-${index}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentChapter = CHAPTERS[activeStep] || CHAPTERS[0];

  return (
    <section
      id="the-cart"
      ref={containerRef}
      className="relative bg-gradient-to-b from-[#090E1A] via-[#0E1626] to-[#0A1128] text-white py-16 lg:py-24 border-y border-slate-800 scroll-mt-14 overflow-hidden"
    >
      {/* Background Night Bazaar Ambient Lights & Neon Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E63946]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-700/60 px-4 py-1.5 rounded-full text-xs font-bold text-[#FFB800] shadow-lg shadow-indigo-950/50 mb-3">
            <Moon className="w-3.5 h-3.5 text-[#FFB800] animate-pulse" />
            <span>Night Bazaar 3D Scrollytelling Experience • Scroll to Explore Features</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Step Inside the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946]">
              Night Bazaar
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Scroll down to inspect every inch of the cart in full 3D dimension. The camera smoothly
            travels between the 400W solar roof, stainless steel prep counter, smart soundbox, and the
            fireproof battery core.
          </p>

          {/* Quick Chapter Navigation Pill Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={(e) => handleStepJump(e, idx)}
                data-cursor="nav"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeStep === idx
                    ? 'bg-gradient-to-r from-[#FFB800] to-[#E63946] text-[#0A1128] shadow-md shadow-[#FFB800]/30 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="hidden sm:inline">{ch.badge.split(' ')[1]}</span>
                <span className="sm:hidden">{ch.badge.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollytelling Layout: 3D Viewport on Left (Sticky) + Scrolling Feature Explanations on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Sticky 3D WebGL Canvas Viewport */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 z-20">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-[#0F172A] to-[#0A0F1D] shadow-2xl shadow-black/60 group">
              {/* Top Scene HUD Overlay */}
              <div className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-xs font-bold text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Feature {activeStep + 1} of 5 Active</span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-[11px] font-mono text-cyan-300">
                  WebGL 3D Engine • Three.js
                </div>
              </div>

              {/* 3D WebGL Canvas Component defaulting to Night Bazaar */}
              <div id="three-canvas-container" data-cursor="3d">
                <ThreeCartScene
                  defaultTimeOfDay="night"
                  activeStep={activeStep}
                  onStepChange={(step) => setActiveStep(step)}
                />
              </div>

              {/* Bottom Quick Feature Summary Banner */}
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[#FFB800] font-black">{currentChapter.badge}</span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-300 hidden sm:inline truncate max-w-xs">
                    {currentChapter.title}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <span>Scroll for next feature</span>
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#FFB800]" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Storytelling Feature Explanations */}
          <div ref={cardsContainerRef} className="lg:col-span-5 space-y-8 py-2">
            {CHAPTERS.map((ch, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={ch.id}
                  id={`scrolly-card-${idx}`}
                  className={`scrolly-chapter-card transition-all duration-300 rounded-3xl p-6 sm:p-7 border ${
                    isCurrent
                      ? 'bg-slate-800/90 border-[#FFB800] shadow-xl shadow-[#FFB800]/10 scale-[1.01]'
                      : 'bg-slate-900/50 border-slate-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCurrent
                          ? 'bg-[#FFB800] text-[#1E1E24] shadow-xs'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ch.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">0{idx + 1} / 05</span>
                  </div>

                  {/* Title & Hindi Title */}
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {ch.title}
                  </h3>
                  <div className="text-xs font-bold text-[#FFB800] mt-1 mb-3">
                    {ch.hindiTitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {ch.description}
                  </p>

                  {/* Key Specifications Grid */}
                  <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-1 gap-2">
                    {ch.specs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
                      >
                        <span className="text-slate-400">{spec.label}</span>
                        <span className="font-bold text-white font-mono">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Quote */}
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                    <span>{ch.highlight}</span>
                  </div>

                  {/* Interactive Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={(e) => handleStepJump(e, idx)}
                      data-cursor="cta"
                      className="text-xs font-extrabold text-[#FFB800] hover:text-white flex items-center space-x-1 transition-colors"
                    >
                      <span>Focus 3D Camera on this Feature</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {isCurrent && (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Viewing</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
