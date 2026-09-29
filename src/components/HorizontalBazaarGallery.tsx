import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Maximize2,
  Volume2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sun,
  X,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { triggerSolarBurst } from '../utils/animations';
import { soundbox } from '../utils/audio';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryCard {
  id: string;
  category: string;
  title: string;
  hindiTitle: string;
  caption: string;
  imgUrl: string;
  tag: string;
  metrics: { label: string; val: string }[];
  audioAction?: 'chai' | 'chaat' | 'upi';
}

const GALLERY_ITEMS: GalleryCard[] = [
  {
    id: 'night-energy',
    category: 'NIGHT BAZAAR REVOLUTION',
    title: 'The Evening Shift: Where 70% of Profits Are Made',
    hindiTitle: 'शाम का बाजार • सौर रोशनी की चमक',
    caption:
      'While traditional pushcarts struggle with dim, smoking kerosene lamps or pay extortionate ₹150/night fees for dangerous dangling generator lines, Cartवाला glows with 4 warm incandescent Edison bulbs powered 100% by stored solar energy.',
    imgUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
    tag: 'Night Shift Master',
    metrics: [
      { label: 'Operating Cost', val: '₹0 / night' },
      { label: 'Lighting Life', val: '50,000 hrs' },
      { label: 'Illumination', val: '4x 3000K Edison' },
    ],
    audioAction: 'chai',
  },
  {
    id: 'stainless-hygiene',
    category: 'FOOD-GRADE ENGINEERING',
    title: 'SUS 304 Stainless Steel: Hygiene That Wins Customers',
    hindiTitle: '304 स्टेनलेस स्टील • 100% स्वच्छता',
    caption:
      'Modern urban street food consumers demand visible cleanliness. Cartवाला features a mirror-finish 304 food-grade stainless steel prep station with modular Gastronorm containers and a shatterproof sneeze guard, making compliance with FSSAI regulations seamless.',
    imgUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85',
    tag: 'FSSAI Certified Hub',
    metrics: [
      { label: 'Steel Grade', val: '304 Food-Grade' },
      { label: 'Clean Time', val: '< 90 seconds' },
      { label: 'Inserts', val: '4x GN Trays' },
    ],
    audioAction: 'chaat',
  },
  {
    id: 'solar-canopy',
    category: 'CLEAN ENERGY AUTONOMY',
    title: '400W Monocrystalline Rooftop: Zero Diesel Dependence',
    hindiTitle: '400 वाट सोलर कैनोपी • बिना डीजल की शक्ति',
    caption:
      'High-efficiency monocrystalline silicon cells convert 21.8% of Bharat’s abundant sunlight into continuous electricity. The angled rooftop doubles as a shade umbrella in peak summer and a rain deflector during monsoons.',
    imgUrl:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
    tag: 'Solar Silicon A+',
    metrics: [
      { label: 'Peak Capacity', val: '400 Watts' },
      { label: 'Daily Harvest', val: '2.2 kWh' },
      { label: 'CO2 Saved', val: '1.4 tons/yr' },
    ],
    audioAction: 'upi',
  },
  {
    id: 'smart-audio-upi',
    category: 'DIGITAL COMMERCE & VOICE',
    title: 'Audible UPI Announcements & 10W PA Soundbox',
    hindiTitle: 'आवाज से पेमेंट अलर्ट • डिजिटल विश्वास',
    caption:
      'Never strain vocal cords shouting in noisy street markets. The built-in 10W public address system loops vendor announcements, while the illuminated QR pedestal rings with audible payment confirmation for every single customer transaction.',
    imgUrl:
      'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=85',
    tag: 'Digital Bharat 4.0',
    metrics: [
      { label: 'Sound Output', val: '10W RMS' },
      { label: 'Payment Fraud', val: '0% Recorded' },
      { label: 'Audio Battery', val: '36 Hours' },
    ],
    audioAction: 'upi',
  },
  {
    id: 'chassis-wheels',
    category: 'HEAVY-DUTY MOBILITY',
    title: 'Industrial Radial Wheels & 250kg Balanced Chassis',
    hindiTitle: 'मजबूत चेसिस • 250 किलो लोड क्षमता',
    caption:
      'Navigating potholes, high curbs, and crowded alleys requires uncompromising structural integrity. Precision-balanced center of gravity means a single vendor can effortlessly push 250 kg of merchandise with one hand.',
    imgUrl:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=85',
    tag: 'Puncture-Proof',
    metrics: [
      { label: 'Load Rating', val: '250 kg Max' },
      { label: 'Chassis Tube', val: '38mm High-T' },
      { label: 'Turning Radius', val: '1.1 Meters' },
    ],
  },
  {
    id: 'pm-svanidhi',
    category: 'INCLUSIVE WEALTH CREATION',
    title: 'PM SVANidhi Approved: ₹10,000 Direct Government Subsidy',
    hindiTitle: 'पीएम स्वनिधि स्वीकृत • ₹10,000 सीधी सब्सिडी',
    caption:
      'Cartवाला is recognized under the micro-enterprise modernization initiative. Eligible vendors can access up to ₹50,000 collateral-free credit with interest subsidies, making daily vendor installment as low as a single cup of tea.',
    imgUrl:
      'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1200&q=85',
    tag: 'Govt. Subsidized',
    metrics: [
      { label: 'Subsidy Grant', val: '₹10,000 Flat' },
      { label: 'Credit Limit', val: 'Up to ₹50K' },
      { label: 'Collateral', val: 'Zero Needed' },
    ],
  },
];

export const HorizontalBazaarGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeModalItem, setActiveModalItem] = useState<GalleryCard | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Calculate total horizontal travel distance safely
    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth || 2000;
      const travel = Math.max(0, trackWidth - window.innerWidth + 120);
      return -travel;
    };

    const ctx = gsap.context(() => {
      const horizontalTween = gsap.to(track, {
        x: () => getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${Math.max(400, (track.scrollWidth || 2000) - window.innerWidth + 300)}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(Math.round(self.progress * 100));
          },
        },
      });

      // Refresh ScrollTrigger after brief delay for images and fonts to mount
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      return () => {
        clearTimeout(timer);
        horizontalTween.kill();
      };
    }, container);

    return () => ctx.revert();
  }, []);

  const handlePlayAudio = (e: React.MouseEvent, card: GalleryCard) => {
    e.stopPropagation();
    triggerSolarBurst(e.clientX, e.clientY);
    if (card.audioAction === 'chai') {
      soundbox.playMasalaChaiCall();
    } else if (card.audioAction === 'chaat') {
      soundbox.playChaatCall();
    } else {
      soundbox.playUpiChime();
    }
  };

  return (
    <section
      id="horizontal-gallery"
      ref={containerRef}
      className="relative bg-[#050814] text-white overflow-hidden"
    >
      {/* Gallery Header Bar (Pinned with the section) */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#FFB800] to-[#E63946] text-[#0A1128] shadow-lg shadow-[#FFB800]/30">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#FFB800] tracking-widest uppercase flex items-center space-x-1.5">
              <span>GSAP Cinematic Showcase • Horizontal Scroll</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
              Real Streets. Real Dignity. Real Engineering.
            </h3>
          </div>
        </div>

        {/* Progress Pill Indicator */}
        <div className="hidden sm:flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 pointer-events-auto">
          <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FFB800] to-[#E63946] h-full transition-all duration-75"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">{scrollProgress}%</span>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={trackRef}
        className="flex items-center h-screen px-8 sm:px-16 pt-20 space-x-8 will-change-transform"
        data-cursor="gallery"
      >
        {/* Intro Card */}
        <div className="shrink-0 w-[300px] sm:w-[380px] p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-700/80 shadow-2xl flex flex-col justify-between h-[480px]">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 text-xs font-bold mb-4">
              PHOTO & SPEC EXHIBITION
            </div>
            <h4 className="text-3xl font-black text-white leading-tight">
              Designed For The Heat, Dust & Energy Of Indian Bazaars
            </h4>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Every curve, fastener, and solar cell is custom-crafted to survive torrential monsoons,
              crowded pedestrian crush, and 14-hour daily vendor shifts without breaking down.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Scroll Right to Inspect</span>
            <span className="text-lg animate-pulse">→</span>
          </div>
        </div>

        {/* Dynamic Gallery Cards */}
        {GALLERY_ITEMS.map((card, idx) => (
          <div
            key={card.id}
            className="gallery-card shrink-0 w-[360px] sm:w-[480px] h-[520px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group relative flex flex-col justify-between hover:border-[#FFB800] transition-colors duration-300"
          >
            {/* Background Full-Bleed Image with Gradient Vignette */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={card.imgUrl}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-[#0A0F1D]/60 to-black/30" />
            </div>

            {/* Top Card Badges */}
            <div className="relative z-10 p-5 flex items-start justify-between">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-widest text-[#FFB800] uppercase">
                {card.category}
              </span>

              <div className="flex items-center space-x-1.5">
                {card.audioAction && (
                  <button
                    onClick={(e) => handlePlayAudio(e, card)}
                    data-cursor="cta"
                    className="p-2 rounded-full bg-[#FFB800] hover:bg-amber-400 text-neutral-900 shadow-lg shadow-black/40 transition-transform active:scale-90"
                    title="Play Audio Feature Sample"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setActiveModalItem(card)}
                  data-cursor="gallery"
                  className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-colors"
                  title="Expand High-Res Spec"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Card Content & Metrics */}
            <div className="relative z-10 p-6 space-y-3">
              <div className="text-xs font-bold text-[#FFB800]">{card.hindiTitle}</div>
              <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {card.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal">
                {card.caption}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                {card.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="bg-black/50 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                    <div className="text-[10px] text-slate-400 font-medium truncate">{m.label}</div>
                    <div className="text-xs font-black text-white font-mono mt-0.5 truncate">{m.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* End Call-To-Action Card */}
        <div className="shrink-0 w-[320px] sm:w-[400px] p-8 rounded-3xl bg-gradient-to-br from-[#E63946]/90 via-[#991B1B] to-[#7F1D1D] text-white shadow-2xl flex flex-col justify-between h-[480px]">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white text-[#E63946] flex items-center justify-center font-black text-2xl shadow-lg mb-4">
              ⚡
            </div>
            <h4 className="text-3xl font-black leading-tight">Ready to Upgrade Your Thela?</h4>
            <p className="text-sm text-red-100 mt-3 leading-relaxed">
              Reserve your Cartवाला with PM SVANidhi subsidy of ₹10,000. 100% refundable token booking of
              ₹999 with instant WhatsApp factory dispatch verification.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="#build-cart"
              data-cursor="cta"
              className="w-full py-3 rounded-full bg-white text-[#1E1E24] hover:bg-[#FAF7F2] font-black text-xs sm:text-sm text-center block shadow-lg transition-transform active:scale-95"
            >
              Configure Cart (-₹10,000)
            </a>
            <a
              href="tel:+919302184644"
              data-cursor="nav"
              className="w-full py-2.5 rounded-full border border-white/40 hover:bg-white/10 text-white font-bold text-xs text-center block transition-colors"
            >
              Call Factory: +91 93021 84644
            </a>
          </div>
        </div>
      </div>

      {/* Expanded Spec Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto relative">
                <img
                  src={activeModalItem.imgUrl}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 space-y-4 text-white">
                <div className="text-xs font-bold text-[#FFB800] uppercase tracking-wider">
                  {activeModalItem.category}
                </div>
                <h3 className="text-2xl font-black leading-tight">{activeModalItem.title}</h3>
                <div className="text-sm font-bold text-amber-300">{activeModalItem.hindiTitle}</div>
                <p className="text-sm text-slate-300 leading-relaxed">{activeModalItem.caption}</p>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-400">ENGINEERING SPECIFICATIONS</div>
                  {activeModalItem.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-800/80"
                    >
                      <span className="text-slate-300">{m.label}</span>
                      <span className="font-bold text-[#FFB800] font-mono">{m.val}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="w-full py-2.5 rounded-full bg-[#FFB800] text-black font-extrabold text-xs"
                  >
                    Back to Showcase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
