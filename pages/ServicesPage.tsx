import React, { useEffect, useState } from 'react';
import { api, transformImage } from '../services/api';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, Gem, Clock, Phone, UserCheck, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import Skeleton from '../components/Skeleton';

const ITEMS_PER_PAGE = 3;

const ServicesPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    api.getServices()
      .then(setServices)
      .catch((error) => console.error('Failed to fetch services', error))
      .finally(() => setLoading(false));
  }, []);

  const whyChooseUs = [
    { icon: UserCheck, title: 'about_badge_chauffeurs', desc: 'highlight_chauffeur_desc' },
    { icon: Gem, title: 'about_badge_fleet', desc: 'highlight_luxury_desc' },
    { icon: Clock, title: 'val_reliability', desc: 'val_reliability_desc' },
    { icon: Phone, title: 'about_badge_support', desc: 'highlight_247_desc' },
  ];

  // Pagination Logic
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const paginatedServices = services.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={t('nav_services')}
        description={t('services_subtitle')}
      />
      {/* 1. Hero Section */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_services') }]}
        title={t('services_title')}
        subtitle={t('services_subtitle')}
      />

      {/* 2. Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-center space-x-2 text-gold-500 mb-4">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            {t('services_hero_title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('services_hero_desc')}
          </p>
        </div>
      </div>

      {/* 3. Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div
              key={`service-skeleton-${index}`}
              className="h-[520px] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
              aria-hidden="true"
            >
              <Skeleton className="h-full w-full" />
            </div>
          )) : paginatedServices.map((service, index) => {
            const displayName = service.title ? service.title[language] : t(service.titleKey);
            const isTourismService = service.id === '8' || service.titleKey === 'services_hotel_booking_title';
            
            const handleCardClick = () => {
              navigate(`/services/${service.slug || service.id}`);
            };

            const handleBookClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              navigate('/booking', { state: { serviceId: service.id } });
            };

            const handleWhatsAppClick = (e: React.MouseEvent) => {
              e.stopPropagation();
              const msg = encodeURIComponent(t('wa_booking_intro') + ' ' + displayName);
              const whatsappKey = isTourismService ? 'contact_tourism_whatsapp' : 'contact_whatsapp';
              window.open(`https://wa.me/${t(whatsappKey)?.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
            };

            return (
              <div
                key={service.id}
                onClick={handleCardClick}
                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col h-full animate-slide-up cursor-pointer hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={displayName}
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors">
                    {displayName}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {service.desc ? service.desc[language] : t(service.descKey)}
                  </p>
                  <div className="mt-auto">

                    {(service.price !== undefined && service.price !== null && Number(service.price) > 0) && (
                      <div className="mb-4 text-gold-500 font-bold">
                        <span className="text-xl">{service.price}</span>
                        <span className="text-sm font-normal text-slate-500 ml-1">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <Link
                        to={`/services/${service.slug || service.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-gold-500 uppercase tracking-wider transition-colors"
                      >
                        {t('service_btn_learn')}
                        {dir === 'ltr' ? (
                          <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                        ) : (
                          <ArrowRight className="mr-2 w-3 h-3 rotate-180 transition-transform group-hover:-translate-x-1" />
                        )}
                      </Link>

                      {t('payment_gateway_enabled') === 'true' ? (
                        <button
                          onClick={handleBookClick}
                          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          {t('nav_book')}
                        </button>
                      ) : (
                        <button
                          onClick={handleWhatsAppClick}
                          className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {t('btn_book_whatsapp')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 4. Why Choose Us */}
      <div className="bg-slate-100/80 dark:bg-slate-900/50 backdrop-blur-sm py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t('why_choose_us')}</h2>
            <div className="w-24 h-1.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto bg-gold-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gold-500 mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t(item.title)}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t(item.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/assets/services-booking-cta.jpeg"
            alt="CTA Background"
            className="w-full h-full"
            imageClassName="object-fill h-[calc(100%+12px)]"
          />
          <div className="absolute inset-0 bg-slate-900/80"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {t('book_service_cta')}
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            {t('services_hero_desc')}
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center px-8 py-4 bg-gold-700 text-white font-bold rounded-full text-lg shadow-lg hover:bg-gold-600 hover:shadow-gold-500/50 transition-all transform hover:-translate-y-1"
          >
            {t('nav_book')}
            {dir === 'ltr' ? <ArrowRight className="ml-2 w-5 h-5" /> : <ArrowRight className="mr-2 w-5 h-5 rotate-180" />}
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ServicesPage;
