
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { transformImage } from '../services/api';

const AboutSection: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section className="py-16 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Content Side */}
          <ScrollReveal animation="slide-left" duration="1200ms" delay="200ms" className="w-full lg:w-1/2 space-y-8 order-2 lg:order-1">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-sm">
              <div>
                <h4 className="text-gold-500 font-bold tracking-wider uppercase mb-2 text-sm">{t('about_subtitle')}</h4>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  {t('about_title')}
                </h2>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                {t('about_desc')}
              </p>

              <ul className="space-y-4 mt-6">
                {['about_badge_chauffeurs', 'about_badge_support', 'about_badge_fleet'].map((key, idx) => (
                  <li key={idx} className="flex items-center space-x-3 rtl:space-x-reverse text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center text-slate-900 dark:text-white font-semibold border-b-2 border-gold-500 hover:text-gold-500 transition-colors pb-1 group"
                >
                  <span>{t('btn_read_more')}</span>
                  {dir === 'ltr' ? (
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="mr-2 w-5 h-5 rotate-180 transform group-hover:-translate-x-1 transition-transform" />
                  )}
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Image Side */}
          <ScrollReveal animation="slide-right" duration="1200ms" className="w-full lg:w-1/2 relative group order-1 lg:order-2">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-400 to-gold-600 rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform transition-transform duration-700 hover:scale-[1.02] h-[500px]">
              <img
                src={t('about_image') ? transformImage(t('about_image')) : "/assets/about_new.png"}
                alt="Luxury Journey"
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
