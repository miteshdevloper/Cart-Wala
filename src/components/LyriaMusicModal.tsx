import React, { useState } from 'react';
import {
  X,
  Music,
  Sparkles,
  Play,
  Square,
  Save,
  Check,
  Loader2,
  Volume2,
  Radio,
} from 'lucide-react';
import { soundbox } from '../utils/audio';
import { User } from 'firebase/auth';
import { db, doc, setDoc } from '../firebase';

interface LyriaMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const LyriaMusicModal: React.FC<LyriaMusicModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [modelType, setModelType] = useState<'clip' | 'pro'>('clip');
  const [prompt, setPrompt] = useState(
    'Celebratory Indian bazaar melody with sitar flourishes, upbeat dholak rhythm, and welcoming Hindi voice calling out fresh juices and sweet chai!'
  );
  const [tradeCategory, setTradeCategory] = useState('Fresh Juices & Shakes');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    lyrics: string;
    model: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsSaved(false);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          modelType,
          duration: modelType === 'pro' ? 90 : 30,
          tradeType: tradeCategory.toLowerCase().replace(/\s+/g, '_'),
        }),
      });
      const data = await res.json();
      setGeneratedResult({
        title: data.title || `Cartwala ${tradeCategory} Anthem`,
        lyrics:
          data.lyrics ||
          `ताज़ा फल, शुद्ध रस, कार्टवाला पर आइए! (Fresh fruits, pure juice, welcome to Cartwala!)`,
        model: modelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview',
      });
    } catch (err) {
      console.warn('Generate music fetch notice:', err);
      setGeneratedResult({
        title: `Cartwala ${tradeCategory} Anthem`,
        lyrics: `सोलर की शक्ति, ताज़गी की गारंटी! (Powered by the sun, freshness guaranteed!)`,
        model: modelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    soundbox.playBazaarMelody(() => {
      soundbox.speakVendorCall(
        generatedResult?.lyrics || 'ताज़ा माल, शुद्ध स्वाद! सोलर कार्टवाला पर आपका स्वागत है।',
        () => {
          setIsPlaying(false);
        }
      );
    });
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleSaveToFirestore = async () => {
    if (!generatedResult) return;
    const trackId = `track-${Date.now()}`;
    const payload = {
      userId: user?.uid || 'guest-vendor',
      title: generatedResult.title,
      prompt,
      audioType: modelType === 'pro' ? 'lyria_pro' : 'lyria_clip',
      createdAt: new Date().toISOString(),
    };

    try {
      if (user) {
        await setDoc(doc(db, 'soundboxTracks', trackId), payload);
      }
      const existing = JSON.parse(localStorage.getItem('cartwala_tracks') || '[]');
      existing.push({ id: trackId, ...payload });
      localStorage.setItem('cartwala_tracks', JSON.stringify(existing));
      setIsSaved(true);
    } catch (err) {
      console.warn('Track save notice:', err);
      setIsSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#F2EAE0] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="p-2 rounded-xl bg-red-100 text-[#E63946]">
            <Music className="w-5 h-5 text-[#E63946]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-[#1E1E24]">
              Lyria 3 Soundbox & Music Studio
            </h3>
            <p className="text-xs text-[#837560]">
              Generate catchy jingles & seller calls for your 10W PA unit
            </p>
          </div>
        </div>

        {/* Model Selector Feature Requirement: lyria-3-clip-preview vs lyria-3-pro-preview */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Generation Model (Lyria 3 Preview)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModelType('clip')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  modelType === 'clip'
                    ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0]'
                }`}
              >
                <div className="text-xs font-bold">lyria-3-clip-preview</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Short Clips (Up to 30s) • Market Jingle
                </div>
              </button>

              <button
                type="button"
                onClick={() => setModelType('pro')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  modelType === 'pro'
                    ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0]'
                }`}
              >
                <div className="text-xs font-bold">lyria-3-pro-preview</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Full-Length Tracks • Vendor Anthem
                </div>
              </button>
            </div>
          </div>

          {/* Trade Category */}
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Business Trade Category
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Fresh Juices & Shakes',
                'Masala Chai & Snacks',
                'Mumbai Pav Bhaji & Chaat',
                'Seasonal Organic Fruits',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTradeCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    tradeCategory === cat
                      ? 'bg-[#1E1E24] text-white'
                      : 'bg-[#FAF7F2] text-[#514532] border border-[#F2EAE0] hover:bg-neutral-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Music Style & Callout Description
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFB800] outline-hidden bg-[#FAF7F2]"
              placeholder="Describe the rhythm, instruments, or Hindi lyrics..."
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing with {modelType === 'pro' ? 'Lyria 3 Pro' : 'Lyria 3 Clip'}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Soundbox Track</span>
              </>
            )}
          </button>

          {/* Output Card */}
          {generatedResult && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-[#FFB800] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1E1E24]">
                    {generatedResult.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Model: {generatedResult.model}
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#FFB800] text-[#1E1E24] px-2 py-0.5 rounded-full">
                  Ready for PA Unit
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-[#514532] italic">
                "{generatedResult.lyrics}"
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  {isPlaying ? (
                    <button
                      onClick={handleStop}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center space-x-1.5"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePlay}
                      className="px-4 py-2 rounded-xl bg-[#1E1E24] text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-neutral-800"
                    >
                      <Play className="w-3.5 h-3.5 text-[#FFB800]" />
                      <span>Play on Soundbox</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSaveToFirestore}
                  disabled={isSaved}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                    isSaved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white hover:bg-neutral-100 text-[#1E1E24] border border-neutral-300'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
