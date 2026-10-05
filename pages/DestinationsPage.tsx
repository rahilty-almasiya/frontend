import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 6;

const DestinationsPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(destinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = destinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={t('nav_destinations')}
        description={t('destinations_subtitle')}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_destinations') }]}
        title={t('destinations_title')}
        subtitle={t('destinations_subtitle')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl h-[420px] p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                <Skeleton className="w-full h-56 rounded-xl" />
                <Skeleton className="w-2/3 h-8" />
                <Skeleton className="w-full h-16" />
              </div>
            ))
          ) : paginatedDestinations.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <MapPin className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-slate-500">{t('no_destinations_found')}</p>
            </div>
          ) : (
            paginatedDestinations.map((destination, index) => {
              const displayName = destination.name[language];
              const displayRegion = destination.region ? destination.region[language] : '';

              return (
                <ScrollReveal key={destination.id} animation="fade-up" delay={`${index * 100}ms`} className="h-full">
                  <div
                    onClick={() => navigate(`/destinations/${destination.id}`)}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col h-full cursor-pointer hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={destination.image}
                        alt={displayName}
                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      {displayRegion && (
                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {displayRegion}
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors">
                        {displayName}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {destination.desc[language]}
                      </p>
                      <Link
                        to={`/destinations/${destination.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-gold-500 uppercase tracking-wider transition-colors mt-auto"
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
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DestinationsPage;
