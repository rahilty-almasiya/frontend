// FleetSection.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Car } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Users, Briefcase } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';

const FleetSection: React.FC<{ limit?: number }> = ({ limit }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [fleet, setFleet] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        const data = await api.getFleet();
        setFleet(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFleet();
  }, []);

  const categories = ['All', 'Luxury', 'SUV', 'Van', 'Sedan', 'Economy'];

  let displayFleet = filter === 'All' ? fleet : fleet.filter(car => car.category === filter);
  if (limit) displayFleet = displayFleet.slice(0, limit);

  const gridClass = limit === 4
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";

  // Helper to safely get a display name string from Car.name (which can be string | {en,ar})
  const getDisplayName = (car: Car | string | undefined) => {
    if (!car) return '';
    // if caller passed Car object
    if (typeof car !== 'string' && (car as Car).name) {
      const c = car as Car;
      if (typeof c.name === 'string') return c.name;
      return language === 'ar' ? c.name.ar : c.name.en;
    }
    // if caller passed name value (string | translations)
    const val = car as any;
    if (typeof val === 'string') return val;
    return language === 'ar' ? val.ar : val.en;
  };

  return (
    <section className="py-16 relative z-10" id="fleet">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal animation="fade-up" className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('fleet_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('fleet_subtitle')}
            </p>
          </div>

          {!limit && (
            <div className="flex flex-wrap gap-2 md:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${filter === cat
                    ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                >
                  {t(`filter_${cat.toLowerCase()}`)}
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        <div className={gridClass}>
          {loading
            ? Array.from({ length: limit || 8 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl h-[400px] p-4 flex flex-col gap-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-4" />
                <div className="mt-auto flex justify-between">
                  <Skeleton className="w-20 h-8" />
                  <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
              </div>
            ))
            : displayFleet.map((car, index) => {
              const name = getDisplayName(car);
              
              const handleCardClick = (e: React.MouseEvent) => {
                // If the user didn't click on the Book button (which is handled separately)
                navigate(`/fleet/${car.slug || car.id}`);
              };

              const handleBookClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                navigate('/booking', { state: { carId: car.id } });
              };

              const handleWhatsAppClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                const msg = encodeURIComponent(t('wa_booking_intro') + ' ' + name);
                window.open(`https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
              };

              return (
                <ScrollReveal
                  key={car.id}
                  delay={`${index * 100}ms`}
                  animation="fade-up"
                  className="h-full"
                >
                  <div 
                    onClick={handleCardClick}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 group flex flex-col h-full border border-slate-200 dark:border-slate-800 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Top Container (Image + Header) */}
                    <div className="flex flex-col flex-grow group/card">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <ImageWithFallback
                          src={car.image}
                          alt={name}
                          className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-gold-400 text-xs font-bold uppercase tracking-wider shadow-lg">
                          {typeof car.category === 'string'
                            ? car.category
                            : (language === 'ar' ? car.category?.name_ar : car.category?.name_en)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate group-hover/card:text-gold-500 transition-colors">{name}</h3>

                        <div className="flex space-x-4 rtl:space-x-reverse text-xs text-slate-500 dark:text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div className="flex items-center">
                            <Users className="w-3.5 h-3.5 mr-1 rtl:ml-1 text-gold-500" />
                            <span>{car.passengers} {t('car_passengers')}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-3.5 h-3.5 mr-1 rtl:ml-1 text-gold-500" />
                            <span>{car.luggage} {t('car_luggage')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-5 pt-0 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-500 dark:text-slate-400 text-sm">
                          {(t('payment_gateway_enabled') === 'true' && car.pricePerDay !== undefined && car.pricePerDay !== null) && (
                            <>
                              {t('car_starting_from')}
                              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                                {car.pricePerDay} <span className="text-xs font-normal text-slate-500">{language === 'ar' ? 'ريال/يوم' : 'SAR/day'}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {t('payment_gateway_enabled') === 'true' ? (
                          <button
                            onClick={handleBookClick}
                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                          >
                            {t('book_vehicle')}
                          </button>
                        ) : (
                          <button
                            onClick={handleWhatsAppClick}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
                          >
                            <span>{t('btn_book_whatsapp')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          }
        </div>

        {limit && (
          <ScrollReveal animation="fade-up" delay="200ms" className="mt-6 text-center">
            <Link to="/fleet" className="inline-block px-8 py-3 border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-900 dark:text-white rounded-full font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all hover:scale-105 hover:shadow-lg">
              {t('cta_secondary')}
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default FleetSection;
