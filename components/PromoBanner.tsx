
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const PromoBanner: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative w-full h-[500px] md:h-[400px] overflow-hidden my-12">
      {/* Background with Parallax Feel */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/Ford.png"
          alt="Corporate Travel"
          loading="lazy"
          className="w-full h-full object-cover object-center animate-zoom-in"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-slate-900/70 z-10"></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${dir === 'ltr' ? 'from-slate-950 via-slate-900/80 to-transparent' : 'from-transparent via-slate-900/80 to-slate-950'} z-10`}></div>
      </div>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <ScrollReveal animation="slide-right" duration="1000ms" className="max-w-2xl">

          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <span className="p-2 bg-gold-500/20 rounded-lg border border-gold-500/30 text-gold-400">
              <Briefcase className="w-5 h-5 animate-pulse-slow" />
            </span>
            <span className="text-gold-400 font-bold tracking-widest uppercase text-sm">{t('promo_vip_badge')}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('promo_banner_title')}
          </h2>

          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            {t('promo_banner_subtitle')}
          </p>

          {t('payment_gateway_enabled') === 'true' ? (
            <Link
              to="/booking"
              className="group relative inline-flex items-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all hover:bg-gold-500 hover:text-white hover:shadow-[0_0_20px_rgba(184,146,40,0.4)] hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center">
                {t('promo_banner_cta')}
                {dir === 'ltr' ? (
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" />
                )}
              </span>
            </Link>
          ) : (
            <a
              href={`https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('whatsapp_msg'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center px-8 py-4 bg-[#25D366] text-white font-bold rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center">
                {t('btn_book_whatsapp')}
                {dir === 'ltr' ? (
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                ) : (
                  <ArrowRight className="mr-2 w-5 h-5 rotate-180 transition-transform group-hover:-translate-x-1" />
                )}
              </span>
            </a>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PromoBanner;
