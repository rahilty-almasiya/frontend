import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Car, CarCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Users, Briefcase, Filter } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 3;

const FleetPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [fleet, setFleet] = useState<Car[]>([]);
  const [categories, setCategories] = useState<CarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fleetData, catData] = await Promise.all([
          api.getFleet(),
          api.getCarCategories()
        ]);
        setFleet(fleetData);
        setCategories(catData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCarName = (car: Car) => {
    if (!car) return '';
    if (typeof car.name === 'string') return car.name;
    return language === 'ar' ? car.name.ar : car.name.en;
  };

  const getCategoryName = (car: Car) => {
    if (!car.category) return 'Uncategorized';
    if (typeof car.category === 'string') return car.category;
    return language === 'ar' ? car.category.name_ar : car.category.name_en;
  };

  const getCategoryFilterValue = (car: Car) => {
    // Return a stable string for filtering (e.g. English name or ID)
    if (!car.category) return 'Uncategorized';
    if (typeof car.category === 'string') return car.category;
    return car.category.name_en; // Use English name for filtering consistency
  };

  const filteredFleet = fleet.filter(car => {
    const matchesCategory = filter === 'All' || getCategoryFilterValue(car) === filter;
    const matchesSearch = getCarName(car).toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredFleet.length / ITEMS_PER_PAGE);
  const paginatedFleet = filteredFleet.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (category: string) => {
    setFilter(category);
    setCurrentPage(1);
  };

  // Build filter list. Start with 'All'. Use fetched categories if available, else fallback? 
  // Actually we should rely on fetched categories.
  // We can convert fetched categories to a simple string array for the filter Bar used currently.
  const filterCategories = ['All', ...categories.map(c => c.name_en)]; // Using English names for filter keys

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={t('nav_fleet')}
        description={t('fleet_subtitle')}
      />
      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_fleet') }]}
        title={t('fleet_title')}
        subtitle={t('fleet_subtitle')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto mb-12 relative group">
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن سيارة...' : 'Search for a car...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all pr-12 rtl:pl-12 rtl:pr-6"
          />
          <div className="absolute right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gold-500 transition-colors">
            <Filter className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="flex items-center mr-4 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest">
            <Filter className="w-4 h-4 mr-2" />
            <span>{t('filter_by')}</span>
          </div>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${filter === cat
                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 ring-2 ring-gold-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-gold-500 hover:text-gold-500'
                }`}
            >
              {
                cat === 'All' ? t('filter_all') :
                  language === 'ar'
                    ? categories.find(c => c.name_en === cat)?.name_ar || cat
                    : categories.find(c => c.name_en === cat)?.name_en || cat
              }
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl h-[450px] p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                <Skeleton className="w-full h-56 rounded-xl" />
                <Skeleton className="w-2/3 h-8" />
                <div className="flex space-x-4">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-full h-px my-2" />
                <div className="mt-auto flex justify-between items-center">
                  <Skeleton className="w-24 h-8" />
                  <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
              </div>
            ))
          ) : (
            paginatedFleet.map((car, index) => {
              const name = getCarName(car);
              const categoryName = getCategoryName(car);

              const handleCardClick = () => {
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
                <div
                  key={car.id}
                  onClick={handleCardClick}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 group flex flex-col h-full border border-slate-200 dark:border-slate-800 animate-slide-up cursor-pointer hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <ImageWithFallback
                      src={car.image}
                      alt={name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                      {categoryName}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-gold-500 transition-colors">{name}</h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {car.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                          {t(feature)}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-6 rtl:space-x-reverse text-xs text-slate-500 dark:text-slate-400 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 rtl:ml-2 text-gold-500" />
                        <span>{car.passengers} {t('car_passengers')}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 rtl:ml-2 text-gold-500" />
                        <span>{car.luggage} {t('car_luggage')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        {(t('payment_gateway_enabled') === 'true' && car.pricePerDay !== undefined && car.pricePerDay !== null) && (
                          <>
                            <span className="text-slate-400 text-xs font-medium uppercase">{t('car_starting_from')}</span>
                            <div className="text-xl font-bold text-gold-500 mt-1">
                              {car.pricePerDay} <span className="text-xs font-normal text-slate-500">{language === 'ar' ? 'ريال/يوم' : 'SAR/day'}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {t('payment_gateway_enabled') === 'true' ? (
                        <button
                          onClick={handleBookClick}
                          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          {t('book_vehicle')}
                        </button>
                      ) : (
                        <button
                          onClick={handleWhatsAppClick}
                          className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold uppercase hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          {t('btn_book_whatsapp')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
    </div >
  );
};

export default FleetPage;
