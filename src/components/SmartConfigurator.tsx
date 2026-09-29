import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Coffee,
  Utensils,
  Apple,
  Sun,
  Battery,
  Volume2,
  Lightbulb,
  Snowflake,
  ShieldCheck,
  Sparkles,
  Smartphone,
  PhoneCall,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from 'firebase/auth';
import {
  db,
  doc,
  setDoc,
  collection,
  saveOrderToFirebase,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { TradeType, SolarOption } from '../types';

interface SmartConfiguratorProps {
  user: User | null;
  onLogin: () => void;
  lang: 'en' | 'hi';
}

export const SmartConfigurator: React.FC<SmartConfiguratorProps> = ({
  user,
  onLogin,
  lang,
}) => {
  const [planType, setPlanType] = useState<'own' | 'rent_daily' | 'rent_monthly' | 'rent_to_own'>('own');
  const [tradeType, setTradeType] = useState<TradeType>('juice_chai');
  const [solarOption, setSolarOption] = useState<SolarOption>('250w_800wh');
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'voice_pa',
    'night_leds',
  ]);
  const [phoneNumber, setPhoneNumber] = useState('9302184644');
  const [vendorName, setVendorName] = useState('Rajesh Kumar');
  const [city, setCity] = useState('Lucknow');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Pricing Calculation matching image
  // Base cart costs:
  // Juice & Chai: ₹48,000 base
  // Chaat & Dosa: ₹52,000 base
  // Fruits & Veg: ₹45,000 base
  const baseTradePrices: Record<TradeType, number> = {
    juice_chai: 48000,
    chaat_snacks: 52000,
    fruits_veg: 45000,
  };

  const solarAddons: Record<SolarOption, number> = {
    '250w_800wh': 0, // included in base
    '400w_1200wh': 8000,
  };

  const moduleCatalog = [
    {
      id: 'voice_pa',
      name: 'Weatherproof Voice PA & Local Caller System',
      price: 2500,
      icon: Volume2,
    },
    {
      id: 'night_leds',
      name: 'Warm 3000K High-CRI Food Display Lighting',
      price: 3500,
      icon: Lightbulb,
    },
    {
      id: 'cold_chiller',
      name: 'Active Ice-Free Cold Bay Chiller (4°C)',
      price: 4500,
      icon: Snowflake,
    },
  ];

  const modulesTotal = selectedModules.reduce((acc, modId) => {
    const found = moduleCatalog.find((m) => m.id === modId);
    return acc + (found ? found.price : 0);
  }, 0);

  const basePrice =
    baseTradePrices[tradeType] + solarAddons[solarOption] + modulesTotal;
  const subsidyAmount = 10000; // PM SVANidhi 7% standard subsidy deduction
  const finalPrice = Math.max(25000, basePrice - subsidyAmount);
  const emiPerMonth = Math.round(finalPrice / 34); // ~₹1,290 / mo

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleReserve = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number for dispatch.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `CW-${Date.now().toString().slice(-6)}`;

    // Prepare reservation payload
    const orderPayload = {
      orderId,
      userId: user?.uid || `guest-${phoneNumber}`,
      planType,
      tradeType,
      solarArray:
        solarOption === '250w_800wh' ? 'Standard 250W + 800Wh' : 'Pro 400W + 1.2kWh',
      selectedModules,
      basePrice,
      subsidyAmount,
      finalPrice,
      depositPaid: 999,
      phoneNumber,
      vendorName,
      city,
      status: 'reserved',
      createdAt: new Date().toISOString(),
    };

    try {
      // Save directly to Firebase Firestore for real-time order tracking
      await saveOrderToFirebase(orderPayload);

      // Also persist to localStorage for offline cache
      const existing = JSON.parse(localStorage.getItem('cartwala_orders') || '[]');
      existing.push(orderPayload);
      localStorage.setItem('cartwala_orders', JSON.stringify(existing));

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFB800', '#E63946', '#006398', '#1E1E24'],
      });

      setOrderSuccess(orderId);
    } catch (err) {
      console.warn('Firestore write notice:', err);
      // Fallback save locally if network offline
      const existing = JSON.parse(localStorage.getItem('cartwala_orders') || '[]');
      existing.push(orderPayload);
      localStorage.setItem('cartwala_orders', JSON.stringify(existing));
      setOrderSuccess(orderId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="build-cart" className="py-16 bg-white border-b border-[#F2EAE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-[#837560] tracking-wider uppercase">
              Smart Configurator
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1E1E24] mt-1">
              Build Your Cartवाला in 3 Easy Steps
            </h2>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant Subsidy Check for all 28 States</span>
          </div>
        </div>

        {orderSuccess ? (
          <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-3xl p-8 border-2 border-[#FFB800] text-center max-w-2xl mx-auto space-y-5 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Reservation Confirmed • PM SVANidhi Claim Code Generated
              </div>
              <h3 className="font-heading text-2xl font-black text-[#1E1E24] mt-1">
                Order Reference: #{orderSuccess}
              </h3>
              <p className="text-sm text-[#514532] mt-2 max-w-md mx-auto">
                Congratulations! Your ₹999 refundable deposit locks in your
                custom Cartwala unit with 10,000 PM SVANidhi subsidy priority.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#F2EAE0] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-neutral-500">Selected Plan:</span>
                <span className="font-bold text-[#E63946]">
                  {planType === 'own'
                    ? 'Buy with PM SVANidhi Subsidy'
                    : planType === 'rent_daily'
                    ? 'Daily Rental (₹149 / Day)'
                    : planType === 'rent_monthly'
                    ? 'Monthly Rental (₹3,499 / Month)'
                    : 'Rent-to-Own (18 Month Ownership)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact Number:</span>
                <span className="font-bold text-[#1E1E24]">+91 {phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">
                  7-10 Working Days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Factory Dispatch:</span>
                <span className="font-bold text-[#1E1E24]">
                  Pune / Lucknow Facility
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/919302184644?text=Hello%20Cartwala%20Team!%20I%20have%20reserved%20Order%20${orderSuccess}%20for%20my%20business.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Chat with Factory Manager on WhatsApp</span>
              </a>

              <button
                onClick={() => setOrderSuccess(null)}
                className="px-5 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#1E1E24] font-bold text-xs"
              >
                Configure Another Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 3 Steps Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Plan Type Selector: Own vs Rent Options */}
              <div className="bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 border-2 border-[#FFB800] shadow-xs">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-extrabold text-[#1E1E24] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>
                    <span>Choose Plan: Buy or Rent Options (किराया विकल्प)</span>
                  </span>
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">
                    No Credit Score Required
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType('own')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      planType === 'own'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0] hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Buy with Subsidy</div>
                    <div className="text-[10px] opacity-80 mt-0.5">₹44,000 / ₹1,290 mo</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('rent_daily')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      planType === 'rent_daily'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0] hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Daily Rent</div>
                    <div className="text-[10px] opacity-80 mt-0.5">₹149 / Day</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('rent_monthly')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      planType === 'rent_monthly'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0] hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Monthly Rent</div>
                    <div className="text-[10px] opacity-80 mt-0.5">₹3,499 / Month</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('rent_to_own')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      planType === 'rent_to_own'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                        : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0] hover:bg-neutral-100'
                    }`}
                  >
                    <div className="text-xs font-bold">Rent-to-Own</div>
                    <div className="text-[10px] opacity-80 mt-0.5">18 Mo Ownership</div>
                  </button>
                </div>
              </div>

              {/* STEP 01: Business Trade Type */}
              <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#F2EAE0]">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-[#1E1E24] uppercase tracking-wider text-[11px]">
                    Step 01 • Business Trade Type
                  </span>
                  <span className="text-[#837560] font-semibold text-[11px]">
                    Aapka Vyapaar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1 */}
                  <button
                    onClick={() => setTradeType('juice_chai')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all overflow-hidden group ${
                      tradeType === 'juice_chai'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-neutral-100 text-[#1E1E24] border-[#F2EAE0]'
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 relative">
                      <img
                        src="https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=400&q=80"
                        alt="Juice & Chai"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 backdrop-blur-xs">
                        <Coffee className="w-4 h-4 text-[#1E1E24]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        Juice, Shakes & Chai
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        High Chiller & Mixer Power
                      </div>
                    </div>
                  </button>

                  {/* Option 2 */}
                  <button
                    onClick={() => setTradeType('chaat_snacks')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all overflow-hidden group ${
                      tradeType === 'chaat_snacks'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-neutral-100 text-[#1E1E24] border-[#F2EAE0]'
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 relative">
                      <img
                        src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
                        alt="Chaat & Snacks"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 backdrop-blur-xs">
                        <Utensils className="w-4 h-4 text-[#1E1E24]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        Chaat, Snacks & Dosa
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        Deep Modular GN Trays
                      </div>
                    </div>
                  </button>

                  {/* Option 3 */}
                  <button
                    onClick={() => setTradeType('fruits_veg')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all overflow-hidden group ${
                      tradeType === 'fruits_veg'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-neutral-100 text-[#1E1E24] border-[#F2EAE0]'
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-2.5 relative">
                      <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80"
                        alt="Fruits & Veg"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 p-1 rounded-md bg-white/90 backdrop-blur-xs">
                        <Apple className="w-4 h-4 text-[#1E1E24]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">
                        Fruits & Vegetables
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        Tiered Basket Racks
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* STEP 02: Solar & Battery Power */}
              <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#F2EAE0]">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-[#1E1E24] uppercase tracking-wider text-[11px]">
                    Step 02 • Solar & Battery Power
                  </span>
                  <span className="text-[#837560] font-semibold text-[11px]">
                    Urja aur Battery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1 */}
                  <button
                    onClick={() => setSolarOption('250w_800wh')}
                    className={`p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                      solarOption === '250w_800wh'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-neutral-100 text-[#1E1E24] border-[#F2EAE0]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">250W + 800Wh</div>
                      <div className="text-[11px] opacity-80 mt-1">
                        Ideal for 6-8 hrs evening lighting & mic
                      </div>
                    </div>
                    {solarOption === '250w_800wh' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1E1E24] shrink-0 ml-2" />
                    )}
                  </button>

                  {/* Option 2 */}
                  <button
                    onClick={() => setSolarOption('400w_1200wh')}
                    className={`p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                      solarOption === '400w_1200wh'
                        ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-neutral-100 text-[#1E1E24] border-[#F2EAE0]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">
                        400W + 1.2kWh (+₹8,000)
                      </div>
                      <div className="text-[11px] opacity-80 mt-1">
                        All-day chilling, heavy mixers, 14 hrs
                      </div>
                    </div>
                    {solarOption === '400w_1200wh' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1E1E24] shrink-0 ml-2" />
                    )}
                  </button>
                </div>
              </div>

              {/* STEP 03: Smart Modules (Optional) */}
              <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#F2EAE0]">
                <div className="text-xs font-bold text-[#1E1E24] uppercase tracking-wider text-[11px] mb-3">
                  Step 03 • Smart Modules (Optional)
                </div>

                <div className="space-y-2.5">
                  {moduleCatalog.map((mod) => {
                    const isChecked = selectedModules.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-amber-50/70 border-[#FFB800]'
                            : 'bg-[#FAF7F2] border-[#F2EAE0] hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-[#FFB800] accent-[#FFB800]"
                          />
                          <span className="text-xs sm:text-sm font-semibold text-[#1E1E24]">
                            {mod.name}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#7c5800] shrink-0 ml-2">
                          +₹{mod.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Configuration Summary Column matching screenshot */}
            <div className="lg:col-span-5 bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#F2EAE0] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
                <h3 className="font-heading font-extrabold text-lg text-[#1E1E24]">
                  Configuration Summary
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFB800] text-[#1E1E24] text-[10px] font-black uppercase">
                  Bharat Model 2025
                </span>
              </div>

              {/* Line items */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-[#514532]">
                  <span>Selected Trade Base:</span>
                  <span className="font-bold text-[#1E1E24]">
                    {tradeType === 'juice_chai'
                      ? 'Juice & Chai Cart'
                      : tradeType === 'chaat_snacks'
                      ? 'Chaat & Snacks Cart'
                      : 'Fruits & Veg Cart'}
                  </span>
                </div>

                <div className="flex justify-between text-[#514532]">
                  <span>Solar Array:</span>
                  <span className="font-bold text-[#1E1E24]">
                    {solarOption === '250w_800wh'
                      ? 'Standard 250W + 800Wh'
                      : 'Heavy Duty 400W + 1.2kWh'}
                  </span>
                </div>

                <div className="flex justify-between text-[#514532]">
                  <span>Smart Modules Total:</span>
                  <span className="font-bold text-[#1E1E24]">
                    {selectedModules.length} Selected
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#E63946] pt-1">
                  <span className="font-semibold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#E63946]" />
                    PM SVANidhi 7% Subsidy:
                  </span>
                  <span className="font-extrabold text-sm sm:text-base">
                    -₹{subsidyAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Final Price Block */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#F2EAE0] space-y-1">
                <div className="text-[11px] font-bold text-[#837560] uppercase tracking-wider">
                  {planType === 'own'
                    ? 'Estimated Out-of-Pocket Price'
                    : planType === 'rent_daily'
                    ? 'Daily Cart Rental Rate'
                    : planType === 'rent_monthly'
                    ? 'Monthly Subscription Rate'
                    : 'Rent-to-Own Monthly Installment'}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-[#1E1E24]">
                    {planType === 'own'
                      ? `₹${finalPrice.toLocaleString('en-IN')}`
                      : planType === 'rent_daily'
                      ? '₹149'
                      : planType === 'rent_monthly'
                      ? '₹3,499'
                      : '₹2,490'}
                  </span>
                  {planType === 'own' ? (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-sm text-[#837560] font-bold">
                      {planType === 'rent_daily' ? '/ Day' : '/ Month'}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-emerald-700">
                  {planType === 'own'
                    ? `EMI Starting from ₹${emiPerMonth.toLocaleString('en-IN')} / Month (34 Mo)`
                    : planType === 'rent_daily'
                    ? 'Zero downpayment • Pay daily from cart earnings'
                    : planType === 'rent_monthly'
                    ? 'Includes free servicing & solar battery replacement'
                    : 'Full cart ownership transferred to you after 18 months'}
                </div>
              </div>

              {/* Delivery Phone Number Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E1E24]">
                  WhatsApp / Mobile Number for Factory Delivery
                </label>
                <div className="flex rounded-xl border border-neutral-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#FFB800]">
                  <span className="bg-neutral-100 px-3 py-2.5 text-xs font-bold text-neutral-600 border-r border-neutral-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full px-3 py-2.5 text-sm font-semibold outline-hidden"
                  />
                </div>
              </div>

              {/* Submit CTA Button matching screenshot */}
              <button
                onClick={handleReserve}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Reserving Your Unit...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Reserve My Cartwala (₹999 Deposit)</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#837560] leading-snug">
                100% Refundable deposit • Delivered to doorstep in 7-10 working
                days
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
