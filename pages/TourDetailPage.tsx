import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { TourPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, MessageCircle, Calendar } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import ReviewsSection from '../components/ReviewsSection';
import PageHero from '../components/PageHero';

const getItineraryText = (item: any, field: 'title' | 'description', language: 'en' | 'ar') => {
  if (!item) return '';
  const localized = item[`${field}_${language}`];
  if (localized) return localized;
  if (typeof item[field] === 'object' && item[field]) return item[field][language] || '';
  return item[field] || '';
};

const TourDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [relatedTours, setRelatedTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchTour = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getTourPackageById(id);
        setTour(data || null);
        if (data) {
          const allTours = await api.getTourPackages(data.destination_id);
          setRelatedTours(allTours.filter(tr => tr.id !== id).slice(0, 3));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleWhatsAppBooking = () => {
    if (!tour) return;
    const displayName = tour.title[language];
    const msg = encodeURIComponent(t('wa_booking_intro') + ' ' + displayName);
    window.open(`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="w-48 h-6 mb-8" />
          <Skeleton className="w-full h-[500px] rounded-3xl mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-full h-8 mb-4" />
              <Skeleton className="w-full h-32" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) return <div className="min-h-screen pt-32 text-center text-slate-900 dark:text-white">{t('tour_not_found')}</div>;

  const displayName = tour.title[language];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO
        title={tour.seo_title || displayName}
        description={tour.seo_description || tour.desc[language]}
        image={tour.image}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[
              { label: t('nav_tours'), path: '/tours' },
              { label: displayName }
            ]}
        title={displayName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="animate-fade-in">
              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                <ImageWithFallback src={tour.image} className="w-full h-80 object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t('tour_overview')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                {tour.longDesc && tour.longDesc[language] ? tour.longDesc[language] : tour.desc[language]}
              </p>

              {tour.includes && tour.includes.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('tour_includes')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tour.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Itinerary Timeline */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('tour_itinerary')}</h3>
                <div className="relative pl-8 rtl:pl-0 rtl:pr-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-3 rtl:before:left-auto rtl:before:right-3 before:w-0.5 before:bg-gold-500/20">
                  {tour.itinerary.map((item: any, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-8 rtl:-left-auto rtl:-right-8 top-1 w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-gold-500/30">
                        {item.day || idx + 1}
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xs uppercase tracking-widest text-gold-500 font-bold mb-1">
                          {t('day_label')} {item.day || idx + 1}
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                          {getItineraryText(item, 'title', language)}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {getItineraryText(item, 'description', language)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tour.gallery && tour.gallery.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('tour_gallery')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-md h-64 hover:shadow-xl transition-shadow cursor-pointer">
                      <ImageWithFallback src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up" style={{ animationDelay: '0.2s' }}>

              {(tour.price !== undefined && tour.price !== null && Number(tour.price) > 0) && (
                <div className="text-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{t('tour_price')}</p>
                  <div className="text-2xl font-bold text-gold-500">
                    {tour.price} <span className="text-sm font-normal text-slate-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                  </div>
                </div>
              )}

              {(tour.durationDays || tour.durationNights) && (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  <span>
                    {tour.durationDays ? `${tour.durationDays} ${t('days_label')}` : ''}
                    {tour.durationNights ? ` / ${tour.durationNights} ${t('nights_label')}` : ''}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {t('payment_gateway_enabled') === 'true' ? (
                  <Link
                    to="/booking"
                    state={{ tourPackageId: tour.id }}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center rounded-xl shadow-lg transition-all flex justify-center items-center hover:scale-105"
                  >
                    {t('tour_book_cta')}
                  </Link>
                ) : (
                  <button
                    onClick={handleWhatsAppBooking}
                    className="w-full py-4 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold text-center rounded-xl shadow-lg hover:shadow-[#25D366]/30 transition-all flex justify-center items-center group"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 animate-pulse" />
                    {t('btn_book_whatsapp')}
                  </button>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 mb-2">{t('car_need_help')}</p>
                <a
                  href={`tel:${t('contact_tourism_phone')?.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center text-slate-900 dark:text-white font-bold hover:text-gold-500 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t('contact_tourism_phone')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection reviewableType="tour_package" reviewableId={tour.id} />
      </div>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-900/50 py-20 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('related_tours')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedTours.map(relTour => (
                <Link key={relTour.id} to={`/tours/${relTour.id}`} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback src={relTour.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">{relTour.title[language]}</h3>
                    <div className="flex items-center text-sm text-gold-500 font-medium">
                      {t('service_btn_learn')} <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetailPage;
