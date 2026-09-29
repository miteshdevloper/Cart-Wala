import React, { useState, useRef } from 'react';
import {
  Sun,
  Battery,
  Shield,
  Volume2,
  Sparkles,
  Zap,
  Play,
  Square,
  Lock,
  Flame,
  Award,
  Radio,
  Layers,
  Check,
  Mic,
  Send,
} from 'lucide-react';
import { soundbox } from '../utils/audio';

interface EngineeringFeaturesProps {
  onOpenLyria?: () => void;
  lang: 'en' | 'hi';
}

export const EngineeringFeatures: React.FC<EngineeringFeaturesProps> = ({
  lang,
}) => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);
  const [customAnnouncement, setCustomAnnouncement] = useState('आइए भाईसाहब! ताज़ा स्पेशल नाश्ता और जूस तैयार है!');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePlaySound = (
    type:
      | 'original_juice'
      | 'fruits'
      | 'chai'
      | 'chaat'
      | 'upi'
      | 'custom_tts'
      | 'recorded'
  ) => {
    setActiveSound(type);
    setIsPlayingSound(true);

    if (type === 'original_juice') {
      soundbox.playOriginalJuiceCall(() => {
        setIsPlayingSound(false);
      });
    } else if (type === 'fruits') {
      soundbox.playFruitsCall(() => {
        setIsPlayingSound(false);
      });
    } else if (type === 'chai') {
      soundbox.playMasalaChaiCall(() => {
        setIsPlayingSound(false);
      });
    } else if (type === 'chaat') {
      soundbox.playChaatCall(() => {
        setIsPlayingSound(false);
      });
    } else if (type === 'upi') {
      soundbox.playUpiVoiceAlert(30, () => {
        setIsPlayingSound(false);
      });
    } else if (type === 'custom_tts') {
      soundbox.speakVendorCall(customAnnouncement, () => {
        setIsPlayingSound(false);
      });
    } else if (type === 'recorded' && recordedAudioUrl) {
      soundbox.playCustomAudio(recordedAudioUrl, () => {
        setIsPlayingSound(false);
      });
    }
  };

  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          setCustomAudioName('My Mic Recording.webm');
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Auto stop after 7 seconds max
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 7000);
      } catch (err) {
        console.warn('Microphone access notice:', err);
        alert('Microphone access unavailable or denied. You can still test text-to-speech presets!');
      }
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomAudioName(file.name);
      const url = URL.createObjectURL(file);
      setActiveSound('custom_upload');
      setIsPlayingSound(true);
      soundbox.playCustomAudio(url, () => {
        setIsPlayingSound(false);
      });
    }
  };

  const handleStopSound = () => {
    soundbox.stopAll();
    setIsPlayingSound(false);
    setActiveSound(null);
  };

  return (
    <section id="features" className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#E63946] tracking-wider uppercase">
            Engineering for Real Streets
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1E1E24] mt-1.5 leading-tight">
            Designed for 45°C Indian Heat, Crowded Bazaars & All-Day Hustle.
          </h2>
          <p className="text-[#514532] text-base mt-2">
            Every component has been stress-tested in Chandni Chowk, T. Nagar, and
            Dadar markets to eliminate maintenance headaches.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-8">
          {/* FEATURE 01: Energy Autonomy */}
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#F2EAE0] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#7c5800] bg-[#FFB800]/20 px-3 py-1 rounded-full">
                  <Sun className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>FEATURE 01 • ENERGY AUTONOMY</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1E1E24]">
                  Powered by the Sun. Unplugged from the Grid.
                </h3>

                <div className="rounded-2xl overflow-hidden border border-[#F2EAE0] shadow-sm relative group">
                  <img
                    src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"
                    alt="400W Monocrystalline Rooftop Solar Array"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold">
                      400W High-Efficiency Monocrystalline Silicon Canopy
                    </span>
                  </div>
                </div>

                <p className="text-[#514532] text-sm sm:text-base leading-relaxed">
                  No dangerous illegal wire hooks. No smelly petrol generators that
                  eat into daily margins. Cartwala gathers 400W directly through its
                  all-weather canopy, filling a military-grade 1.2kWh Lithium Iron
                  Phosphate (LiFePO4) power core.
                </p>

                {/* 3 Numbered Steps */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFB800] text-[#1E1E24] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs sm:text-sm text-[#1E1E24] font-medium">
                      Charges fully in 4.5 hours of indirect morning sunshine.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFB800] text-[#1E1E24] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs sm:text-sm text-[#1E1E24] font-medium">
                      Runs 40L deep-freeze chilling, 4 LED task spots, blender, and
                      smartphone charging simultaneously.
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#FFB800] text-[#1E1E24] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs sm:text-sm text-[#1E1E24] font-medium">
                      3,000+ cycle life (over 8 years of dependable daily sunrise
                      charges).
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Live Circuit Flow Simulation */}
              <div className="lg:col-span-6 bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#F2EAE0]">
                <div className="text-center font-bold text-xs uppercase tracking-wider text-[#837560] mb-5">
                  Live Circuit Flow Simulation
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  {/* Sun Icon */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-[#FFB800] flex items-center justify-center shadow-lg shadow-[#FFB800]/40 animate-pulse">
                      <Sun className="w-8 h-8 text-[#1E1E24]" />
                    </div>
                    <span className="text-[11px] font-bold text-[#1E1E24] mt-1">
                      SUN
                    </span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="h-6 w-0.5 bg-dashed border-l-2 border-[#FFB800] animate-pulse"></div>

                  {/* 400W Roof Box */}
                  <div className="w-48 bg-[#1E1E24] text-white py-2 rounded-xl text-center text-xs font-bold border border-neutral-700 shadow-sm">
                    400W ROOF
                  </div>

                  {/* Flow Arrow */}
                  <div className="h-6 w-0.5 bg-dashed border-l-2 border-[#FFB800] animate-pulse"></div>

                  {/* Battery Pack */}
                  <div className="w-56 bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-2.5 px-4 rounded-xl text-center text-xs font-bold shadow-md">
                    <div>BATTERY PACK</div>
                    <div className="text-[10px] font-normal text-emerald-100">
                      1.2 kWh LiFePO4
                    </div>
                  </div>

                  {/* Dual Output Split */}
                  <div className="grid grid-cols-2 gap-4 w-full pt-2">
                    <div className="bg-white rounded-xl p-3 border border-neutral-200 text-center">
                      <div className="text-xs font-bold text-[#006398]">
                        Chiller (4°C)
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Active Cold Bay
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-neutral-200 text-center">
                      <div className="text-xs font-bold text-[#E63946]">
                        Mic & Lights
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        10W Sound + LEDs
                      </div>
                    </div>
                  </div>
                </div>

                {/* Circuit Indicators */}
                <div className="flex items-center justify-around mt-6 pt-4 border-t border-[#F2EAE0] text-[10px] font-bold text-[#514532]">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFB800]"></span>
                    <span>Clean Generation</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Active Storage</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006398]"></span>
                    <span>Zero Loss Inverter</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE 02: Ergonomic Architecture */}
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#F2EAE0] p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Photo & Stats */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#F2EAE0] shadow-sm relative group">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80"
                    alt="Food Grade Stainless Steel Prep Counter"
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold">
                      Hygienic 304 Food-Grade Stainless Steel Prep Counter
                    </span>
                  </div>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                    <div className="font-heading font-black text-lg text-[#1E1E24]">
                      304
                    </div>
                    <div className="text-[10px] text-[#837560]">
                      Food-grade Steel
                    </div>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                    <div className="font-heading font-black text-lg text-[#E63946]">
                      3x
                    </div>
                    <div className="text-[10px] text-[#837560]">
                      Prep Space Gain
                    </div>
                  </div>
                  <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F2EAE0]">
                    <div className="font-heading font-black text-lg text-emerald-700">
                      IP65
                    </div>
                    <div className="text-[10px] text-[#837560]">
                      Lockable Safe
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Descriptions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E63946] bg-red-50 px-3 py-1 rounded-full">
                  <Layers className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>FEATURE 02 • ERGONOMIC ARCHITECTURE</span>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1E1E24]">
                  Every Single Inch Has a Purpose.
                </h3>

                <p className="text-[#514532] text-sm sm:text-base leading-relaxed">
                  Traditional thelas waste valuable vertical space and create back
                  fatigue. We calculated human reach radii for vendors standing 8
                  to 10 hours a day to craft an ergonomic cockpit.
                </p>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0]">
                    <div className="text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>
                      <span>Modular GN Food Trays</span>
                    </div>
                    <div className="text-[11px] text-[#514532] mt-1">
                      Interchangeable standard trays for chaat, dosas, fresh
                      coconut, chai, or seasonal produce.
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0]">
                    <div className="text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFB800]"></span>
                      <span>Insulated Active Cold Bay</span>
                    </div>
                    <div className="text-[11px] text-[#514532] mt-1">
                      Eliminates ₹150 daily purchase of unhygienic melting ice
                      blocks. Stays 4°C till midnight.
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0]">
                    <div className="text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#006398]"></span>
                      <span>Fold-Out Counter Wings</span>
                    </div>
                    <div className="text-[11px] text-[#514532] mt-1">
                      Deploys in 5 seconds to triple dining and prep surface when
                      parked at prime spots.
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0]">
                    <div className="text-xs font-bold text-[#1E1E24] flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Secret High-Security Safe</span>
                    </div>
                    <div className="text-[11px] text-[#514532] mt-1">
                      Dual-key lockable cash vault and phone locker built directly
                      into the steel frame.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL ROW: Feature 03 (Smart Voice) & Feature 04 (Civic Pride) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FEATURE 03: Smart Voice */}
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#F2EAE0] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#7c5800] bg-[#FFB800]/20 px-3 py-1 rounded-full">
                  <Volume2 className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>FEATURE 03 • SMART VOICE</span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#1E1E24]">
                  Less Shouting. More Selling.
                </h3>

                <div className="rounded-2xl overflow-hidden border border-[#F2EAE0] shadow-sm relative group">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=700&q=80"
                    alt="Audible UPI & 10W PA Soundbox in Action"
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold">
                      Audible UPI Alert Mast & 10W Weatherproof Calling Horn
                    </span>
                  </div>
                </div>

                <p className="text-[#514532] text-sm leading-relaxed">
                  Indian street vendors shout for up to 9 hours daily, leading to
                  chronic vocal cord strain. Cartwala includes an integrated
                  weather-sealed, crystal-clear 10W PA audio unit with pre-recorded
                  localized chime presets.
                </p>

                {/* Voice Soundbox Demo Interactive Widget */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#F2EAE0] mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E1E24] uppercase tracking-wider text-[10px]">
                      VOICE SOUNDBOX DEMO
                    </span>
                    <span className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#837560]">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isPlayingSound
                            ? 'bg-[#E63946] animate-ping'
                            : 'bg-emerald-500'
                        }`}
                      ></span>
                      <span>{isPlayingSound ? 'Broadcasting...' : 'Idle'}</span>
                    </span>
                  </div>

                  {/* Audio Waveform Animation */}
                  <div className="h-10 bg-white rounded-xl border border-neutral-200 px-3 flex items-center justify-center space-x-1">
                    {[30, 60, 40, 80, 95, 65, 45, 85, 100, 75, 40, 60, 90, 50].map(
                      (h, i) => (
                        <div
                          key={i}
                          style={{
                            height: isPlayingSound ? `${h}%` : '20%',
                          }}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isPlayingSound ? 'bg-[#FFB800]' : 'bg-neutral-300'
                          }`}
                        />
                      )
                    )}
                  </div>

                  {/* Featured Sound Preset from User Audio: Juice Callout & Dholak Beats */}
                  <button
                    onClick={() => handlePlaySound('original_juice')}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden shadow-sm ${
                      activeSound === 'original_juice' && isPlayingSound
                        ? 'bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#E63946] text-white border-[#E63946] shadow-md animate-pulse'
                        : 'bg-gradient-to-r from-amber-50 via-white to-orange-50 hover:bg-amber-100 text-[#1E1E24] border-[#FFB800]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E63946]"></span>
                        </span>
                        <span className="text-xs font-black tracking-tight">
                          "आइए आइए! ताजा जूस! ठंडा ठंडा मजेदार!"
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 text-[#E63946] shadow-2xs">
                        Voice + Dholak Beats 🥁
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1 pl-4.5 font-medium">
                      Live Vendor Callout: "एक गिलास ले जाइए! ताजा! ठंडा! मजेदार!" + Festive Tabla/Dholak Solo
                    </div>
                  </button>

                  {/* Voice Preset Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handlePlaySound('chai')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        activeSound === 'chai' && isPlayingSound
                          ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800]'
                          : 'bg-white hover:bg-neutral-50 text-[#1E1E24] border-neutral-200'
                      }`}
                    >
                      ☕ "Garam Masala Chai!"
                    </button>

                    <button
                      onClick={() => handlePlaySound('chaat')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        activeSound === 'chaat' && isPlayingSound
                          ? 'bg-[#E63946] text-white border-[#E63946]'
                          : 'bg-white hover:bg-neutral-50 text-[#1E1E24] border-neutral-200'
                      }`}
                    >
                      🥟 "Tikhi Meethi Chaat & Pani Puri!"
                    </button>

                    <button
                      onClick={() => handlePlaySound('fruits')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        activeSound === 'fruits' && isPlayingSound
                          ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800]'
                          : 'bg-white hover:bg-neutral-50 text-[#1E1E24] border-neutral-200'
                      }`}
                    >
                      🍊 "Taaza Phal! Shudh Ras!"
                    </button>

                    <button
                      onClick={() => handlePlaySound('upi')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        activeSound === 'upi' && isPlayingSound
                          ? 'bg-[#006398] text-white border-[#006398]'
                          : 'bg-white hover:bg-neutral-50 text-[#1E1E24] border-neutral-200'
                      }`}
                    >
                      💳 "PhonePe/PayTM ₹30 Alert"
                    </button>
                  </div>

                  {/* Custom Announcement TTS Input */}
                  <div className="pt-1">
                    <div className="text-[10px] font-bold text-[#837560] uppercase mb-1">
                      Type Any Custom Announcement (बोलकर सुनाएं)
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={customAnnouncement}
                        onChange={(e) => setCustomAnnouncement(e.target.value)}
                        placeholder="Type announcement..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs bg-white text-[#1E1E24] focus:outline-none focus:border-[#FFB800]"
                      />
                      <button
                        onClick={() => handlePlaySound('custom_tts')}
                        className="px-3 py-1.5 rounded-xl bg-[#1E1E24] hover:bg-black text-[#FFB800] text-xs font-bold flex items-center space-x-1"
                        title="Broadcast via 10W PA Soundbox"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Speak</span>
                      </button>
                    </div>
                  </div>

                  {/* Microphone Record & File Upload Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleToggleRecord}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all flex items-center justify-center space-x-1.5 ${
                        isRecording
                          ? 'bg-red-600 text-white border-red-700 animate-pulse'
                          : 'bg-white hover:bg-neutral-50 text-[#1E1E24] border-neutral-300'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5 text-red-600" />
                      <span>{isRecording ? 'Recording (Click to Stop)' : 'Record My Voice'}</span>
                    </button>

                    {/* Custom Audio Upload Button */}
                    <label className="px-3 py-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-[#1E1E24] border-neutral-300 flex items-center justify-center space-x-1.5 truncate">
                      <Volume2 className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                      <span className="truncate">
                        {customAudioName ? `Loaded: ${customAudioName}` : 'Upload Audio (.mp3)'}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleCustomAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {recordedAudioUrl && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-xs">
                      <span className="text-emerald-800 font-bold">● Mic Voice Captured</span>
                      <button
                        onClick={() => handlePlaySound('recorded')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                      >
                        Play Mic Broadcast
                      </button>
                    </div>
                  )}

                  {isPlayingSound && (
                    <button
                      onClick={handleStopSound}
                      className="w-full text-center text-xs font-semibold text-red-600 hover:text-red-700 py-1"
                    >
                      Stop Soundbox
                    </button>
                  )}
                </div>
              </div>

              {/* Soundbox Test Loop CTA */}
              <div className="mt-5 pt-4 border-t border-[#F2EAE0]">
                <button
                  onClick={() => handlePlaySound('original_juice')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs bg-amber-50 text-[#7c5800] border border-[#FFB800] hover:bg-amber-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4 text-[#FFB800]" />
                  <span>Play Market Announcement Test Loop</span>
                </button>
              </div>
            </div>

            {/* FEATURE 04: Civic Pride & Dignity */}
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#F2EAE0] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#006398] bg-blue-50 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5 text-[#006398]" />
                  <span>FEATURE 04 • CIVIC PRIDE & DIGNITY</span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#1E1E24]">
                  Designed to Stand Out Day & Night.
                </h3>

                <div className="rounded-2xl overflow-hidden border border-[#F2EAE0] shadow-sm relative group">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                    alt="Illuminated Night Street Food Market"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold">
                      Automotive Powder Coating in Auspicious Red & Solar Gold • Visible from 200m
                    </span>
                  </div>
                </div>

                <p className="text-[#514532] text-sm leading-relaxed">
                  Transforming the vendor from an informal laborer into an iconic
                  micro-retailer. Built with automotive-grade powder coating in
                  auspicious festival red and solar yellow, visible from 200 meters.
                </p>

                {/* 3 Callouts matching screenshot */}
                <div className="space-y-3 pt-2">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0] flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E1E24]">
                        Warm 3000K Night Food LEDs
                      </div>
                      <div className="text-[11px] text-[#514532] mt-0.5">
                        Food looks irresistible after sunset, boosting dinner
                        sales.
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#FFB800] bg-amber-50 px-2 py-0.5 rounded shrink-0 ml-2">
                      Zero Shadows
                    </span>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0] flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E1E24]">
                        Magnetic Illuminated UPI QR Mast
                      </div>
                      <div className="text-[11px] text-[#514532] mt-0.5">
                        Instant, illuminated scan angle so customers never fumble.
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#006398] bg-blue-50 px-2 py-0.5 rounded shrink-0 ml-2">
                      Instant Pay
                    </span>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#F2EAE0] flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E1E24]">
                        Tubeless All-Terrain Suspension Wheels
                      </div>
                      <div className="text-[11px] text-[#514532] mt-0.5">
                        Effortless navigation over potholes, gravel, and high
                        curbstones.
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0 ml-2">
                      Puncture-proof
                    </span>
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
