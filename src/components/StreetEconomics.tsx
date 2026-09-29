import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  MapPin,
  Coffee,
  Citrus,
  Flame,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Sliders,
  DollarSign,
  Calendar,
  Volume2,
  Clock,
  Share2,
  Printer,
  ChevronRight,
  Award,
  AlertCircle,
} from 'lucide-react';
import { triggerSolarBurst, scrollToElement } from '../utils/animations';
import { soundbox } from '../utils/audio';

interface BusinessPreset {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  img: string;
  defaultTicket: number;
  cogsPercent: number; // Cost of goods sold %
  spoilageRisk: number; // Estimated % spoilage on traditional carts
  audioAction: 'chai' | 'chaat' | 'upi';
  recommendedFeatures: string[];
}

const BUSINESS_CATEGORIES: BusinessPreset[] = [
  {
    id: 'chai_snacks',
    name: 'Masala Chai & Bun Maska',
    hindiName: 'मसाला चाय एवं नाश्ता',
    icon: '☕',
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80',
    defaultTicket: 35,
    cogsPercent: 32,
    spoilageRisk: 8,
    audioAction: 'chai',
    recommendedFeatures: ['400W Solar Roof', '10W PA Soundbox', 'Stainless Prep Trays'],
  },
  {
    id: 'juices_cold',
    name: 'Fresh Cold Juices & Shakes',
    hindiName: 'ताजा जूस एवं शेक्स',
    icon: '🍉',
    img: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=300&q=80',
    defaultTicket: 65,
    cogsPercent: 38,
    spoilageRisk: 18,
    audioAction: 'upi',
    recommendedFeatures: ['4°C Active Cold Bay', '400W Solar Roof', 'Sneeze Guard'],
  },
  {
    id: 'chaat_fastfood',
    name: 'Mumbai Chaat, Bhel & Pani Puri',
    hindiName: 'चाट, भेल एवं पानी पूरी',
    icon: '🥘',
    img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
    defaultTicket: 60,
    cogsPercent: 35,
    spoilageRisk: 12,
    audioAction: 'chaat',
    recommendedFeatures: ['4x GN Inserts', '10W PA Soundbox', '304 Stainless Counter'],
  },
  {
    id: 'momos_chinese',
    name: 'Steamed Momos & Chinese Wok',
    hindiName: 'मोमोज एवं चाइनीज स्नैक्स',
    icon: '🥟',
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=300&q=80',
    defaultTicket: 85,
    cogsPercent: 40,
    spoilageRisk: 14,
    audioAction: 'upi',
    recommendedFeatures: ['400W Solar Roof', 'High-Output Batteries', 'Sneeze Guard'],
  },
  {
    id: 'fruits_salad',
    name: 'Exotic Cut Fruits & Coconut',
    hindiName: 'ताजे कटे फल एवं नारियल',
    icon: '🥭',
    img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=300&q=80',
    defaultTicket: 70,
    cogsPercent: 42,
    spoilageRisk: 22,
    audioAction: 'upi',
    recommendedFeatures: ['4°C Active Cold Storage', '400W Solar Roof', 'Stainless Prep Trays'],
  },
];

interface LocationPreset {
  id: string;
  name: string;
  type: string;
  defaultFootfall: number;
  peakHours: string;
  multiplier: number;
}

const LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'metro_it',
    name: 'Metro Station / IT Tech Park Gate',
    type: 'High-Volume Commuters & Professionals',
    defaultFootfall: 240,
    peakHours: '8:30 AM – 11:30 AM & 5:30 PM – 9:00 PM',
    multiplier: 1.15,
  },
  {
    id: 'railway_bus',
    name: 'Railway Junction / Bus Terminus',
    type: 'Continuous 24/7 Traveling Crowds',
    defaultFootfall: 280,
    peakHours: 'All-Day Steady Footfall',
    multiplier: 1.1,
  },
  {
    id: 'night_market',
    name: 'Night Food Street / Khau Galli',
    type: 'Evening Leisure & Family Dining',
    defaultFootfall: 210,
    peakHours: '6:30 PM – 11:30 PM (Night Bazaar Peak)',
    multiplier: 1.25,
  },
  {
    id: 'college_hub',
    name: 'University / Coaching Institute Hub',
    type: 'Student Budget Volume',
    defaultFootfall: 190,
    peakHours: '12:00 PM – 2:30 PM & 4:30 PM – 7:30 PM',
    multiplier: 0.95,
  },
  {
    id: 'residential_bazaar',
    name: 'Weekly Residential Haat / High Street',
    type: 'Local Neighborhood Regulars',
    defaultFootfall: 150,
    peakHours: '5:00 PM – 9:30 PM',
    multiplier: 1.0,
  },
];

export const StreetEconomics: React.FC = () => {
  // Calculator States
  const [selectedCategory, setSelectedCategory] = useState<BusinessPreset>(BUSINESS_CATEGORIES[0]);
  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(LOCATION_PRESETS[0]);
  const [dailyCustomers, setDailyCustomers] = useState<number>(240);
  const [avgTicket, setAvgTicket] = useState<number>(35);
  const [operatingDays, setOperatingDays] = useState<number>(26);

  // Cart Hardware Option Toggles
  const [hasSolarCanopy, setHasSolarCanopy] = useState(true);
  const [hasActiveChiller, setHasActiveChiller] = useState(true);
  const [hasSoundbox, setHasSoundbox] = useState(true);
  const [applySubsidy, setApplySubsidy] = useState(true);
  const [acquisitionPlan, setAcquisitionPlan] = useState<'own' | 'rent_daily' | 'rent_monthly' | 'rent_to_own'>('own');

  // View Mode: 'calculator' | 'comparison' | 'financial_sheet'
  const [activeView, setActiveView] = useState<'calculator' | 'comparison'>('calculator');
  const [copiedLink, setCopiedLink] = useState(false);

  // Handle Preset Changes
  const handleCategorySelect = (cat: BusinessPreset) => {
    setSelectedCategory(cat);
    setAvgTicket(cat.defaultTicket);
    triggerSolarBurst(window.innerWidth / 2, 400);
  };

  const handleLocationSelect = (loc: LocationPreset) => {
    setSelectedLocation(loc);
    setDailyCustomers(loc.defaultFootfall);
  };

  // Financial Calculations
  const metrics = useMemo(() => {
    const grossDailyRevenue = dailyCustomers * avgTicket;
    const grossMonthlyRevenue = grossDailyRevenue * operatingDays;

    // COGS
    const monthlyIngredientsCost = grossMonthlyRevenue * (selectedCategory.cogsPercent / 100);

    // Monthly Solar Energy Savings vs Diesel Gen / Illegal Wire Rent
    // A normal thela pays ₹120 to ₹150 every night for generator wire hooks or petrol (~₹3,600/mo)
    const solarFuelSavings = hasSolarCanopy ? 3600 : 0;

    // Ice & Spoilage Savings from Active 4°C Chiller
    // Normal vendors buy 2 blocks of ice daily (₹100/day = ₹2,600/mo) + lose 12-20% perishables
    const icePurchasesSaved = hasActiveChiller ? 2600 : 0;
    const spoilageValueSaved = hasActiveChiller
      ? grossMonthlyRevenue * (selectedCategory.spoilageRisk / 100) * 0.7
      : 0;

    // Additional customer conversion from 10W Smart Soundbox voice announcements (+12% volume)
    const soundboxIncrementalRevenue = hasSoundbox ? grossMonthlyRevenue * 0.12 : 0;

    // Total Monthly Out-Of-Pocket Expenses for the Cart
    let monthlyCartPayment = 0;
    if (acquisitionPlan === 'own') {
      // 5-Year PM SVANidhi 7% subsidized EMI on ~₹44,999 (less ₹10,000 subsidy = ₹34,999)
      const principal = applySubsidy ? 34999 : 44999;
      monthlyCartPayment = Math.round((principal / 36) * 1.05); // ~₹1,020/mo
    } else if (acquisitionPlan === 'rent_daily') {
      monthlyCartPayment = 149 * operatingDays; // ₹149/day
    } else if (acquisitionPlan === 'rent_monthly') {
      monthlyCartPayment = 3499; // ₹3,499/mo
    } else {
      monthlyCartPayment = 199 * operatingDays; // Rent-to-own ₹199/day
    }

    const totalMonthlySolarSavings = solarFuelSavings + icePurchasesSaved + Math.round(spoilageValueSaved);
    const adjustedGrossRevenue = grossMonthlyRevenue + soundboxIncrementalRevenue;
    const netMonthlyProfit =
      adjustedGrossRevenue - monthlyIngredientsCost + totalMonthlySolarSavings - monthlyCartPayment;

    const netDailyIncome = Math.round(netMonthlyProfit / operatingDays);
    const profitMargin = Math.round((netMonthlyProfit / adjustedGrossRevenue) * 100);

    // Payback calculation for full ownership
    const netCapitalInvestment = applySubsidy ? 34999 : 44999;
    const netProfitGainPerDay = Math.round((totalMonthlySolarSavings + soundboxIncrementalRevenue * 0.6) / operatingDays);
    const paybackDays = Math.max(28, Math.round(netCapitalInvestment / (netProfitGainPerDay || 400)));

    // Traditional cart comparison benchmark
    const tradGeneratorCost = 3600;
    const tradIceCost = 2600;
    const tradSpoilageLoss = Math.round(grossMonthlyRevenue * (selectedCategory.spoilageRisk / 100));
    const tradNetProfit =
      grossMonthlyRevenue - monthlyIngredientsCost - tradGeneratorCost - tradIceCost - tradSpoilageLoss;

    const monthlyIncomeBoost = Math.max(0, netMonthlyProfit - tradNetProfit);

    return {
      grossMonthlyRevenue: Math.round(adjustedGrossRevenue),
      monthlyIngredientsCost: Math.round(monthlyIngredientsCost),
      totalMonthlySolarSavings,
      monthlyCartPayment,
      netMonthlyProfit: Math.round(netMonthlyProfit),
      netDailyIncome,
      profitMargin,
      paybackDays,
      tradNetProfit: Math.max(12000, Math.round(tradNetProfit)),
      monthlyIncomeBoost: Math.round(monthlyIncomeBoost),
      annualNetEarnings: Math.round(netMonthlyProfit * 12),
    };
  }, [
    dailyCustomers,
    avgTicket,
    operatingDays,
    selectedCategory,
    hasSolarCanopy,
    hasActiveChiller,
    hasSoundbox,
    applySubsidy,
    acquisitionPlan,
  ]);

  // Audio feature preview
  const handlePlayCategorySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerSolarBurst(e.clientX, e.clientY);
    if (selectedCategory.audioAction === 'chai') {
      soundbox.playMasalaChaiCall();
    } else if (selectedCategory.audioAction === 'chaat') {
      soundbox.playChaatCall();
    } else {
      soundbox.playUpiChime();
    }
  };

  // Generate WhatsApp inquiry text with exact financial estimates
  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(
      `*Namaste Cartwala Team!* 🛺\n\nI just calculated my business ROI for *${selectedCategory.name}* at *${selectedLocation.name}*:\n\n` +
        `• *Projected Daily Customers:* ${dailyCustomers} (Avg Ticket: ₹${avgTicket})\n` +
        `• *Estimated Monthly Gross:* ₹${metrics.grossMonthlyRevenue.toLocaleString('en-IN')}\n` +
        `• *Solar & Ice Savings:* ₹${metrics.totalMonthlySolarSavings.toLocaleString('en-IN')}/mo\n` +
        `• *Projected Net Monthly Income:* ₹${metrics.netMonthlyProfit.toLocaleString('en-IN')}\n` +
        `• *PM SVANidhi ₹10K Subsidy:* ${applySubsidy ? 'Yes (Claimed)' : 'No'}\n` +
        `• *Acquisition Plan:* ${acquisitionPlan.toUpperCase()}\n\n` +
        `Please verify unit availability and dispatch timeline for my city!`
    );
    window.open(`https://wa.me/919302184644?text=${text}`, '_blank');
  };

  return (
    <section id="economics" className="py-16 lg:py-24 bg-[#FAF7F2] border-t border-[#F2EAE0] scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#F2EAE0] px-4 py-1.5 rounded-full text-xs font-bold text-[#7c5800] shadow-xs mb-3">
            <IndianRupee className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Interactive Street ROI Simulator • Real Economics & Payback</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1E24] tracking-tight">
            Calculate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946]">
              Net Monthly Income
            </span>
          </h2>
          <p className="text-[#514532] text-sm sm:text-base mt-2">
            Select your menu, prime street location, and cart hardware. See exactly how zero diesel costs,
            4°C food preservation, and PM SVANidhi subsidies turn your thela into a high-profit engine.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              onClick={() => setActiveView('calculator')}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
                activeView === 'calculator'
                  ? 'bg-[#1E1E24] text-[#FFB800] shadow-md'
                  : 'bg-white text-[#514532] border border-[#F2EAE0] hover:bg-neutral-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive ROI Calculator</span>
            </button>
            <button
              onClick={() => setActiveView('comparison')}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 ${
                activeView === 'comparison'
                  ? 'bg-[#1E1E24] text-[#FFB800] shadow-md'
                  : 'bg-white text-[#514532] border border-[#F2EAE0] hover:bg-neutral-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Old Thela vs. Cartwala Battle Card</span>
            </button>
          </div>
        </div>

        {activeView === 'calculator' ? (
          /* ======================================================== */
          /* INTERACTIVE ROI CALCULATOR TOOL                          */
          /* ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Configuration Controls & Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Business Category Preset */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F2EAE0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-black text-[#1E1E24] flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-[11px] font-black">
                      1
                    </span>
                    <span>Select Business / Food Trade</span>
                  </div>
                  <button
                    onClick={handlePlayCategorySound}
                    data-cursor="cta"
                    className="flex items-center space-x-1 text-[11px] font-bold text-[#E63946] hover:underline"
                    title="Test Voice Announcement for this food item"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Soundbox Call</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BUSINESS_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        data-cursor="nav"
                        className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-50/90 border-[#FFB800] shadow-sm ring-2 ring-[#FFB800]'
                            : 'bg-neutral-50/60 border-[#F2EAE0] hover:bg-white'
                        }`}
                      >
                        <div className="w-full h-16 rounded-xl overflow-hidden mb-2 relative">
                          <img
                            src={cat.img}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-xs shadow-xs">
                            {cat.icon}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-black text-[#1E1E24] leading-snug line-clamp-1">{cat.name}</div>
                          <div className="text-[10px] text-[#837560] mt-0.5">{cat.hindiName}</div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#FFB800] shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Location Pitch & Footfall Type */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F2EAE0] shadow-sm">
                <div className="text-xs font-black text-[#1E1E24] flex items-center space-x-1.5 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  <span>Select Prime Street Location Footfall</span>
                </div>

                <div className="space-y-2">
                  {LOCATION_PRESETS.map((loc) => {
                    const isSelected = selectedLocation.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => handleLocationSelect(loc)}
                        data-cursor="nav"
                        className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-50/80 border-[#FFB800] shadow-xs'
                            : 'bg-neutral-50/40 border-[#F2EAE0] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? 'text-[#E63946]' : 'text-neutral-400'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-bold text-[#1E1E24]">{loc.name}</div>
                            <div className="text-[10px] text-[#837560]">
                              {loc.type} · Peak: {loc.peakHours}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black font-mono text-[#1E1E24]">
                            ~{loc.defaultFootfall}
                          </div>
                          <div className="text-[9px] text-[#837560]">buyers/day</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Interactive Sliders (Fine-Tuning) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F2EAE0] shadow-sm space-y-5">
                <div className="text-xs font-black text-[#1E1E24] flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-[11px] font-black">
                    3
                  </span>
                  <span>Fine-Tune Daily Operational Parameters</span>
                </div>

                {/* Slider 1: Daily Customers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#514532]">Daily Paying Customers</span>
                    <span className="font-black text-sm font-mono text-[#1E1E24] bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                      {dailyCustomers} Customers / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="450"
                    step="10"
                    value={dailyCustomers}
                    onChange={(e) => setDailyCustomers(Number(e.target.value))}
                    className="w-full accent-[#FFB800] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#837560]">
                    <span>50 Quiet Day</span>
                    <span>240 Standard Busy Pitch</span>
                    <span>450 Festival / Rush Crowd</span>
                  </div>
                </div>

                {/* Slider 2: Average Ticket Size */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#514532]">Average Order Value (Ticket Size)</span>
                    <span className="font-black text-sm font-mono text-[#1E1E24] bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                      ₹{avgTicket} per order
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={avgTicket}
                    onChange={(e) => setAvgTicket(Number(e.target.value))}
                    className="w-full accent-[#FFB800] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#837560]">
                    <span>₹20 (Single Chai)</span>
                    <span>₹65 (Chai + Snacks / Juice)</span>
                    <span>₹200 (Combo Pack)</span>
                  </div>
                </div>

                {/* Slider 3: Working Days */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#514532]">Operating Days per Month</span>
                    <span className="font-black text-sm font-mono text-[#1E1E24] bg-neutral-100 px-2.5 py-0.5 rounded-lg border border-neutral-200">
                      {operatingDays} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="30"
                    step="1"
                    value={operatingDays}
                    onChange={(e) => setOperatingDays(Number(e.target.value))}
                    className="w-full accent-[#FFB800] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#837560]">
                    <span>20 Days (4-day week)</span>
                    <span>26 Days (1 day rest)</span>
                    <span>30 Days (Continuous)</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Hardware Modifiers & Acquisition Plan */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#F2EAE0] shadow-sm space-y-4">
                <div className="text-xs font-black text-[#1E1E24] flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black flex items-center justify-center text-[11px] font-black">
                    4
                  </span>
                  <span>Cart Hardware Setup & Financing Scheme</span>
                </div>

                {/* Hardware Toggle Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setHasSolarCanopy(!hasSolarCanopy)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      hasSolarCanopy
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 line-through'
                    }`}
                  >
                    <span>☀️ 400W Solar Autonomy</span>
                    <span className="text-[10px] font-mono">+₹3,600/mo saved</span>
                  </button>

                  <button
                    onClick={() => setHasActiveChiller(!hasActiveChiller)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      hasActiveChiller
                        ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-bold'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 line-through'
                    }`}
                  >
                    <span>❄️ 4°C Ice-Free Chiller</span>
                    <span className="text-[10px] font-mono">0% Spoilage</span>
                  </button>

                  <button
                    onClick={() => setHasSoundbox(!hasSoundbox)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      hasSoundbox
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-bold'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 line-through'
                    }`}
                  >
                    <span>📢 10W Soundbox + UPI</span>
                    <span className="text-[10px] font-mono">+12% Footfall</span>
                  </button>

                  <button
                    onClick={() => setApplySubsidy(!applySubsidy)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                      applySubsidy
                        ? 'bg-red-50/80 border-red-300 text-red-950 font-bold'
                        : 'bg-neutral-50 text-neutral-400 border-neutral-200 line-through'
                    }`}
                  >
                    <span>🛡️ PM SVANidhi Subsidy</span>
                    <span className="text-[10px] font-mono">-₹10,000 Direct</span>
                  </button>
                </div>

                {/* Acquisition Plan Selection */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="text-[11px] font-bold text-[#837560] mb-2 uppercase">
                    Select Your Cart Acquisition Mode:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                    <button
                      onClick={() => setAcquisitionPlan('own')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        acquisitionPlan === 'own'
                          ? 'bg-[#1E1E24] text-[#FFB800] border-[#1E1E24] shadow-xs'
                          : 'bg-neutral-50 text-[#514532] border-[#F2EAE0]'
                      }`}
                    >
                      <div>Buy Outright</div>
                      <div className="text-[9px] opacity-70">₹1,020/mo EMI</div>
                    </button>
                    <button
                      onClick={() => setAcquisitionPlan('rent_daily')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        acquisitionPlan === 'rent_daily'
                          ? 'bg-[#1E1E24] text-[#FFB800] border-[#1E1E24] shadow-xs'
                          : 'bg-neutral-50 text-[#514532] border-[#F2EAE0]'
                      }`}
                    >
                      <div>Daily Rent</div>
                      <div className="text-[9px] opacity-70">₹149 / day</div>
                    </button>
                    <button
                      onClick={() => setAcquisitionPlan('rent_monthly')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        acquisitionPlan === 'rent_monthly'
                          ? 'bg-[#1E1E24] text-[#FFB800] border-[#1E1E24] shadow-xs'
                          : 'bg-neutral-50 text-[#514532] border-[#F2EAE0]'
                      }`}
                    >
                      <div>Monthly Lease</div>
                      <div className="text-[9px] opacity-70">₹3,499 / mo</div>
                    </button>
                    <button
                      onClick={() => setAcquisitionPlan('rent_to_own')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        acquisitionPlan === 'rent_to_own'
                          ? 'bg-[#1E1E24] text-[#FFB800] border-[#1E1E24] shadow-xs'
                          : 'bg-neutral-50 text-[#514532] border-[#F2EAE0]'
                      }`}
                    >
                      <div>Rent-to-Own</div>
                      <div className="text-[9px] opacity-70">₹199 / day</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Financial Report Card & ROI Badge */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div className="bg-gradient-to-b from-[#121826] via-[#1A2234] to-[#0F172A] text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl relative overflow-hidden">
                {/* Glow Backdrop */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#FFB800]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-[#FFB800] uppercase font-bold">
                      PROJECTED VENDOR BALANCE SHEET
                    </div>
                    <div className="text-base font-black text-white mt-0.5">
                      {selectedCategory.name}
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black">
                    {metrics.profitMargin}% Net Margin
                  </div>
                </div>

                {/* Primary Financial Metric: Net Monthly Take-Home */}
                <div className="py-6 text-center">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Estimated Net Monthly Profit
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946] font-mono mt-1">
                    ₹{metrics.netMonthlyProfit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center justify-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>~₹{metrics.netDailyIncome.toLocaleString('en-IN')} Net Income / Working Day</span>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="space-y-2.5 text-xs pt-4 border-t border-slate-700/80">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Gross Monthly Revenue:</span>
                    <span className="font-bold text-white font-mono">
                      +₹{metrics.grossMonthlyRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Raw Ingredients & Prep ({selectedCategory.cogsPercent}%):</span>
                    <span className="font-bold text-red-400 font-mono">
                      -₹{metrics.monthlyIngredientsCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <Zap className="w-3 h-3 text-[#FFB800]" />
                      <span>Solar, Ice & Spoilage Savings:</span>
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +₹{metrics.totalMonthlySolarSavings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cartwala Equipment Installment:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      -₹{metrics.monthlyCartPayment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payback & Advantage Metric Banner */}
                <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#FFB800] uppercase">
                      Full Capital Payback
                    </div>
                    <div className="text-lg font-black text-white font-mono mt-0.5">
                      {metrics.paybackDays} Days
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Annual Net Wealth
                    </div>
                    <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                      ₹{(metrics.annualNetEarnings / 100000).toFixed(1)} Lakhs/yr
                    </div>
                  </div>
                </div>

                {/* Additional Feature: Send directly to WhatsApp or Configure */}
                <div className="mt-6 space-y-2.5">
                  <button
                    onClick={handleSendToWhatsApp}
                    data-cursor="cta"
                    className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Send Profit Plan to WhatsApp (+91 93021 84644)</span>
                  </button>

                  <button
                    onClick={() => scrollToElement('#build-cart', -70)}
                    data-cursor="cta"
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#FFB800] to-[#E63946] text-[#1E1E24] hover:opacity-95 font-black text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition-transform active:scale-95"
                  >
                    <span>Reserve Cart for This Plan (-₹10K Subsidy)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Subsidy Note */}
                <div className="mt-3 text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>PM SVANidhi Approved • 100% Refundable ₹999 Booking</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* OLD TRADITIONAL THELA VS. CARTWALA BATTLE CARD           */
          /* ======================================================== */
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#F2EAE0] p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-[#E63946] tracking-wider uppercase">
                Direct Side-by-Side Comparison
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1E1E24] mt-1">
                Why 5,200+ Vendors Switched from Old Thelas
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Traditional Cart */}
              <div className="bg-red-50/50 rounded-2xl p-5 border border-red-200/80 space-y-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-red-200">
                  <div className="text-sm font-black text-red-900 flex items-center space-x-2">
                    <span>❌ Traditional Wooden Thela</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    High Daily Waste
                  </span>
                </div>

                <div className="w-full h-36 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=600&q=80"
                    alt="Traditional Street Cart"
                    className="w-full h-full object-cover grayscale contrast-125"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-red-950/20" />
                </div>

                <div className="space-y-3 text-xs text-[#514532]">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>
                      <strong>₹3,600 / mo on Power:</strong> Coughing kerosene lanterns or paying
                      ₹120-150/night for illegal wire taps from local cartels.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>
                      <strong>₹2,600 / mo on Ice Blocks:</strong> Buying melting dirty factory ice that
                      melts by 3 PM and contaminates fresh juices and dairy.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>
                      <strong>15% Spoilage Losses:</strong> No active cooling means leftover fruits and milk
                      must be dumped at night.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>
                      <strong>Vocal Exhaustion:</strong> Shouting for 9 hours daily causes chronic throat
                      damage and respiratory fatigue.
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-red-200 flex items-center justify-between text-xs font-bold text-red-900">
                  <span>Average Net Monthly Income:</span>
                  <span className="text-base font-black font-mono">
                    ₹{metrics.tradNetProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Cartwala Solar Cart */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border-2 border-emerald-400 shadow-sm space-y-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="text-sm font-black text-emerald-950 flex items-center space-x-2">
                    <span>✅ Cartवाला Solar-Smart Thela</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Sovereign Profit
                  </span>
                </div>

                <div className="w-full h-36 rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                    alt="Cartwala Solar Smart Thela"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-white text-[11px] font-black tracking-wide">
                      400W Solar + 304 Food-Grade Stainless Prep Bay
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-[#1E1E24]">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>
                      <strong>₹0 / mo Power Expense:</strong> 400W rooftop solar canopy generates 2.2 kWh
                      daily, powering the night shift completely free.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>
                      <strong>Solid-State 4°C Chiller:</strong> Zero ice purchases; keeps dairy, fruit, and
                      beverages crisp all day and night.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>
                      <strong>FSSAI Stainless Hygiene:</strong> 304 food-grade counter and sneeze guards build
                      instant middle-class customer trust.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>
                      <strong>10W PA Soundbox & UPI Chime:</strong> Loud automated calling without vocal
                      strain + audible payment alerts.
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-300 flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Projected Net Monthly Income:</span>
                  <span className="text-lg font-black font-mono text-emerald-700">
                    ₹{metrics.netMonthlyProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Income Difference Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-[#1E1E24] text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs text-[#FFB800] font-bold">NET MONTHLY INCOME DIFFERENCE</div>
                <div className="text-2xl font-black text-white font-mono">
                  +₹{metrics.monthlyIncomeBoost.toLocaleString('en-IN')} Extra Every Month
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveView('calculator');
                  triggerSolarBurst(window.innerWidth / 2, 400);
                }}
                className="px-6 py-2.5 rounded-full bg-[#FFB800] text-black font-black text-xs"
              >
                Customize Your Own Setup →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
