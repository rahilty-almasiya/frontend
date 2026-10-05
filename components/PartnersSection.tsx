
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';

const PartnersSection: React.FC = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<{ id: number, name: string, logo: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await api.getPartners();
        setPartners(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section className="py-16 relative z-10 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-in" className="text-center mb-12">
          <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {t('partners_title')}
          </h3>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-32" />
            ))
            : partners.map((partner, index) => (
              <ScrollReveal
                key={partner.id}
                animation="fade-up"
                delay={`${index * 100}ms`}
                className="w-full flex justify-center"
              >
                <div
                  className="group w-full flex justify-center transition-all duration-500 opacity-90 hover:opacity-100 hover:scale-110"
                >
                  <div className="relative h-12 w-32 md:w-40">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain dark:invert"
                      loading="lazy"
                    />
                    {/* Tooltip on hover (optional) */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                      {partner.name}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
