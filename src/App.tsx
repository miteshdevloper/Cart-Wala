import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InteractiveStudio } from './components/InteractiveStudio';
import { HorizontalBazaarGallery } from './components/HorizontalBazaarGallery';
import { EngineeringFeatures } from './components/EngineeringFeatures';
import { VendorJourney } from './components/VendorJourney';
import { StreetEconomics } from './components/StreetEconomics';
import { SmartConfigurator } from './components/SmartConfigurator';
import { Footer } from './components/Footer';
import { UserOrdersModal } from './components/UserOrdersModal';
import { AdminPortal } from './components/AdminPortal';
import { CustomCursor } from './components/CustomCursor';
import { LoadingScreen } from './components/LoadingScreen';
import { PageScrollProgress } from './components/PageScrollProgress';
import { initSmoothScrolling, scrollToElement } from './utils/animations';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  type User,
} from './firebase';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [smoothMotion, setSmoothMotion] = useState(true);

  // Modals state
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return search.includes('admin') || hash.includes('admin');
    }
    return false;
  });

  // Initialize Lenis buttery-smooth scroll synchronized with GSAP ScrollTrigger
  useEffect(() => {
    if (smoothMotion) {
      const cleanup = initSmoothScrolling();
      return cleanup;
    }
  }, [smoothMotion]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google Sign-In notice:', err?.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err: any) {
      console.warn('Logout notice:', err?.message);
    }
  };

  const scrollToSection = (id: string) => {
    scrollToElement(`#${id}`, -70);
  };

  return (
    <div className={`min-h-screen flex flex-col ${smoothMotion ? 'scroll-smooth' : ''}`}>
      {/* Visual Page Scroll Progress Line Indicator */}
      <PageScrollProgress />

      {/* Custom Solar Cursor Follower with Nav & 3D Morphing */}
      <CustomCursor />

      {/* Intro Loading Screen with Solar Boot Sequence */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Top Header & Navigation */}
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
        smoothMotion={smoothMotion}
        onToggleSmoothMotion={() => setSmoothMotion((prev) => !prev)}
        onOpenConfigurator={() => scrollToSection('build-cart')}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Night / Day Live Preview */}
        <Hero
          onOpenConfigurator={() => scrollToSection('build-cart')}
          onScrollToStudio={() => scrollToSection('the-cart')}
          lang={lang}
        />

        {/* 2. Interactive 3D Night Bazaar Scrollytelling Studio */}
        <InteractiveStudio />

        {/* 3. GSAP Horizontal Scroll Gallery (Cinematic Real Thela Exhibition) */}
        <HorizontalBazaarGallery />

        {/* 4. Engineering For Real Streets (Solar Autonomy, Ergonomic Architecture, Smart Voice) */}
        <EngineeringFeatures
          lang={lang}
        />

        {/* 5. The Vendor's Journey & Growth Ladder (24-Hour Reality + Milestone Gamification) */}
        <VendorJourney
          user={user}
          lang={lang}
          onOpenConfigurator={() => scrollToSection('build-cart')}
        />

        {/* 6. The Street Economics (Power, Space, Audio, Trust, ROI) */}
        <StreetEconomics />

        {/* 7. Smart Configurator (3 Steps + Instant Subsidy + Firebase Reservation) */}
        <SmartConfigurator
          user={user}
          onLogin={handleLogin}
          lang={lang}
        />
      </main>

      {/* Floating Quick Contact Pill for +91 93021 84644 */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border-2 border-[#FFB800] shadow-lg shadow-black/10">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold text-[#1E1E24] hidden sm:inline">Contact:</span>
        <a
          href="tel:+919302184644"
          className="text-xs font-extrabold text-[#1E1E24] hover:text-[#E63946] transition-colors"
        >
          +91 93021 84644
        </a>
        <a
          href="https://wa.me/919302184644"
          target="_blank"
          rel="noreferrer"
          className="p-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-transform active:scale-95"
          title="WhatsApp Support"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.976.58 1.96.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.2.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
          </svg>
        </a>
      </div>

      {/* Footer & Bottom CTA Banner */}
      <Footer
        onOpenConfigurator={() => scrollToSection('build-cart')}
        lang={lang}
      />

      {/* User Orders Modal */}
      <UserOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        user={user}
      />

      {/* Admin Portal & Live Order Tracking (Account: Anshu123 / Password: admin6767) */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
