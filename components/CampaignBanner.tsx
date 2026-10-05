
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const CampaignBanner: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* High-Quality Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/Ford.png"
          alt="Campaign Background"
          loading="lazy"
          className="w-full h-full object-cover object-center transform transition-transform duration-[20s] hover:scale-105 animate-float"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10"></div>
        {/* Decorative Pattern Overlay (Optional) */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-10"></div>
      </div>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        
        {/* Animated Content */}
        <ScrollReveal animation="fade-up" className="max-w-4xl flex flex-col items-center">
           
           {/* Top Badge */}
           <div className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-6 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-500/40 backdrop-blur-md">
              <Star className="w-4 h-4 text-gold-400 fill-current animate-spin-slow" />
              <span className="text-gold-200 text-xs font-bold uppercase tracking-widest">{t('campaign_badge')}</span>
              <Star className="w-4 h-4 text-gold-400 fill-current animate-spin-slow" />
           </div>

           {/* Title */}
           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
             {t('campaign_title')}
           </h2>
           
           {/* Subtitle */}
           <p className="text-lg md:text-2xl text-slate-200 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
             {t('campaign_subtitle')}
           </p>
           
           {/* CTA Button */}
           <Link 
             to="/offers" 
             className="group relative inline-flex items-center px-10 py-5 bg-gold-500 text-white font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(184,146,40,0.5)] transition-all hover:scale-105 hover:bg-gold-400 active:scale-95"
           >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></div>
              <span className="relative z-10 flex items-center">
                {t('campaign_cta')}
                {dir === 'ltr' ? (
                  <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                ) : (
                  <ArrowRight className="mr-3 w-6 h-6 rotate-180 transition-transform group-hover:-translate-x-1" />
                )}
              </span>
           </Link>
        </ScrollReveal>
      </div>
      
      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent z-30 opacity-50"></div>
    </section>
  );
};

export default CampaignBanner;
