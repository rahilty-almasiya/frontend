import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Car, Building2, PlaneTakeoff, Compass } from 'lucide-react';

const Hero: React.FC = () => {
  const { t, dir } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        frameRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative h-screen w-full min-h-[600px] overflow-hidden bg-slate-950 flex items-center justify-center">

      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0 transform will-change-transform origin-center transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.1)` }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div> */}

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/banner.png"
          className="w-full h-full object-cover animate-zoom-in"
        >
          <source src="/assets/video/devenup-final-home-3(2).mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center pt-24">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative px-4">

          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-500/40 bg-white/5 backdrop-blur-sm opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-slow"></span>
            <span className="text-xs md:text-sm font-semibold tracking-[0.15em] uppercase text-gold-400">
              {t('hero_badge')}
            </span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {t('hero_title')}
          </h1>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.85s' }}
          >
            <Link
              to="/fleet"
              className="group w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border border-white/30 text-white font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-slate-900 hover:border-white text-center hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-1"
            >
              <span className="tracking-wide">{t('cta_secondary')}</span>
            </Link>

            {t('payment_gateway_enabled') === 'true' ? (
              <Link
                to="/booking"
                className="group relative w-full sm:w-auto px-10 py-4 overflow-hidden rounded-full bg-gold-500 text-white font-bold tracking-wide shadow-[0_0_25px_rgba(184,146,40,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(184,146,40,0.6)] hover:-translate-y-1 text-center hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t('cta_primary')}
                  {dir === 'ltr' ? (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </Link>
            ) : (
              <a
                href={`https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('wa_booking_intro'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full sm:w-auto px-10 py-4 overflow-hidden rounded-full bg-[#25D366] text-white font-bold tracking-wide shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] hover:-translate-y-1 text-center hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {t('btn_book_whatsapp')}
                  {dir === 'ltr' ? (
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </a>
            )}
          </div>

          {/* Quick Category Access */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 pt-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '1.05s' }}
          >
            {[
              { to: '/fleet', icon: Car, label: t('nav_fleet') },
              { to: '/hotels', icon: Building2, label: t('nav_hotels') },
              { to: '/flights', icon: PlaneTakeoff, label: t('nav_flights') },
              { to: '/tours', icon: Compass, label: t('nav_tours') },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/80 text-sm font-medium transition-all duration-300 hover:bg-gold-500 hover:border-gold-500 hover:text-white hover:-translate-y-0.5"
              >
                <Icon className="w-4 h-4 text-gold-400 group-hover:text-white transition-colors" />
                {label}
              </Link>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce-slow opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="text-[10px] text-white uppercase tracking-[0.2em] mb-2 font-light">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gold-500 to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
