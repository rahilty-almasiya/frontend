import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { TourPackage, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Clock, MapPin, Filter } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 6;

const ToursPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>((location.state as any)?.destinationId || 'All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toursData, destData] = await Promise.all([
          api.getTourPackages(),
          api.getDestinations(),
        ]);
        setTours(toursData);
        setDestinations(destData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTours = filter === 'All' ? tours : tours.filter(tour => tour.destination_id === filter);

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (destId: string) => {
    setFilter(destId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={t('nav_tours')}
        description={t('tours_subtitle')}
      />

      <PageHero
        breadcrumbItems={[{ label: t('nav_tours') }]}
        title={t('tours_title')}
        subtitle={t('tours_subtitle')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {destinations.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <div className="flex items-center mr-4 rtl:ml-4 rtl:mr-0 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">
              <Filter className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{t('filter_by')}</span>
            </div>
            <button
              onClick={() => handleFilterChange('All')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${filter === 'All'
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 ring-2 ring-gold-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-gold-500 hover:text-gold-500'
                }`}
            >
              {t('filter_all_destinations')}
            </button>
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleFilterChange(dest.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${filter === dest.id
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 ring-2 ring-gold-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                  : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-gold-500 hover:text-gold-500'
                  }`}
              >
                {dest.name[language]}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl h-[450px] p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                <Skeleton className="w-full h-56 rounded-xl" />
                <Skeleton className="w-2/3 h-8" />
                <Skeleton className="w-full h-16" />
              </div>
            ))
          ) : paginatedTours.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <MapPin className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
              <p className="text-slate-500">{t('no_tours_found')}</p>
            </div>
          ) : (
            paginatedTours.map((tour, index) => {
              const displayName = tour.title[language];

              return (
                <ScrollReveal key={tour.id} animation="fade-up" delay={`${index * 100}ms`} className="h-full">
                  <div
                    onClick={() => navigate(`/tours/${tour.id}`)}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col h-full cursor-pointer hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={tour.image}
                        alt={displayName}
                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      {tour.destination && (
                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {tour.destination.name[language]}
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors">
                        {displayName}
                      </h3>
                      {(tour.durationDays || tour.durationNights) && (
                        <div className="flex items-center text-xs text-slate-400 mb-3">
                          <Clock className="w-3.5 h-3.5 mr-1 rtl:ml-1" />
                          {tour.durationDays ? `${tour.durationDays} ${t('days_label')}` : ''}
                          {tour.durationNights ? ` / ${tour.durationNights} ${t('nights_label')}` : ''}
                        </div>
                      )}
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {tour.desc[language]}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-4">
                        {(tour.price !== undefined && tour.price !== null && Number(tour.price) > 0) && (
                          <div className="text-gold-500 font-bold">
                            <span className="text-xl">{tour.price}</span>
                            <span className="text-sm font-normal text-slate-500 ml-1">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                          </div>
                        )}
                        <Link
                          to={`/tours/${tour.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-gold-500 uppercase tracking-wider transition-colors ml-auto"
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

export default ToursPage;
