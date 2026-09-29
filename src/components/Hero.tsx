import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Box,
  Sun,
  BatteryCharging,
  Snowflake,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Phone,
  Moon,
  Zap,
  Play,
  CheckCircle,
} from 'lucide-react';
import gsap from 'gsap';
import { animate } from 'animejs';
import { triggerSolarBurst } from '../utils/animations';
import { soundbox } from '../utils/audio';

interface HeroProps {
  onOpenConfigurator: () => void;
  onScrollToStudio: () => void;
  lang: 'en' | 'hi';
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConfigurator,
  onScrollToStudio,
  lang,
}) => {
  const [liveWatts, setLiveWatts] = useState(388);
  const [batteryPct, setBatteryPct] = useState(94);
  const [heroMode, setHeroMode] = useState<'night' | 'day'>('night');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const heroRootRef = useRef<HTMLDivElement>(null);
  const wattNumRef = useRef<HTMLSpanElement>(null);

  // 3D Card tilt physics
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // GSAP Entrance reveals on mount
  useEffect(() => {
    if (!heroRootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-gsap-badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-gsap-title', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.hero-gsap-desc', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.hero-gsap-cta', {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        delay: 0.45,
        ease: 'back.out(1.7)',
        stagger: 0.1,
      });

      gsap.from('.hero-gsap-card', {
        x: 40,
        opacity: 0,
        duration: 1.1,
        delay: 0.25,
        ease: 'power3.out',
      });
    }, heroRootRef.current);

    return () => ctx.revert();
  }, []);

  // Anime.js Wattage Counter fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      const nextWatts = Math.min(400, Math.max(340, Math.floor(375 + Math.random() * 24)));
      setLiveWatts(nextWatts);

      if (wattNumRef.current) {
        animate(wattNumRef.current, {
          scale: [1.2, 1],
          duration: 350,
          ease: 'outQuad',
        });
      }
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const handleTestAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSolarBurst(e.clientX, e.clientY);
    setIsPlayingAudio(true);
    soundbox.playChaatCall(() => setIsPlayingAudio(false));
  };

  return (
    <section
      id="home"
      ref={heroRootRef}
      className="relative pt-6 pb-16 md:py-20 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FFFDF9]"
    >
      {/* Background ambient lighting glows with parallax warmth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FFB800]/15 via-[#E63946]/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* Left Column: Vision, Subsidies & Direct Helpline */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Badge */}
            <div className="hero-gsap-badge inline-flex items-center space-x-2 bg-white border border-[#F2EAE0] px-4 py-1.5 rounded-full shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFB800]"></span>
              </span>
              <span className="font-extrabold text-xs text-[#7c5800] tracking-wide">
                {lang === 'hi'
                  ? '🇮🇳 भारत का पहला सोलर-स्मार्ट ठेला • PM SVANIDHI ₹10,000 SUBSIDY'
                  : 'BHARAT’S FIRST SOLAR-SMART THELA • PM SVANIDHI ₹10,000 SUBSIDY'}
              </span>
            </div>

            {/* Main Headline */}
            <div className="hero-gsap-title space-y-2">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E1E24] tracking-tight leading-[1.08]">
                Chhoti Cart.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946]">
                  Badi Soch.
                </span>
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#837560] tracking-wide uppercase pt-1">
                {lang === 'hi'
                  ? 'दिन में सौर ऊर्जा संचय • रात के बाजार में बेरोकटोक कमाई'
                  : 'Empowering Street Entrepreneurs with 400W Solar Autonomy & Dignity'}
              </p>
            </div>

            {/* Description Prose */}
            <p className="hero-gsap-desc text-[#514532] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Eliminate generator fumes, illegal wires, and spoiled perishables forever. Built with
              commercial 304 food-grade stainless steel, ice-free cold storage, and a 10W smart soundbox
              with voice announcements.
            </p>

            {/* Primary Action Buttons */}
            <div className="hero-gsap-cta flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={(e) => {
                  triggerSolarBurst(e.clientX, e.clientY);
                  onOpenConfigurator();
                }}
                data-cursor="cta"
                className="btn-primary px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946] text-[#1E1E24] font-black text-sm shadow-xl shadow-[#FFB800]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
              >
                <Wrench className="w-4 h-4 text-[#1E1E24]" />
                <span>{lang === 'hi' ? 'ठेला कॉन्फ़िगर करें' : 'Configure Your Cart'}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/70 text-[10px] font-black text-[#E63946]">
                  -₹10,000
                </span>
              </button>

              <button
                onClick={(e) => {
                  triggerSolarBurst(e.clientX, e.clientY);
                  onScrollToStudio();
                }}
                data-cursor="3d"
                className="px-5 sm:px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-[#1E1E24] font-bold text-sm border-2 border-[#1E1E24]/20 hover:border-[#1E1E24] shadow-xs transition-all flex items-center space-x-2"
              >
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Experience 3D Night Bazaar</span>
              </button>
            </div>

            {/* Direct Factory Helpline Callout */}
            <div className="hero-gsap-cta flex items-center space-x-3 pt-2">
              <div className="p-2 rounded-xl bg-red-100 text-[#E63946]">
                <Phone className="w-4 h-4 text-[#E63946]" />
              </div>
              <div className="text-xs">
                <span className="text-[#837560]">Direct Order & Subsidy Helpline: </span>
                <a
                  href="tel:+919302184644"
                  data-cursor="nav"
                  className="font-extrabold text-[#1E1E24] hover:text-[#E63946] transition-colors underline decoration-[#FFB800] decoration-2"
                >
                  +91 93021 84644
                </a>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center space-x-4 border-t border-[#F2EAE0]">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Ramesh - Mumbai"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Anand - Delhi"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Sunita - Lucknow"
                />
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white bg-[#FFB800] font-black text-xs text-[#1E1E24]">
                  +5K
                </div>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-bold text-[#1E1E24]">
                  5,200+ Vendors across 28 Indian cities
                </div>
                <div className="text-xs text-[#837560] flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Earning 30% more daily net profit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Thela Live Portal with Night Bazaar Toggle */}
          <div className="hero-gsap-card lg:col-span-6 perspective-[1000px]">
            <div
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: tilt.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out',
              }}
              className="bg-white rounded-3xl border border-[#F2EAE0] p-4 sm:p-6 shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300 relative group"
            >
              {/* Telemetry Header with Mode Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#FFB800]/20 text-[#7c5800]">
                    <Zap className="w-4 h-4 text-[#FFB800]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5">
                      <span>Live Telemetry</span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        ONLINE
                      </span>
                    </div>
                    <div className="text-[10px] text-[#837560]">Model S-24 Pro • AIS-156 Certified</div>
                  </div>
                </div>

                {/* Day / Night Shift Interactive Toggle */}
                <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200 text-[11px] font-bold">
                  <button
                    onClick={() => setHeroMode('day')}
                    className={`px-2.5 py-1 rounded-full transition-all flex items-center space-x-1 ${
                      heroMode === 'day'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-[#FFB800]" />
                    <span className="hidden sm:inline">Solar Day</span>
                  </button>
                  <button
                    onClick={() => setHeroMode('night')}
                    className={`px-2.5 py-1 rounded-full transition-all flex items-center space-x-1 ${
                      heroMode === 'night'
                        ? 'bg-[#1E1E24] text-[#FFB800] shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-indigo-400" />
                    <span>Night Bazaar</span>
                  </button>
                </div>
              </div>

              {/* Visual Showcase Screen */}
              <div
                className={`relative mt-3 rounded-2xl overflow-hidden border transition-colors duration-500 ${
                  heroMode === 'night'
                    ? 'bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0A0F1D] border-slate-700 text-white'
                    : 'bg-gradient-to-b from-[#FFF5D6]/40 via-white to-[#FAF7F2] border-[#F2EAE0] text-[#1E1E24]'
                }`}
              >
                {/* Night Stars / Daytime Sun Flare Overlay */}
                {heroMode === 'night' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-2 left-8 w-1 h-1 bg-amber-300 rounded-full animate-ping" />
                    <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
                    <div className="absolute bottom-16 left-1/4 w-1 h-1 bg-cyan-300 rounded-full" />
                    <div className="absolute top-12 left-1/2 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
                  </div>
                )}

                {/* Central High-Fidelity Thela Graphic Rendering */}
                <div className="p-5 sm:p-7 min-h-[310px] flex flex-col items-center justify-between relative z-10">
                  {/* Solar Canopy Roof Frame */}
                  <div className="w-full max-w-[380px] relative">
                    <div
                      className={`rounded-2xl p-3 border shadow-lg transition-colors ${
                        heroMode === 'night'
                          ? 'bg-slate-900/90 border-amber-500/40'
                          : 'bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#FFB800] border-[#E5A600]'
                      }`}
                    >
                      {/* Monocrystalline Solar Cells */}
                      <div className="bg-[#0B192C] rounded-xl p-2 grid grid-cols-4 gap-1.5 border border-blue-900/80 shadow-inner">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-8 rounded-sm border transition-all flex items-center justify-center ${
                              heroMode === 'night'
                                ? 'bg-gradient-to-b from-blue-950 to-slate-900 border-blue-900/40'
                                : 'bg-gradient-to-b from-[#1D4ED8] to-[#1E3A8A] border-blue-400/40 shadow-inner'
                            }`}
                          >
                            <span className="text-[9px] font-mono text-cyan-300/60">
                              {heroMode === 'day' ? '⚡' : '●'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-black px-1">
                        <span className={heroMode === 'night' ? 'text-amber-400' : 'text-neutral-900'}>
                          400W MONOCRYSTALLINE CANOPY
                        </span>
                        <span className="text-[#E63946]">21.8% EFFICIENCY</span>
                      </div>
                    </div>

                    {/* Hanging Warm Edison Fairy Bulbs */}
                    <div className="flex justify-around px-4 -mt-1 relative z-20">
                      {[...Array(4)].map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full border transition-all duration-300 flex items-center justify-center ${
                            heroMode === 'night'
                              ? 'bg-amber-300 border-amber-400 shadow-[0_0_20px_#FFAE33] scale-110'
                              : 'bg-amber-200 border-amber-300 opacity-70'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stainless Prep Bay & Chalkboard Section */}
                  <div className="w-full max-w-[380px] mt-3 rounded-2xl bg-white/95 text-neutral-900 p-3.5 border-2 border-[#FFB800] shadow-md">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      {/* Chalkboard Menu */}
                      <div className="col-span-4 bg-[#121826] text-white p-2 rounded-xl text-[9px] font-mono border border-slate-700">
                        <div className="text-[#FFB800] font-black pb-1 border-b border-slate-700">
                          MENU
                        </div>
                        <div className="text-zinc-200">• Masala Chai</div>
                        <div className="text-zinc-200">• Fresh Juices</div>
                        <div className="text-zinc-200">• Bhel & Chaat</div>
                      </div>

                      {/* 304 Stainless Prep Trays & Chiller */}
                      <div className="col-span-8 bg-neutral-100 rounded-xl p-2 border border-neutral-200">
                        <div className="text-[9px] font-extrabold text-neutral-700 mb-1 flex items-center justify-between">
                          <span>304 FOOD-GRADE STAINLESS</span>
                          <span className="text-emerald-700 font-bold">4°C Active Cold</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          <div className="bg-amber-100 border border-amber-300 rounded p-1 text-center text-[8px] font-bold text-amber-900">
                            Oranges
                          </div>
                          <div className="bg-red-100 border border-red-300 rounded p-1 text-center text-[8px] font-bold text-red-900">
                            Tomatoes
                          </div>
                          <div className="bg-emerald-100 border border-emerald-300 rounded p-1 text-center text-[8px] font-bold text-emerald-900">
                            Chutney
                          </div>
                          <div className="bg-yellow-100 border border-yellow-300 rounded p-1 text-center text-[8px] font-bold text-yellow-900">
                            Sev
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Soundbox & UPI Stand Row */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleTestAudio}
                          data-cursor="cta"
                          className="px-2.5 py-1 rounded-lg bg-[#1E1E24] text-white text-[10px] font-bold flex items-center space-x-1.5 hover:bg-neutral-800 transition-colors shadow-xs active:scale-95"
                          title="Click to Test 10W Soundbox"
                        >
                          <Volume2 className="w-3 h-3 text-[#FFB800]" />
                          <span>{isPlayingAudio ? 'Broadcasting...' : 'Test 10W PA'}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-[9px] font-black text-blue-900 flex items-center space-x-1">
                          <span>UPI QR Stand</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chassis & Radial Wheels */}
                  <div className="w-full max-w-[340px] flex items-center justify-between px-6 pt-2">
                    <div className="w-11 h-11 rounded-full border-4 border-[#1E1E24] bg-neutral-800 shadow-md flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-neutral-400"></div>
                    </div>
                    <div className="text-[10px] font-bold text-neutral-400 font-mono tracking-wider">
                      RADIAL HEAVY CHASSIS
                    </div>
                    <div className="w-11 h-11 rounded-full border-4 border-[#1E1E24] bg-neutral-800 shadow-md flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-neutral-400"></div>
                    </div>
                  </div>
                </div>

                {/* Mode Indicator Bottom Badge */}
                <div
                  className={`p-3 text-xs flex items-center justify-between border-t ${
                    heroMode === 'night'
                      ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                      : 'bg-amber-50/80 border-[#F2EAE0] text-[#514532]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        heroMode === 'night' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500 animate-ping'
                      }`}
                    />
                    <span className="font-bold text-xs">
                      {heroMode === 'night'
                        ? 'Night Bazaar: 4x Edison Bulbs Active • 10W PA Ready • Battery 94%'
                        : 'Day Shift: 390W Solar Charging • 4°C Active Cold Storage'}
                    </span>
                  </div>
                  <button
                    onClick={onScrollToStudio}
                    data-cursor="3d"
                    className="text-[11px] font-black text-[#FFB800] hover:underline"
                  >
                    Open 3D Model →
                  </button>
                </div>
              </div>

              {/* 4 Bottom Telemetry Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#F2EAE0]">
                {/* 1. Solar Roof */}
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                  <div className="text-[10px] font-bold text-[#837560] uppercase">Solar Wattage</div>
                  <div className="text-base font-black text-[#1E1E24] font-mono mt-0.5 flex items-baseline space-x-1">
                    <span ref={wattNumRef}>{heroMode === 'night' ? '0' : liveWatts}</span>
                    <span className="text-[11px] text-[#837560]">W</span>
                  </div>
                </div>

                {/* 2. Battery */}
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                  <div className="text-[10px] font-bold text-[#837560] uppercase">LiFePO4 Core</div>
                  <div className="text-base font-black text-emerald-600 font-mono mt-0.5">
                    {batteryPct}% <span className="text-[10px] font-normal text-neutral-500">1.2kWh</span>
                  </div>
                </div>

                {/* 3. Chiller */}
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                  <div className="text-[10px] font-bold text-[#837560] uppercase">Active Chiller</div>
                  <div className="text-base font-black text-blue-600 font-mono mt-0.5">
                    4°C <span className="text-[10px] font-normal text-neutral-500">Ice-Free</span>
                  </div>
                </div>

                {/* 4. Subsidy */}
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                  <div className="text-[10px] font-bold text-[#837560] uppercase">PM SVANidhi</div>
                  <div className="text-base font-black text-[#E63946] font-mono mt-0.5">
                    -₹10,000 <span className="text-[9px] font-bold text-emerald-600">DIRECT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
