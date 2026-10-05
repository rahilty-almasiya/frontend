import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import ImageWithFallback from './ImageWithFallback';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';

/* Swiper */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

/* Swiper Styles */
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Services: React.FC = () => {
  const { t, dir, language } = useLanguage();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔑 Key to force Swiper re-init on language/dir change */
  const [swiperKey, setSwiperKey] = useState(0);

  /* ================= Fetch Services ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ================= Re-init Swiper on dir change ================= */
  useEffect(() => {
    setSwiperKey((prev) => prev + 1);
  }, [dir]);

  return (
    <section className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= Section Header ================= */}
        <ScrollReveal className="text-center mb-16" animation="fade-up">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('services_title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
            {t('services_subtitle')}
          </p>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </ScrollReveal>

        {/* ================= Swiper ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] rounded-2xl overflow-hidden bg-white/50 dark:bg-slate-800/50"
              >
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            key={swiperKey}
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            dir={dir}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="services-swiper"
          >
            {services.map((service, index) => (
              <SwiperSlide key={service.id}>
                <ScrollReveal
                  delay={`${index * 100}ms`}
                  animation="fade-up"
                  className="h-full"
                >
                  <div
                    className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer
                               shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-700
                               border border-transparent hover:border-gold-500/50
                               bg-white dark:bg-slate-900"
                  >
                    {/* ================= Image ================= */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title ? service.title[language] : t(service.titleKey)}
                        className="w-full h-full object-cover transform transition-transform
                                   duration-1000 group-hover:scale-110"
                      />
                    </div>

                    {/* ================= Overlay ================= */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90"></div>

                    {/* ================= Content ================= */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white mb-2 relative inline-block">
                          {service.title ? service.title[language] : t(service.titleKey)}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-500 group-hover:w-full"></span>
                        </h3>

                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 group-hover:text-white transition-colors duration-300">
                          {service.desc ? service.desc[language] : t(service.descKey)}
                        </p>

                        <div className="flex items-center justify-between text-white border-t border-white/20 pt-3 mt-2">
                          {(t('payment_gateway_enabled') === 'true' && service.price !== undefined && service.price !== null) && (
                            <span className="text-lg font-bold text-gold-500">
                              {service.price} <span className="text-xs font-normal text-white">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                            </span>
                          )}
                        </div>

                        <div className="pt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          <Link
                            to="/services"
                            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm
                                       hover:bg-gold-500 text-white text-xs font-bold uppercase tracking-widest
                                       rounded-full transition-all duration-300 hover:scale-105"
                          >
                            {t('service_btn_learn')}
                            {dir === 'ltr' ? (
                              <ArrowRight className="ml-2 w-3 h-3" />
                            ) : (
                              <ArrowRight className="mr-2 w-3 h-3 rotate-180" />
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Services;
