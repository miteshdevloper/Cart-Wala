import React from 'react';
import {
  Sun,
  Heart,
  Phone,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Download,
} from 'lucide-react';

interface FooterProps {
  onOpenConfigurator: () => void;
  lang: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConfigurator,
  lang,
}) => {
  const [cartsCount, setCartsCount] = React.useState(0);
  const [statesCount, setStatesCount] = React.useState(0);
  const [energyCount, setEnergyCount] = React.useState(0);
  const [savingsCount, setSavingsCount] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const duration = 60; // 60 frames (~1 sec)
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCartsCount(Math.round(5280 * ease));
      setStatesCount(Math.round(28 * ease));
      setEnergyCount(Number((3.8 * ease).toFixed(1)));
      setSavingsCount(Number((4.2 * ease).toFixed(1)));

      if (frame >= duration) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#F2EAE0]">
      {/* Turn Every Street Corner CTA Banner matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E63946]">
            <Heart className="w-3.5 h-3.5 fill-[#E63946]" />
            <span>Every Cart is Hand-assembled in Pune & Lucknow</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-extrabold text-[#7c5800] uppercase tracking-wider">
              छोटा कार्ट • बड़ी सोच
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1E24] tracking-tight">
              Turn Every Street Corner into a Modern Clean Business.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#514532] max-w-2xl mx-auto leading-relaxed">
            Join thousands of empowered merchants who wake up with zero generator
            worries, full solar battery packs, and elevated pride.
          </p>

          {/* 4 Stats Grid with Dynamic Animated Counters (Animation #39) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-4">
            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2EAE0] hover:scale-103 transition-transform">
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E24]">
                {cartsCount.toLocaleString('en-IN')}+
              </div>
              <div className="text-[11px] font-bold text-[#837560] uppercase mt-0.5">
                Carts Active on Streets
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2EAE0] hover:scale-103 transition-transform">
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#E63946]">
                {statesCount}
              </div>
              <div className="text-[11px] font-bold text-[#837560] uppercase mt-0.5">
                Indian States Reached
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2EAE0] hover:scale-103 transition-transform">
              <div className="font-heading font-black text-2xl sm:text-3xl text-[#006398]">
                {energyCount}M kWh
              </div>
              <div className="text-[11px] font-bold text-[#837560] uppercase mt-0.5">
                Solar Energy Harvested
              </div>
            </div>

            <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F2EAE0] hover:scale-103 transition-transform">
              <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-700">
                ₹{savingsCount} Cr+
              </div>
              <div className="text-[11px] font-bold text-[#837560] uppercase mt-0.5">
                Fuel Costs Saved by Vendors
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenConfigurator}
              className="flex items-center space-x-2 px-7 py-3.5 rounded-full font-bold text-sm bg-[#FFB800] hover:bg-[#E5A600] text-[#1E1E24] shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Claim Your Subsidy & Order</span>
            </button>

            <a
              href="tel:+919302184644"
              className="flex items-center space-x-2 px-6 py-3.5 rounded-full font-bold text-sm bg-[#FFFDF9] hover:bg-white text-[#1E1E24] border border-[#F2EAE0] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E63946]" />
              <span>Talk to Cart Specialist (+91 93021 84644)</span>
            </a>
          </div>

          <div className="text-[11px] text-[#837560] pt-4 font-medium flex items-center justify-center space-x-2">
            <span>Government Recognized Innovation</span>
            <span>•</span>
            <span>Make in India 🇮🇳</span>
            <span>•</span>
            <span>ISO 9001:2015 Manufacturing</span>
          </div>
        </div>

        {/* Horizontal Divider */}
        <hr className="border-[#F2EAE0] my-12" />

        {/* Footer Navigation & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-[#514532]">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#FFB800] flex items-center justify-center">
                <Sun className="w-4 h-4 text-[#1E1E24]" />
              </div>
              <span className="font-heading font-black text-xl text-[#1E1E24]">
                Cart<span className="text-[#E63946]">वाला</span>
              </span>
            </div>

            <div className="font-bold text-[11px] text-[#1E1E24]">
              Chhoti Cart. Badi Soch.
            </div>

            <p className="leading-relaxed max-w-sm">
              Empowering 5 Million+ Indian Street Entrepreneurs with smart solar
              mobility, intelligent refrigeration, and digital payments.
            </p>

            <div className="flex items-center space-x-2 pt-1 font-semibold text-[#1E1E24]">
              <span className="px-2 py-0.5 rounded-md bg-[#FFFDF9] border border-[#F2EAE0]">
                Made with pride in Bharat 🇮🇳
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Clean Tech
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-bold text-xs text-[#1E1E24] uppercase tracking-wider mb-2">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-y-1.5">
              <a href="#features" className="hover:text-[#1E1E24]">
                Product Specifications
              </a>
              <a href="#build-cart" className="hover:text-[#1E1E24]">
                Solar Configurator
              </a>
              <a href="#economics" className="hover:text-[#1E1E24]">
                Financing & Subsidy
              </a>
              <a href="#home" className="hover:text-[#1E1E24]">
                Testimonials
              </a>
              <a href="#interactive-studio" className="hover:text-[#1E1E24]">
                Contact & Factory Tours
              </a>
              <a href="#how-it-works" className="hover:text-[#1E1E24]">
                How It Works
              </a>
            </div>
          </div>

          {/* Col 3: Helpline */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-bold text-xs text-[#1E1E24] uppercase tracking-wider mb-2">
              Direct Helpline
            </div>
            <p className="text-[11px]">Toll-Free Merchant Support across all Indian States:</p>
            <a href="tel:+919302184644" className="flex items-center space-x-2 pt-1 hover:text-[#E63946] transition-colors">
              <Phone className="w-4 h-4 text-[#E63946]" />
              <span className="font-heading font-black text-base text-[#1E1E24]">
                +91 93021 84644
              </span>
            </a>
            <div className="text-[10px] text-neutral-400">
              Mon–Sat | 8:00 AM – 9:00 PM IST
            </div>
          </div>
        </div>

        {/* Export & Netlify Deployment Bar */}
        <div className="mt-10 p-4 rounded-2xl bg-[#FFFDF9] border border-[#F2EAE0] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#1E1E24]">Publish & Export Center</div>
              <div className="text-[11px] text-neutral-500">
                Download ready-to-drop Netlify package or full source code archive
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/download/dist"
              download="dist.zip"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download dist.zip (Netlify Drop)</span>
            </a>
            <a
              href="/api/download/source"
              download="cartwala-source-code.zip"
              className="px-3 py-1.5 rounded-xl border border-[#F2EAE0] hover:bg-[#FAF7F2] text-[#1E1E24] text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Full Source Code (.zip)</span>
            </a>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-[#F2EAE0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#837560]">
          <div>
            © 2025 Cartवाला Mobility Innovations Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => alert('Cartwala operates strictly under Indian Consumer Protection E-Commerce Rules 2020. Customer data is encrypted with Firebase SSL.')}
              className="hover:text-[#1E1E24] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert('All Cartwala units carry 3-year warranty on chassis, 5-year warranty on solar panels, and 100% refundable ₹999 booking deposit.')}
              className="hover:text-[#1E1E24] cursor-pointer"
            >
              Terms of Service
            </button>
            <a
              href="https://pmsvanidhi.mohua.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1E1E24] flex items-center space-x-1"
            >
              <span>PM SVANidhi Official Portal</span>
              <ExternalLink className="w-3 h-3 text-[#FFB800]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
