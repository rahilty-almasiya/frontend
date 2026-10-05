import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PromoSlide } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Skeleton from './Skeleton';

const PromoSlider: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await api.getPromoSlides();
        setSlides(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="w-full h-[500px]">
        <Skeleton className="w-full h-full" />
      </section>
    );
  }

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt="Promo"
              className="w-full h-full object-cover"
              loading="eager" // Eager load for hero components
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className={`max-w-2xl transform transition-all duration-700 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-4 py-1 bg-gold-500 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-6">
                Limited Offer
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {slide.title ? slide.title[language] : t(slide.titleKey)}
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                {slide.subtitle ? slide.subtitle[language] : t(slide.subtitleKey)}
              </p>
              <Link
                to={slide.ctaKey === 'nav_book' ? '/booking' : '/contact'}
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-gold-500 hover:text-white transition-all transform hover:scale-105"
              >
                {t('cta_primary')}
                {dir === 'ltr' ? <ChevronRight className="ml-2 w-5 h-5" /> : <ChevronRight className="mr-2 w-5 h-5 rotate-180" />}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 rtl:space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-gold-500 w-8' : 'bg-white/50 hover:bg-white'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoSlider;