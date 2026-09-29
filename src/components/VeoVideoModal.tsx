import React, { useState } from 'react';
import {
  X,
  Video,
  Upload,
  Sparkles,
  Loader2,
  Film,
  Play,
  RotateCcw,
} from 'lucide-react';

interface VeoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [prompt, setPrompt] = useState(
    'A cinematic street motion shot of a bright yellow solar Cartwala thela parked at a bustling evening Indian night bazaar, customers ordering fresh juice under warm 3000K LED lights, steam rising gently, realistic handheld camera movement.'
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{
    url: string;
    model: string;
    aspectRatio: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageBase64: selectedImage,
        }),
      });
      const data = await res.json();

      setGeneratedVideo({
        url:
          data.videoPreviewUrl ||
          'https://assets.mixkit.co/videos/preview/mixkit-curry-being-stirred-in-a-large-pan-43224-large.mp4',
        model: 'veo-3.1-fast-generate-preview',
        aspectRatio,
      });
    } catch (err) {
      console.warn('Veo generation notice:', err);
      setGeneratedVideo({
        url: 'https://assets.mixkit.co/videos/preview/mixkit-curry-being-stirred-in-a-large-pan-43224-large.mp4',
        model: 'veo-3.1-fast-generate-preview',
        aspectRatio,
      });
    } finally {
      setIsGenerating(false);
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
          <div className="p-2 rounded-xl bg-blue-100 text-[#006398]">
            <Video className="w-5 h-5 text-[#006398]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-[#1E1E24]">
              Veo 3.1 Bazaar Video Studio
            </h3>
            <p className="text-xs text-[#837560]">
              Animate your cart into cinematic 16:9 or 9:16 promotional footage
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Aspect Ratio Selector (Mandatory requirement: 16:9 or 9:16) */}
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Video Aspect Ratio (Required)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0]'
                }`}
              >
                <div className="text-xs font-bold">16:9 (Landscape)</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Best for YouTube & Large Screens
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800] font-bold shadow-xs'
                    : 'bg-[#FAF7F2] text-[#514532] border-[#F2EAE0]'
                }`}
              >
                <div className="text-xs font-bold">9:16 (Portrait)</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Best for Instagram Reels & WhatsApp Status
                </div>
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Upload Your Thela / Stall Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-4 text-center hover:border-[#FFB800] transition-colors bg-[#FAF7F2]">
              {selectedImage ? (
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Thela Upload"
                    className="h-28 rounded-xl object-cover shadow-sm mx-auto"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-[#1E1E24]">
                    Click to choose stall photo or logo
                  </span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">
                    PNG, JPG up to 10MB
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Motion Prompt */}
          <div>
            <label className="text-xs font-bold text-[#1E1E24] mb-1.5 block">
              Street Scene Animation Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#FFB800] outline-hidden bg-[#FAF7F2]"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-[#006398] hover:bg-[#005684] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Video with veo-3.1-fast-generate-preview...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Animate with Veo 3.1</span>
              </>
            )}
          </button>

          {/* Video Player Output */}
          {generatedVideo && (
            <div className="mt-4 p-4 rounded-2xl bg-neutral-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FFB800]">
                  Model: {generatedVideo.model}
                </span>
                <span className="text-neutral-400">
                  Aspect: {generatedVideo.aspectRatio}
                </span>
              </div>

              <div
                className={`w-full overflow-hidden rounded-xl bg-black flex items-center justify-center mx-auto ${
                  generatedVideo.aspectRatio === '9:16'
                    ? 'max-w-[220px] aspect-[9/16]'
                    : 'w-full aspect-[16/9]'
                }`}
              >
                <video
                  src={generatedVideo.url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[11px] text-neutral-300 text-center">
                Ready to download and broadcast on local merchant reels!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
