import React, { useState, useEffect } from 'react';
import {
  Clock,
  Award,
  Zap,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
  Share2,
  Lock,
  Unlock,
  ShieldCheck,
  ChevronRight,
  Flame,
  Volume2,
  Coffee,
  IndianRupee,
  RefreshCw,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import { triggerSolarBurst } from '../utils/animations';
import { soundbox } from '../utils/audio';

interface VendorJourneyProps {
  user?: User | null;
  lang?: 'en' | 'hi';
  onOpenConfigurator?: () => void;
}

interface Milestone {
  id: string;
  stageId: number;
  title: string;
  hindiTitle: string;
  description: string;
  icon: string;
  metricLabel: string;
  metricValue: string;
  points: number;
}

interface GrowthStage {
  id: number;
  name: string;
  hindiName: string;
  timeline: string;
  badge: string;
  badgeColor: string;
  description: string;
}

const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 1,
    name: 'Street Pioneer',
    hindiName: 'स्ट्रीट पायनियर',
    timeline: 'Days 1 – 7',
    badge: 'Solar Swabhiman (Self-Reliance)',
    badgeColor: 'border-amber-400 bg-amber-500/10 text-amber-900',
    description: 'First days on the pitch: mastering solar autonomy, zero generator dependence, and digital payments.',
  },
  {
    id: 2,
    name: 'Street Momentum',
    hindiName: 'स्ट्रीट मोमेंटम',
    timeline: 'Weeks 2 – 4',
    badge: 'Green Merchant Silver Shield',
    badgeColor: 'border-emerald-400 bg-emerald-500/10 text-emerald-950',
    description: 'Serving hundreds of loyal patrons while saving thousands in electricity and ice purchases.',
  },
  {
    id: 3,
    name: 'Commercial Scale',
    hindiName: 'कमर्शियल स्केल',
    timeline: 'Months 2 – 6',
    badge: 'PM SVANidhi Vanguard',
    badgeColor: 'border-blue-400 bg-blue-500/10 text-blue-950',
    description: 'Establishing FSSAI-grade street food reputation and unlocking subsidized higher credit tranches.',
  },
  {
    id: 4,
    name: 'Street Titan',
    hindiName: 'स्ट्रीट टाइटन',
    timeline: 'Year 1 & Beyond',
    badge: 'Bhartiya Fleet Owner Gold Crown',
    badgeColor: 'border-purple-400 bg-purple-500/10 text-purple-950',
    description: 'Full equipment payback achieved, multi-cart expansion, and inspiring the next generation.',
  },
];

const MILESTONES: Milestone[] = [
  // Stage 1
  {
    id: 'first_watt',
    stageId: 1,
    title: 'First Solar Watt Generated',
    hindiTitle: 'पहला सौर वाट उत्पादित',
    description: '400W monocrystalline canopy initialized and feeding pure clean DC voltage to the LiFePO4 battery core.',
    icon: '⚡',
    metricLabel: 'Solar Output',
    metricValue: '390W Peak',
    points: 100,
  },
  {
    id: 'first_upi',
    stageId: 1,
    title: 'First Digital UPI Payment Ring',
    hindiTitle: 'पहला डिजिटल यूपीआई भुगतान',
    description: 'Customer scanned the illuminated QR pedestal; soundbox announced instant payment verification without cash hassle.',
    icon: '📱',
    metricLabel: 'Transaction',
    metricValue: '₹60 Verified',
    points: 100,
  },
  {
    id: 'voice_activated',
    stageId: 1,
    title: '10W Voice Soundbox Broadcast',
    hindiTitle: '10W साउंडबॉक्स आवाज शुरू',
    description: 'Automated calling broadcasted across bustling marketplace; saved vendor from voice strain during evening peak.',
    icon: '📢',
    metricLabel: 'Vocal Fatigue',
    metricValue: '0% Strain',
    points: 100,
  },

  // Stage 2
  {
    id: 'hundredth_order',
    stageId: 2,
    title: 'Hundredth Order Fulfilled',
    hindiTitle: '100वां ऑर्डर सफलतापूर्वक पूर्ण',
    description: 'Served 100 hungry patrons with pristine 304 food-grade stainless hygiene and fast turnaround.',
    icon: '💯',
    metricLabel: 'Served Meals',
    metricValue: '100 Orders',
    points: 250,
  },
  {
    id: 'zero_spoilage',
    stageId: 2,
    title: 'Zero-Spoilage 7-Day Streak',
    hindiTitle: '7 दिन जीरो वेस्टेज स्ट्रीक',
    description: 'Solid-state 4°C active cold bay prevented fruit, milk, and chutney spoilage with zero dirty ice purchases.',
    icon: '❄️',
    metricLabel: 'Produce Saved',
    metricValue: '100% Fresh',
    points: 250,
  },
  {
    id: 'generator_avoided',
    stageId: 2,
    title: '₹3,600 Generator Cost Eliminated',
    hindiTitle: '₹3,600 जनरेटर बिल की बचत',
    description: '30 consecutive days of zero generator wire rent or noisy petrol expenses directly into the vendor wallet.',
    icon: '💰',
    metricLabel: 'Monthly Fuel',
    metricValue: '₹0 Spent',
    points: 250,
  },

  // Stage 3
  {
    id: 'five_hundred_orders',
    stageId: 3,
    title: '500th Clean Food Order Served',
    hindiTitle: '500वां स्वच्छ भोजन ऑर्डर',
    description: 'FSSAI hygienic standards and transparent sneeze guards turned 60% of passers-by into daily regulars.',
    icon: '🥗',
    metricLabel: 'Repeat Rate',
    metricValue: '62% Loyal',
    points: 500,
  },
  {
    id: 'hundred_kwh',
    stageId: 3,
    title: '100 kWh Clean Solar Electricity Harvested',
    hindiTitle: '100 kWh हरित सौर ऊर्जा संचित',
    description: 'Abated 82 kg of toxic CO2 city emissions compared to traditional diesel generator thelas.',
    icon: '🌱',
    metricLabel: 'Carbon Abated',
    metricValue: '82 kg CO2',
    points: 500,
  },
  {
    id: 'pm_svanidhi_boost',
    stageId: 3,
    title: 'PM SVANidhi Tranche 2 Credit Boost',
    hindiTitle: 'पीएम स्वनिधि दूसरी किश्त पात्रता',
    description: 'On-time digital repayment qualified the vendor for ₹20,000 to ₹50,000 subsidized micro-credit.',
    icon: '🛡️',
    metricLabel: 'Credit Rating',
    metricValue: '780 Score',
    points: 500,
  },

  // Stage 4
  {
    id: 'ten_thousand_orders',
    stageId: 4,
    title: '10,000th Customer Served',
    hindiTitle: '10,000वां ग्राहक गौरव',
    description: 'A landmark street entrepreneurship milestone representing over ₹6.5 Lakhs in gross food turnover.',
    icon: '🏆',
    metricLabel: 'Lifetime Sales',
    metricValue: '10K Meals',
    points: 1000,
  },
  {
    id: 'full_payback',
    stageId: 4,
    title: '100% Capital Payback Achieved',
    hindiTitle: '100% पूंजी वसूली पूर्ण',
    description: 'Solar energy and spoilage savings have completely paid for the Cartwala hardware investment.',
    icon: '💎',
    metricLabel: 'Net ROI',
    metricValue: '100% Free',
    points: 1000,
  },
  {
    id: 'fleet_expansion',
    stageId: 4,
    title: 'Fleet Expansion: 2nd Thela Reserved',
    hindiTitle: 'फ्लीट विस्तार • दूसरा ठेला आरक्षित',
    description: 'Vendor transitions into a multi-pitch owner employing family or assistants across high-footfall spots.',
    icon: '👑',
    metricLabel: 'Cart Fleet',
    metricValue: '2+ Thelas',
    points: 1000,
  },
];

export const VendorJourney: React.FC<VendorJourneyProps> = ({
  user,
  lang = 'en',
  onOpenConfigurator,
}) => {
  // Local storage persisted milestone tracking
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cartwala_growth_milestones');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Milestone storage load:', e);
    }
    // Default unlocked milestones for inspiring new visitors:
    return ['first_watt', 'first_upi', 'voice_activated', 'hundredth_order'];
  });

  const [selectedStageTab, setSelectedStageTab] = useState<number>(1);
  const [showCertificate, setShowCertificate] = useState(false);
  const [recentUnlocked, setRecentUnlocked] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cartwala_growth_milestones', JSON.stringify(completedMilestones));
    } catch (e) {
      console.warn('Milestone storage save:', e);
    }
  }, [completedMilestones]);

  const toggleMilestone = (milestone: Milestone) => {
    const isCompleted = completedMilestones.includes(milestone.id);

    if (!isCompleted) {
      const next = [...completedMilestones, milestone.id];
      setCompletedMilestones(next);
      setRecentUnlocked(milestone.title);

      // Sound & particle feedback
      triggerSolarBurst(window.innerWidth / 2, 350);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFB800', '#E63946', '#10B981'],
      });

      if (milestone.id.includes('upi') || milestone.id.includes('order')) {
        soundbox.playUpiChime();
      } else if (milestone.id.includes('voice')) {
        soundbox.playChaatCall();
      } else {
        soundbox.playMasalaChaiCall();
      }
    } else {
      setCompletedMilestones(completedMilestones.filter((id) => id !== milestone.id));
      setRecentUnlocked(null);
    }
  };

  // Quick Action Simulators
  const handleSimulate100thOrder = () => {
    if (!completedMilestones.includes('hundredth_order')) {
      const m = MILESTONES.find((item) => item.id === 'hundredth_order');
      if (m) toggleMilestone(m);
    } else {
      soundbox.playUpiChime();
      confetti({ particleCount: 30, spread: 45 });
    }
  };

  const handleSimulateFirstWatt = () => {
    if (!completedMilestones.includes('first_watt')) {
      const m = MILESTONES.find((item) => item.id === 'first_watt');
      if (m) toggleMilestone(m);
    } else {
      soundbox.playMasalaChaiCall();
      triggerSolarBurst(window.innerWidth / 2, 400);
    }
  };

  const handleSimulateSoundbox = () => {
    soundbox.playChaatCall();
    if (!completedMilestones.includes('voice_activated')) {
      const m = MILESTONES.find((item) => item.id === 'voice_activated');
      if (m) toggleMilestone(m);
    }
  };

  const handleResetProgress = () => {
    setCompletedMilestones(['first_watt']);
    setRecentUnlocked(null);
  };

  // Calculations
  const totalCount = MILESTONES.length;
  const completedCount = completedMilestones.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Dynamic user rank based on milestones completed
  const currentRank =
    completedCount >= 10
      ? 'Stage 4: Bhartiya Street Titan 👑'
      : completedCount >= 7
      ? 'Stage 3: Commercial Scale Pioneer 🎖️'
      : completedCount >= 4
      ? 'Stage 2: Green Merchant Momentum 🛡️'
      : 'Stage 1: Street Pioneer ⚡';

  const steps24Hour = [
    {
      num: '01',
      title: 'PREPARE (6:00 AM)',
      desc: 'Morning tray loading at mandi; cold bay stays pre-chilled using overnight stored charge.',
      badge: 'Cold Bay Armed',
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    },
    {
      num: '02',
      title: 'ROLL (7:30 AM)',
      desc: 'Smooth sealed bearing push. 60% less effort required over broken city asphalt.',
      badge: 'Ergonomic Push',
      img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80',
    },
    {
      num: '03',
      title: 'SERVE (12:00 PM)',
      desc: 'Peak solar generation. Blenders run freely. High hygienic appearance builds consumer trust.',
      badge: 'Peak 400W Harvest',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    },
    {
      num: '04',
      title: 'COMMUNICATE (5:00 PM)',
      desc: 'Rush-hour evening crowd hears your broadcast clearly across market chatter without throat fatigue.',
      badge: '10W Smart PA',
      img: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=400&q=80',
    },
    {
      num: '05',
      title: 'FLOURISH (10:00 PM)',
      desc: 'Count higher cash and UPI earnings. Zero generator bills. Quick lock, plug-free sleep.',
      badge: '+₹3000/mo Saved',
      img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white border-b border-[#F2EAE0] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ======================================================== */}
        {/* 1. 24-HOUR REALITY SECTION                               */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-[#837560] tracking-wider uppercase flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>The 24-Hour Reality • Operational Workflow</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1E1E24] mt-1">
              Built Around the Real Street Shift
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#514532] max-w-md">
            How Cartwala optimizes every step of daily street commerce from dawn mandi procurement to late
            night bazaar closing.
          </p>
        </div>

        {/* 5-Step Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {steps24Hour.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] rounded-2xl p-3.5 sm:p-4 border border-[#F2EAE0] hover:border-[#FFB800] hover:bg-[#FFFDF9] transition-all flex flex-col justify-between group overflow-hidden shadow-xs hover:shadow-md"
            >
              <div>
                <div className="w-full h-28 rounded-xl overflow-hidden mb-3 relative">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-black text-[#FFB800] font-mono">
                    {step.num}
                  </div>
                </div>

                <div className="font-heading font-bold text-sm text-[#1E1E24] group-hover:text-[#E63946] transition-colors">
                  {step.title}
                </div>
                <p className="text-xs text-[#514532] mt-1.5 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F2EAE0] flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#837560]">{step.badge}</span>
                <Clock className="w-3 h-3 text-[#FFB800]" />
              </div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 2. THE GROWTH LADDER SECTION                             */}
        {/* ======================================================== */}
        <div id="growth-ladder" className="pt-8 border-t border-[#F2EAE0]">
          {/* Growth Ladder Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-[#FFB800] text-xs font-bold text-[#7c5800] mb-2">
                <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Vendor Dignity & Enterprise Roadmap</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1E24] tracking-tight">
                The Entrepreneur's{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946]">
                  Growth Ladder
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#514532] mt-1 max-w-xl">
                Track real commercial milestones from your very first solar watt to 10,000 happy meals.
                Click any milestone below to record your progress or test audio simulations.
              </p>
            </div>

            {/* Quick Actions Cluster */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowCertificate(true)}
                data-cursor="cta"
                className="px-4 py-2 rounded-full bg-white hover:bg-neutral-50 text-[#1E1E24] font-bold text-xs border border-[#F2EAE0] shadow-xs flex items-center space-x-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>View Milestone Certificate</span>
              </button>

              <button
                onClick={handleResetProgress}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="Reset Milestone Progress"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Progress Scoreboard Card */}
          <div className="bg-gradient-to-br from-[#121826] via-[#1A2234] to-[#0A1128] text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Current Rank & Progress Bar */}
              <div className="md:col-span-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-[#FFB800] uppercase font-bold tracking-widest">
                    ACTIVE VENDOR TIER
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="text-xl sm:text-2xl font-black text-white">{currentRank}</div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Ladder Completion</span>
                    <span className="font-mono font-bold text-amber-400">
                      {completedCount} of {totalCount} Milestones ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {recentUnlocked && (
                  <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Just Unlocked: "{recentUnlocked}"!</span>
                  </div>
                )}
              </div>

              {/* Right Column: Live Simulated Metrics & 1-Click Interactive Test Triggers */}
              <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-slate-700/80 pt-4 md:pt-0 md:pl-6 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Milestone Simulators (Test in Real-Time):
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSimulateFirstWatt}
                    data-cursor="cta"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 flex items-center space-x-1.5 border border-slate-700 transition-colors active:scale-95"
                  >
                    <span>⚡ First Solar Watt</span>
                  </button>

                  <button
                    onClick={handleSimulate100thOrder}
                    data-cursor="cta"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 flex items-center space-x-1.5 border border-slate-700 transition-colors active:scale-95"
                  >
                    <span>💯 100th Order Chime</span>
                  </button>

                  <button
                    onClick={handleSimulateSoundbox}
                    data-cursor="cta"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-300 flex items-center space-x-1.5 border border-slate-700 transition-colors active:scale-95"
                  >
                    <span>📢 10W PA Broadcast</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Total Solar Saved</div>
                    <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
                      ₹{(completedCount * 1200).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Clean Food Served</div>
                    <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
                      {completedCount >= 10 ? '10K+' : completedCount >= 4 ? '500+' : '100+'}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">SVANidhi Score</div>
                    <div className="text-xs font-black text-cyan-400 font-mono mt-0.5">
                      {720 + completedCount * 6} Pts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Stage Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {GROWTH_STAGES.map((stg) => {
              const isActive = selectedStageTab === stg.id;
              const stageMilestones = MILESTONES.filter((m) => m.stageId === stg.id);
              const stageCompletedCount = stageMilestones.filter((m) =>
                completedMilestones.includes(m.id)
              ).length;
              const isStageDone = stageCompletedCount === stageMilestones.length;

              return (
                <button
                  key={stg.id}
                  onClick={() => setSelectedStageTab(stg.id)}
                  data-cursor="nav"
                  className={`px-4 py-2.5 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                    isActive
                      ? 'bg-[#1E1E24] text-white border-[#1E1E24] shadow-md'
                      : 'bg-white text-[#514532] border-[#F2EAE0] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isStageDone
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-[#FFB800] text-black'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {isStageDone ? '✓' : stg.id}
                  </div>
                  <div>
                    <div className="text-xs font-black leading-tight flex items-center space-x-1.5">
                      <span>{stg.name}</span>
                      <span className="text-[10px] opacity-70 font-normal">({stg.timeline})</span>
                    </div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {stageCompletedCount} / {stageMilestones.length} Done
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Milestones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MILESTONES.filter((m) => m.stageId === selectedStageTab).map((m) => {
              const isDone = completedMilestones.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m)}
                  data-cursor="cta"
                  className={`rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isDone
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm ring-1 ring-emerald-300'
                      : 'bg-white border-[#F2EAE0] hover:border-[#FFB800] hover:bg-[#FFFDF9]'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon & Status Toggle */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-neutral-100">
                        {m.icon}
                      </span>
                      <div className="flex items-center space-x-1">
                        {isDone ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unlocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                            <Circle className="w-3 h-3" />
                            <span>Click to Unlock</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-xs font-bold text-[#837560]">{m.hindiTitle}</div>
                    <h4 className="font-heading font-black text-base text-[#1E1E24] mt-0.5">
                      {m.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-[#514532] mt-2 leading-relaxed">{m.description}</p>
                  </div>

                  {/* Bottom Metrics Pill */}
                  <div className="mt-5 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#837560]">{m.metricLabel}:</span>
                    <span className="font-mono font-black text-[#1E1E24] bg-white px-2 py-0.5 rounded-lg border border-neutral-200 shadow-xs">
                      {m.metricValue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stage Completion Reward Banner */}
          {GROWTH_STAGES.find((s) => s.id === selectedStageTab) && (
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#F2EAE0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="p-3 rounded-2xl bg-white border border-[#F2EAE0] text-2xl shadow-xs">
                  🎖️
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#837560] tracking-wider">
                    Stage {selectedStageTab} Official Reward Badge
                  </div>
                  <div className="text-sm font-black text-[#1E1E24]">
                    {GROWTH_STAGES.find((s) => s.id === selectedStageTab)?.badge}
                  </div>
                  <div className="text-xs text-[#514532]">
                    {GROWTH_STAGES.find((s) => s.id === selectedStageTab)?.description}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCertificate(true)}
                data-cursor="cta"
                className="px-5 py-2.5 rounded-full bg-[#1E1E24] text-[#FFB800] hover:bg-black font-extrabold text-xs shadow-md transition-transform active:scale-95 shrink-0"
              >
                Claim Digital Certificate →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DIGITAL VENDOR ACHIEVEMENT CERTIFICATE MODAL          */}
      {/* ======================================================== */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#FFFDF9] border-4 border-[#FFB800] rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1E1E24] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-[#F2EAE0] pb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FFB800] to-[#E63946] flex items-center justify-center text-3xl shadow-lg shadow-[#FFB800]/30 text-white">
                🏛️
              </div>
              <div className="text-[10px] font-mono tracking-widest text-[#837560] uppercase font-bold">
                BHARAT STREET ENTREPRENEURSHIP MODERNIZATION COUNCIL
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#1E1E24]">
                Cartवाला Clean Energy Merchant Certificate
              </h3>
              <p className="text-xs text-[#514532]">
                Official recognition under PM SVANidhi Micro-Enterprise Modernization Framework
              </p>
            </div>

            {/* Certificate Body */}
            <div className="py-6 space-y-4 text-center">
              <div className="text-xs text-[#837560] uppercase tracking-wider">
                This certifies that
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#1E1E24] underline decoration-[#FFB800] decoration-2">
                {user?.displayName || 'Swabhimani Street Vendor'}
              </div>
              <p className="text-xs sm:text-sm text-[#514532] max-w-lg mx-auto leading-relaxed">
                has officially unlocked <strong>{completedCount} Commercial Milestones</strong> on the
                Cartwala Growth Ladder, operating with 400W rooftop solar autonomy, 0% food spoilage, and
                hygienic 304 food-grade stainless infrastructure.
              </p>

              {/* Certificate Badges & Seals */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-md mx-auto">
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <div className="text-lg">⚡</div>
                  <div className="text-[10px] font-bold text-amber-900 mt-0.5">Solar Certified</div>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <div className="text-lg">🛡️</div>
                  <div className="text-[10px] font-bold text-emerald-900 mt-0.5">FSSAI Hygiene</div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                  <div className="text-lg">📱</div>
                  <div className="text-[10px] font-bold text-blue-900 mt-0.5">UPI Verified</div>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="pt-4 border-t-2 border-[#F2EAE0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-[10px] text-[#837560] text-center sm:text-left">
                <div>Certificate ID: CW-SVANIDHI-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div>Authorized by Cartwala Engineering Council · Indore, MP</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-100 font-bold text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>

                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Namaste! I just unlocked ${completedCount} milestones on the Cartwala Growth Ladder with solar autonomy! Check out Cartwala: https://cartwala.in`
                    );
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
