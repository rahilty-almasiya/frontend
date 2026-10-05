import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Destination, Hotel } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, MapPin, Star, Building2, Search } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 6;

const HotelsPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  const { category: categorySlug } = useParams<{ category?: string }>();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [categories, setCategories] = useState<Destination[]>([]);
  const [activeCategory, setActiveCategory] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setCategories(await api.getHotelCategories());
        if (categorySlug) {
          const result = await api.getHotelsByCategory(categorySlug);
          setActiveCategory(result.category);
          setHotels(result.hotels);
        } else {
          setActiveCategory(null);
          setHotels(await api.getHotels());
        }
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlug]);

  const filteredHotels = hotels.filter((hotel) => {
    const query = searchQuery.trim().toLocaleLowerCase(language === 'ar' ? 'ar' : 'en');
    if (!query) return true;

    return [hotel.name?.[language], hotel.city?.[language], hotel.desc?.[language]]
      .filter(Boolean)
      .some((value) => String(value).toLocaleLowerCase(language === 'ar' ? 'ar' : 'en').includes(query));
  });

  const totalPages = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={activeCategory ? activeCategory.name[language] : (language === 'ar' ? 'الفنادق' : 'Hotels')}
        description={language === 'ar' ? 'اكتشف أفضل الفنادق حسب الوجهة' : 'Discover our top hotels by destination'}
      />

      <PageHero
        breadcrumbItems={[
          { label: language === 'ar' ? 'الفنادق' : 'Hotels', path: categorySlug ? '/hotels' : undefined },
          ...(activeCategory ? [{ label: activeCategory.name[language] }] : []),
        ]}
        title={activeCategory ? `${language === 'ar' ? 'فنادق' : 'Hotels in'} ${activeCategory.name[language]}` : (language === 'ar' ? 'الفنادق' : 'Hotels')}
        subtitle={language === 'ar' ? 'إقامة فاخرة تناسب رحلتك' : 'Luxury stays for your journey'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 mb-12">
        {categories.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 mb-12 border border-slate-100 dark:border-slate-800 animate-fade-in" aria-label={language === 'ar' ? 'تصنيفات الفنادق' : 'Hotel categories'}>
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="flex gap-2 min-w-max">
                  <Link
                    to="/hotels"
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!categorySlug
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                  >
                    {language === 'ar' ? 'الكل' : 'All'}
                  </Link>
                  {categories.map((category) => {
                    const isActive = activeCategory?.id === category.id;
                    return (
                      <Link
                        key={category.id}
                        to={`/hotels/category/${category.slug || category.id}`}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isActive
                          ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                        {category.name[language]}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="relative w-full lg:w-80">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }}
                  placeholder={language === 'ar' ? 'ابحث في الفنادق...' : 'Search hotels...'}
                  aria-label={language === 'ar' ? 'البحث في الفنادق' : 'Search hotels'}
                  className="w-full ps-12 pe-4 py-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl h-[420px] p-6 flex flex-col gap-4 border border-slate-100 dark:border-slate-800">
                <Skeleton className="w-full h-56 rounded-xl" />
                <Skeleton className="w-2/3 h-8" />
                <Skeleton className="w-full h-16" />
              </div>
            ))
          ) : paginatedHotels.length === 0 ? (
            <div className="col-span-full text-center py-20 px-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
                <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {activeCategory
                  ? (language === 'ar'
                    ? `لا توجد فنادق مضافة في ${activeCategory.name.ar} حاليًا`
                    : `No hotels have been added in ${activeCategory.name.en} yet`)
                  : (language === 'ar' ? 'لا توجد فنادق مضافة حاليًا' : 'No hotels have been added yet')}
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
                {language === 'ar'
                  ? 'عند إضافة فنادق لهذا التصنيف من لوحة التحكم ستظهر هنا تلقائيًا.'
                  : 'Hotels added to this category from the dashboard will appear here automatically.'}
              </p>
              {categorySlug && (
                <Link to="/hotels" className="inline-flex items-center mt-6 px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-white text-sm font-bold transition-colors">
                  {language === 'ar' ? 'العودة إلى كل التصنيفات' : 'Back to all categories'}
                </Link>
              )}
            </div>
          ) : (
            paginatedHotels.map((hotel, index) => {
              const displayName = hotel.name[language];
              const displayCity = hotel.city ? hotel.city[language] : '';

              return (
                <ScrollReveal key={hotel.id} animation="fade-up" delay={`${index * 100}ms`} className="h-full">
                  <div
                    onClick={() => navigate(`/hotels/${hotel.slug || hotel.id}`)}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col h-full cursor-pointer hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={hotel.image}
                        alt={displayName}
                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      {displayCity && (
                        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {displayCity}
                        </div>
                      )}
                      {!!hotel.star_rating && (
                        <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-amber-500 text-xs font-bold shadow-sm flex items-center gap-1">
                          {Array.from({ length: hotel.star_rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors">
                        {displayName}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {hotel.desc?.[language]}
                      </p>
                      <Link
                        to={`/hotels/${hotel.slug || hotel.id}`}
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

export default HotelsPage;
