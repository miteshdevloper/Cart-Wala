import React, { useState } from 'react';
import {
  Phone,
  Sun,
  Wrench,
  User as UserIcon,
  LogOut,
  ShoppingBag,
  Menu,
  X,
  Moon,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { scrollToElement, triggerSolarBurst } from '../utils/animations';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  smoothMotion: boolean;
  onToggleSmoothMotion: () => void;
  onOpenConfigurator: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  lang,
  onToggleLang,
  smoothMotion,
  onToggleSmoothMotion,
  onOpenConfigurator,
  onOpenOrders,
  onOpenAdmin,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    scrollToElement(`#${targetId}`, -70);
    setMobileMenuOpen(false);
    triggerSolarBurst(e.clientX, e.clientY);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F2EAE0] transition-colors">
      {/* Top Micro Announcement Bar */}
      <div className="bg-[#121826] text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
            <span className="text-zinc-200">
              {lang === 'hi'
                ? 'भारत का पहला Solar-Smart Thela • PM SVANidhi ₹10,000 Subsidy Approved'
                : 'Bharat’s First Solar-Smart Thela • PM SVANidhi ₹10,000 Subsidy Approved'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+919302184644"
              data-cursor="nav"
              className="hidden sm:flex items-center space-x-1.5 text-zinc-300 hover:text-[#FFB800] transition-colors font-semibold"
            >
              <Phone className="w-3 h-3 text-[#FFB800]" />
              <span>Direct Helpline: +91 93021 84644</span>
            </a>

            <button
              onClick={onToggleLang}
              data-cursor="nav"
              className="text-xs px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFB800] font-bold transition-colors"
            >
              {lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Simplified Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          data-cursor="nav"
          className="flex items-center space-x-2.5 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB800] to-[#E63946] text-white shadow-sm shadow-[#FFB800]/30 group-hover:scale-105 transition-transform">
            <Sun className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FFB800] rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="font-extrabold text-2xl tracking-tight text-[#1E1E24]">
                Cart<span className="text-[#E63946]">वाला</span>
              </span>
            </div>
            <div className="text-[10px] tracking-wider font-bold text-[#837560] uppercase -mt-1">
              Chhoti Cart. Badi Soch.
            </div>
          </div>
        </a>

        {/* Simplified Center Nav Links with Custom Cursor Reactions */}
        <nav className="hidden lg:flex items-center space-x-1 bg-[#FAF7F2] p-1 rounded-full border border-[#F2EAE0] text-sm font-semibold">
          <a
            href="#the-cart"
            onClick={(e) => handleNavClick(e, 'the-cart')}
            data-cursor="nav"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-[#514532] hover:text-[#1E1E24] hover:bg-white/80 transition-colors"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>3D Night Bazaar</span>
          </a>

          <a
            href="#horizontal-gallery"
            onClick={(e) => handleNavClick(e, 'horizontal-gallery')}
            data-cursor="nav"
            className="px-3.5 py-1.5 rounded-full text-[#514532] hover:text-[#1E1E24] hover:bg-white/80 transition-colors"
          >
            Bazaar Showcase
          </a>

          <a
            href="#features"
            onClick={(e) => handleNavClick(e, 'features')}
            data-cursor="nav"
            className="px-3.5 py-1.5 rounded-full text-[#514532] hover:text-[#1E1E24] hover:bg-white/80 transition-colors"
          >
            Specs & Solar
          </a>

          <a
            href="#economics"
            onClick={(e) => handleNavClick(e, 'economics')}
            data-cursor="nav"
            className="px-3.5 py-1.5 rounded-full text-[#514532] hover:text-[#1E1E24] hover:bg-white/80 transition-colors"
          >
            Economics & ROI
          </a>

          <a
            href="#growth-ladder"
            onClick={(e) => handleNavClick(e, 'growth-ladder')}
            data-cursor="nav"
            className="px-3.5 py-1.5 rounded-full text-[#514532] hover:text-[#1E1E24] hover:bg-white/80 transition-colors flex items-center space-x-1"
          >
            <Award className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Growth Ladder</span>
          </a>
        </nav>

        {/* Right CTA Cluster */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Primary High-Impact CTA */}
          <button
            onClick={(e) => {
              triggerSolarBurst(e.clientX, e.clientY);
              onOpenConfigurator();
            }}
            data-cursor="cta"
            className="btn-primary relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#FFB800] via-[#FFAE33] to-[#E63946] text-[#1E1E24] font-extrabold text-xs sm:text-sm shadow-md shadow-[#FFB800]/30 hover:shadow-lg hover:shadow-[#FFB800]/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
          >
            <Wrench className="w-4 h-4 text-[#1E1E24]" />
            <span>{lang === 'hi' ? 'ठेला कॉन्फ़िगर करें' : 'Configure Cart'}</span>
            <span className="hidden md:inline-block px-1.5 py-0.5 rounded-full bg-white/60 text-[10px] font-black text-[#E63946]">
              -₹10K
            </span>
          </button>

          {/* User Account / Orders */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                data-cursor="nav"
                className="flex items-center space-x-1.5 p-1.5 rounded-full border border-[#F2EAE0] hover:bg-[#FAF7F2] transition-colors"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Vendor'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#FFB800]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FFB800]/20 text-[#7c5800] flex items-center justify-center font-bold text-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'V'}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#F2EAE0] py-2 z-50"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F2EAE0]">
                    <div className="text-xs font-bold text-[#1E1E24] truncate">
                      {user.displayName || 'Vendor Partner'}
                    </div>
                    <div className="text-[10px] text-[#837560] truncate">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1E1E24] hover:bg-[#FAF7F2] flex items-center space-x-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>My Thela Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-neutral-800 hover:bg-[#FAF7F2] flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>Admin Order Tracking</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#E63946] hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              data-cursor="nav"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#F2EAE0] hover:bg-[#FAF7F2] text-xs font-bold text-[#1E1E24] transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Login</span>
            </button>
          )}

          {/* Admin Page Quick Access Button */}
          <button
            onClick={onOpenAdmin}
            data-cursor="nav"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#121826] hover:bg-[#1E1E24] text-white text-xs font-bold transition-all shadow-xs border border-white/10"
            title="Cartwala Admin Portal (Anshu123 / admin6767)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="hidden xs:inline">Admin</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            data-cursor="nav"
            className="lg:hidden p-2 rounded-xl text-[#514532] hover:bg-[#FAF7F2] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F2EAE0] bg-[#FFFDF9] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1 font-semibold text-sm">
            <a
              href="#the-cart"
              onClick={(e) => handleNavClick(e, 'the-cart')}
              className="px-3 py-2 rounded-xl text-[#1E1E24] hover:bg-[#FAF7F2] flex items-center space-x-2"
            >
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>3D Night Bazaar Model</span>
            </a>
            <a
              href="#horizontal-gallery"
              onClick={(e) => handleNavClick(e, 'horizontal-gallery')}
              className="px-3 py-2 rounded-xl text-[#1E1E24] hover:bg-[#FAF7F2]"
            >
              Bazaar Showcase Gallery
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="px-3 py-2 rounded-xl text-[#1E1E24] hover:bg-[#FAF7F2]"
            >
              Engineering & Solar
            </a>
            <a
              href="#economics"
              onClick={(e) => handleNavClick(e, 'economics')}
              className="px-3 py-2 rounded-xl text-[#1E1E24] hover:bg-[#FAF7F2]"
            >
              Street Economics
            </a>
            <a
              href="#growth-ladder"
              onClick={(e) => handleNavClick(e, 'growth-ladder')}
              className="px-3 py-2 rounded-xl text-[#1E1E24] hover:bg-[#FAF7F2] flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-[#FFB800]" />
              <span>Growth Ladder Milestones</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConfigurator();
              }}
              className="text-left px-3 py-2 rounded-xl bg-[#FFB800]/20 font-bold text-[#1E1E24]"
            >
              Build Your Cart (-₹10,000 Subsidy)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left px-3 py-2 rounded-xl bg-[#121826] text-white font-bold flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                <span>Admin Order Tracking (Anshu123)</span>
              </div>
              <span className="text-[10px] bg-[#FFB800] text-[#1E1E24] px-1.5 py-0.5 rounded-sm font-black">
                Firebase
              </span>
            </button>
          </nav>

          <div className="pt-3 border-t border-[#F2EAE0] flex flex-col space-y-2">
            <a
              href="tel:+919302184644"
              className="flex items-center space-x-2 text-xs font-bold text-[#E63946] py-1"
            >
              <Phone className="w-4 h-4" />
              <span>Helpline: +91 93021 84644</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
