// DestinationsSection.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, ArrowRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';

const DestinationsSection: React.FC<{ limit?: number }> = ({ limit = 4 }) => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const displayDestinations = limit ? destinations.slice(0, limit) : destinations;

  if (!loading && displayDestinations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative z-10" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('destinations_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('destinations_subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl h-[320px] p-4 flex flex-col gap-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-4" />
              </div>
            ))
            : displayDestinations.map((destination, index) => {
              const name = destination.name[language];
              const region = destination.region ? destination.region[language] : '';

              return (
                <ScrollReveal key={destination.id} delay={`${index * 100}ms`} animation="fade-up" className="h-full">
                  <div
                    onClick={() => navigate(`/destinations/${destination.id}`)}
                    className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 border border-slate-200 dark:border-slate-800 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ImageWithFallback
                        src={destination.image}
                        alt={name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {region && (
                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-gold-400 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {region}
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 right-4">
                        <h3 className="text-lg font-bold text-white drop-shadow-md">{name}</h3>
                      </div>
                    </div>
                    <div className="p-4 mt-auto">
                      <Link
                        to={`/destinations/${destination.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-bold text-gold-500 hover:text-gold-600 uppercase tracking-wider transition-colors"
                      >
                        {t('service_btn_learn')}
                        {dir === 'ltr' ? (
                          <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                        ) : (
                          <ArrowRight className="mr-2 w-3 h-3 rotate-180 transition-transform group-hover:-translate-x-1" />
                        )}
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          }
        </div>

        <ScrollReveal animation="fade-up" delay="200ms" className="mt-10 text-center">
          <Link to="/destinations" className="inline-block px-8 py-3 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all hover:scale-105 hover:shadow-lg">
            {t('cta_secondary')}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DestinationsSection;
