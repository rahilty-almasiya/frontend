import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Car, Review } from '../types';
import { useAuth } from '../context/AuthContext'; // Need auth for submission
import { useLanguage } from '../context/LanguageContext';
import {
   Users, Briefcase, Fuel, Settings, Gauge, Calendar,
   Check, Star, Shield, Clock, Award, Phone, MessageCircle, Zap,
   ArrowLeft, ArrowRight
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';
import NotFound from './NotFound';

const CarDetailPage: React.FC = () => {
   const { id } = useParams<{ id?: string }>();
   const { t, language } = useLanguage();
   const [car, setCar] = useState<Car | null>(null);
   const [relatedCars, setRelatedCars] = useState<Car[]>([]);
   const [loading, setLoading] = useState(true);
   const [notFound, setNotFound] = useState(false);
   const [activeImage, setActiveImage] = useState<string | null>(null);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [submittingReview, setSubmittingReview] = useState(false);
   const [userRating, setUserRating] = useState(0);
   const [hoveredRating, setHoveredRating] = useState(0);
   const [reviewsPagination, setReviewsPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
   const { user } = useAuth();

   const fetchReviews = async (page = 1) => {
      if (!id) return;
      try {
         const response = await api.getCarReviews(id, page);
         // Handle both old array format and new pagination object format for robustness
         if (Array.isArray(response)) {
           setReviews(response);
           setReviewsPagination({ current_page: 1, last_page: 1, total: response.length });
         } else {
           setReviews(response.data);
           setReviewsPagination({
              current_page: response.current_page,
              last_page: response.last_page,
              total: response.total
           });
         }
      } catch (error) {
         console.error("Failed to fetch reviews", error);
      }
   };

   useEffect(() => {
      let cancelled = false;
      const fetchCar = async (isRetry = false) => {
         if (!id) return;
         if (!isRetry) { setLoading(true); setNotFound(false); }
         let willRetry = false;
         try {
            const data = await api.getCarById(id);
            if (cancelled) return;
            if (!data) {
               setCar(null);
               setNotFound(true);
               return;
            }
            const allCars = await api.getFleet();
            if (cancelled) return;
            setCar(data);
            setActiveImage(data.image);
            setRelatedCars(allCars.filter(c => c.id !== data.id && c.category === data.category).slice(0, 3));
            fetchReviews();
         } catch (error: any) {
            console.error(error);
            if (cancelled) return;
            // Only a real 404 means the car is gone; other failures (network/timeout) are
            // transient and shouldn't render <NotFound noIndex> for a page that actually exists.
            if (error?.response?.status === 404) {
               setNotFound(true);
            } else if (!isRetry) {
               willRetry = true;
               setTimeout(() => fetchCar(true), 1500);
            }
         } finally {
            if (!cancelled && !willRetry) setLoading(false);
         }
      };
      fetchCar();
      return () => { cancelled = true; };
   }, [id]);

   // Old numeric-id URLs (e.g. /fleet/7) should canonicalize to the slug URL.
   const isNumericParam = !!id && /^\d+$/.test(id);
   const shouldRedirectToSlug = !loading && !notFound && car && isNumericParam && car.slug && car.slug !== id;

   const getDisplayName = (cOrName: Car | string | any) => {
      if (!cOrName) return '';
      if (typeof cOrName !== 'string' && (cOrName as Car).name) {
         const c = cOrName as Car;
         if (typeof c.name === 'string') return c.name;
         return language === 'ar' ? c.name.ar : c.name.en;
      }
      if (typeof cOrName === 'string') return cOrName;
      return language === 'ar' ? cOrName.ar : cOrName.en;
   };

   const handleWhatsAppBooking = () => {
      if (!car) return;

      const displayName = getDisplayName(car);

      const msg = t('car_inquiry_msg').replace('{car}', displayName);

      const whatsappUrl = `https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
   };

   const getCategoryName = (cat: any) => {
      if (!cat) return '';
      if (typeof cat === 'string') return cat;
      return language === 'ar' ? cat.name_ar : cat.name_en;
   };

   if (loading) {
      return (
         <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-7xl mx-auto">
               <Skeleton className="w-48 h-6 mb-8" />
               <Skeleton className="w-full h-[600px] rounded-3xl mb-8" />
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-6">
                     <Skeleton className="w-full h-12" />
                     <Skeleton className="w-full h-32" />
                  </div>
                  <Skeleton className="h-96 rounded-2xl" />
               </div>
            </div>
         </div>
      );
   }

   if (shouldRedirectToSlug) {
      return <Navigate to={`/fleet/${car!.slug}`} replace />;
   }

   if (notFound || !car) return <NotFound />;

   const galleryImages = car.gallery && car.gallery.length > 0 ? car.gallery : [car.image, car.image, car.image];
   const displayName = getDisplayName(car);
   const categoryName = getCategoryName(car.category);

   const specs = [
      { icon: Users, label: t('car_passengers'), value: car.passengers },
      { icon: Briefcase, label: t('car_luggage'), value: car.luggage },
      { icon: Fuel, label: t('spec_fuel'), value: (car.specs?.fuel ? (t(car.specs.fuel) !== car.specs.fuel ? t(car.specs.fuel) : car.specs.fuel) : t('val_petrol')) },
      { icon: Zap, label: t('spec_engine'), value: car.specs?.engine ? (t(car.specs.engine) !== car.specs.engine ? t(car.specs.engine) : (t(`val_${car.specs.engine.toLowerCase().replace(/\s+/g, '_')}`) !== `val_${car.specs.engine.toLowerCase().replace(/\s+/g, '_')}` ? t(`val_${car.specs.engine.toLowerCase().replace(/\s+/g, '_')}`) : car.specs.engine)) : t('val_v8') },
      { icon: Settings, label: t('spec_transmission'), value: (car.specs?.transmission ? (t(car.specs.transmission) !== car.specs.transmission ? t(car.specs.transmission) : car.specs.transmission) : t('val_auto')) },
      { icon: Gauge, label: t('spec_speed'), value: car.specs?.speed ? (t(car.specs.speed) !== car.specs.speed ? t(car.specs.speed) : (t(`val_speed_${car.specs.speed.split(' ')[0]}`) !== `val_speed_${car.specs.speed.split(' ')[0]}` ? t(`val_speed_${car.specs.speed.split(' ')[0]}`) : car.specs.speed)) : t('val_speed_250') },
   ];

   return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pb-12 pt-24">
         <SEO
            title={car.seo_title || displayName}
            description={car.seo_description || (car.descriptionKey ? t(car.descriptionKey) : '')}
            image={car.image}
            keywords={language === 'ar' ? car.meta_keywords_ar : car.meta_keywords_en}
         />

         {/* Hero Header */}
         <PageHero
        breadcrumbItems={[
                     { label: t('nav_fleet'), path: '/fleet' },
                     { label: displayName }
                  ]}
        title={displayName}
      />

         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Gallery */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12 animate-fade-in">
               <div className="lg:col-span-9 relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <ImageWithFallback
                     src={activeImage || car.image}
                     alt={displayName}
                     className="w-full h-full object-contain md:object-cover"
                  />
               </div>

               <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {galleryImages.map((img, idx) => (
                     <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative flex-shrink-0 w-24 h-24 lg:w-full lg:h-full lg:flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                     >
                        <ImageWithFallback src={img} alt={`${displayName} gallery ${idx + 1}`} className="w-full h-full object-cover" />
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
               <div className="lg:col-span-2 space-y-12">
                  <div className="animate-slide-up">
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('service_overview')}</h2>
                     <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {car.descriptionKey ? t(car.descriptionKey) : t('car_desc_generic')}
                     </p>
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('specifications_title')}</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {specs.map((spec, idx) => {
                           const Icon = spec.icon;
                           return (
                              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-gold-500/30 transition-colors">
                                 <Icon className="w-6 h-6 text-gold-500 mb-3" />
                                 <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">{spec.label}</span>
                                 <span className="font-bold text-slate-900 dark:text-white">{spec.value}</span>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('car_features_title')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(car.features || []).map((feature, idx) => (
                           <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="w-6 h-6 rounded-full bg-gold-500 text-white flex items-center justify-center flex-shrink-0">
                                 <Check className="w-3 h-3" />
                              </div>
                              <span className="text-slate-700 dark:text-slate-200 font-medium">
                                 {t(feature) !== feature ? t(feature) : feature}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('car_inclusions_title')}</h2>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                           <Shield className="w-8 h-8 text-gold-500 mb-3" />
                           <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('highlight_vip')}</h4>
                           <p className="text-xs text-slate-500">{t('highlight_vip_desc')}</p>
                        </div>
                        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                           <Award className="w-8 h-8 text-gold-500 mb-3" />
                           <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('highlight_chauffeur')}</h4>
                           <p className="text-xs text-slate-500">{t('highlight_chauffeur_desc')}</p>
                        </div>
                        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                           <Clock className="w-8 h-8 text-gold-500 mb-3" />
                           <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('highlight_247')}</h4>
                           <p className="text-xs text-slate-500">{t('highlight_247_desc')}</p>
                        </div>
                        <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                           <Star className="w-8 h-8 text-gold-500 mb-3" />
                           <h4 className="font-bold text-slate-900 dark:text-white mb-1">{t('highlight_luxury')}</h4>
                           <p className="text-xs text-slate-500">{t('highlight_luxury_desc')}</p>
                        </div>
                     </div>
                  </div>

                  {/* Route Prices Section */}
                  <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('car_route_rates_title')}</h2>
                        <span className="px-3 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold rounded-full border border-gold-500/20">
                           {t('car_best_price')}
                        </span>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(car.route_prices && car.route_prices.length > 0 ? car.route_prices : [
                           { id: '1', from_en: 'Jeddah Airport', from_ar: 'مطار جدة', to_en: 'Makkah Hotel', to_ar: 'فنادق مكة', price: 350 },
                           { id: '2', from_en: 'Makkah', from_ar: 'مكة المكرمة', to_en: 'Jeddah', to_ar: 'جدة', price: 300 },
                           { id: '3', from_en: 'Jeddah', from_ar: 'جدة', to_en: 'Medina', to_ar: 'المدينة المنورة', price: 900 },
                           { id: '4', from_en: 'Makkah', from_ar: 'مكة المكرمة', to_en: 'Medina', to_ar: 'المدينة المنورة', price: 800 },
                        ]).map((route, idx) => (
                           <div key={route.id || idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-gold-500/30 transition-all group relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />

                              <div className="relative z-10">
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                       <div className="flex items-center text-xs text-slate-400 uppercase tracking-tighter">
                                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 rtl:ml-2"></span>
                                          {t('car_from')}
                                       </div>
                                       <div className="font-bold text-slate-900 dark:text-white">
                                          {language === 'ar' ? route.from_ar : route.from_en}
                                       </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2 self-center"></div>
                                    <div className="space-y-1 text-right rtl:text-left">
                                       <div className="flex items-center justify-end text-xs text-slate-400 uppercase tracking-tighter">
                                          {t('car_to')}
                                          <span className="w-2 h-2 rounded-full bg-gold-500 ml-2 rtl:mr-2"></span>
                                       </div>
                                       <div className="font-bold text-slate-900 dark:text-white">
                                          {language === 'ar' ? route.to_ar : route.to_en}
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex flex-col">
                                       {t('payment_gateway_enabled') === 'true' && (
                                          <>
                                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t('car_price')}</span>
                                             <div className="text-xl font-black text-gold-500">
                                                {route.price} <span className="text-xs font-normal text-slate-400">{t('car_sar')}</span>
                                             </div>
                                          </>
                                       )}
                                       {t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true' && (
                                          <span className="text-xs text-green-500 font-medium">{language === 'ar' ? 'احجز للسعر' : 'Book for price'}</span>
                                       )}
                                    </div>
                                    {t('payment_gateway_enabled') === 'true' ? (
                                       <Link
                                          to="/booking"
                                          state={{
                                             carId: car.id,
                                             pickup: language === 'ar' ? route.from_ar : route.from_en,
                                             dropoff: language === 'ar' ? route.to_ar : route.to_en,
                                             fixedPrice: route.price
                                          }}
                                          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white transition-colors"
                                       >
                                          {t('car_book_now')}
                                       </Link>
                                    ) : (
                                       <button
                                          onClick={() => {
                                             const msg = t('car_route_inquiry')
                                                .replace('{from}', language === 'ar' ? route.from_ar : route.from_en)
                                                .replace('{to}', language === 'ar' ? route.to_ar : route.to_en)
                                                .replace('{car}', displayName);
                                             const whatsappUrl = `https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
                                             window.open(whatsappUrl, '_blank');
                                          }}
                                          className="px-4 py-2 bg-[#25D366] dark:bg-[#25D366] text-white text-xs font-bold rounded-lg hover:bg-[#1ebc57] dark:hover:bg-[#1ebc57] transition-colors"
                                       >
                                          {t('btn_book_whatsapp') || (language === 'ar' ? 'احجز عبر واتساب' : 'Book via WhatsApp')}
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Booking Sidebar */}
               <div className="lg:col-span-1">
                  <div className="sticky top-28 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                     {t('payment_gateway_enabled') === 'true' && (
                        <div className="text-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                           <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">{t('car_starting_from')}</p>
                           <div className="text-xl font-bold text-slate-900 dark:text-white">
                              {t('booking_contact_rates')}
                           </div>
                           <p className="text-gold-500 text-xs font-bold mt-2">{t('car_best_price')}</p>
                        </div>
                     )}

                     <div className="space-y-4">
                        {t('payment_gateway_enabled') === 'true' ? (
                           <Link
                              to="/booking"
                              state={{ carId: car.id }}
                              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center rounded-xl shadow-lg transition-all flex justify-center items-center hover:scale-105"
                           >
                              {t('nav_book')}
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
                           href={`tel:${t('contact_phone')?.replace(/\s+/g, '')}`}
                           className="flex items-center justify-center text-slate-900 dark:text-white font-bold hover:text-gold-500 transition-colors"
                        >
                           <Phone className="w-4 h-4 mr-2" />
                           {t('contact_phone')}
                        </a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800 animate-slide-up" style={{ animationDelay: '0.5s' }}>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                     <div className="flex items-center justify-between mb-8">
                        <h2 id="reviews-section" className="text-2xl font-bold text-slate-900 dark:text-white">{t('car_reviews')}</h2>
                        <div className="flex items-center text-gold-500 font-bold bg-gold-500/5 px-4 py-2 rounded-xl border border-gold-500/10">
                           <Star className="w-5 h-5 fill-current mr-2" />
                           <span className="text-xl">{car.average_rating?.toFixed(1) || '5.0'}</span>
                           <span className="text-slate-400 text-sm ml-2 font-normal">/ 5.0</span>
                        </div>
                     </div>

                     <div className="space-y-6">
                        {reviews.length > 0 ? (
                           reviews.map((review) => (
                              <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold uppercase">
                                          {review.user?.name?.charAt(0) || 'U'}
                                       </div>
                                       <div>
                                          <div className="font-bold text-slate-900 dark:text-white">
                                             {review.user?.name}
                                          </div>
                                          <div className="text-[10px] text-slate-400">
                                             {new Date(review.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center text-gold-500">
                                       {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                       ))}
                                    </div>
                                 </div>
                                 <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                    {review.comment}
                                 </p>
                              </div>
                           ))
                        ) : (
                           <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                               <Star className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                               <p className="text-slate-500">{t('car_no_reviews')}</p>
                            </div>
                         )}
  
                         {/* Pagination Controls */}
                         {reviewsPagination.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-in">
                               <button
                                  disabled={reviewsPagination.current_page === 1}
                                  onClick={() => {
                                     fetchReviews(reviewsPagination.current_page - 1);
                                     document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-gold-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all font-bold text-sm"
                               >
                                  {t('common_previous')}
                               </button>
                               
                               <div className="flex items-center gap-2">
                                  {Array.from({ length: reviewsPagination.last_page }, (_, i) => i + 1).map((p) => {
                                    // Simple logic to show current, first, last and 1 neighbor
                                    const isVisible = p === 1 || p === reviewsPagination.last_page || Math.abs(p - reviewsPagination.current_page) <= 1;
                                    
                                    if (!isVisible) {
                                       if (p === 2 || p === reviewsPagination.last_page - 1) return <span key={p} className="text-slate-300">...</span>;
                                       return null;
                                    }

                                    return (
                                       <button
                                          key={p}
                                          onClick={() => {
                                             fetchReviews(p);
                                             document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                          }}
                                          className={`w-10 h-10 rounded-xl font-bold transition-all text-sm ${
                                             reviewsPagination.current_page === p
                                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                                                : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-gold-500/50'
                                          }`}
                                       >
                                          {p}
                                       </button>
                                    );
                                  })}
                               </div>
  
                               <button
                                  disabled={reviewsPagination.current_page === reviewsPagination.last_page}
                                  onClick={() => {
                                     fetchReviews(reviewsPagination.current_page + 1);
                                     document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-gold-500 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all font-bold text-sm"
                               >
                                  {t('common_next')}
                               </button>
                            </div>
                         )}
                      </div>
                  </div>

                  <div className="lg:col-span-1">
                     <div className="bg-slate-900 dark:bg-slate-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10">
                           <h3 className="text-xl font-bold mb-2">{t('car_write_review')}</h3>
                           <p className="text-slate-400 text-xs mb-6 leading-relaxed">{t('car_review_desc')}</p>

                           {user ? (
                              <form onSubmit={async (e) => {
                                 e.preventDefault();
                                 const form = e.target as HTMLFormElement;
                                 const rating = userRating || parseInt(form.rating.value);
                                 const comment = form.comment.value;
                                 if (!rating) return;

                                 setSubmittingReview(true);
                                 try {
                                    await api.submitReview({ car_id: car.id, rating, comment });
                                    form.reset();
                                    setUserRating(0);
                                    fetchReviews();
                                 } catch (err) {
                                    console.error(err);
                                 } finally {
                                    setSubmittingReview(false);
                                 }
                              }} className="space-y-4">
                                 <div>
                                    <label className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-slate-400">{t('review_rating')}</label>
                                    <div className="flex gap-2">
                                       {[1, 2, 3, 4, 5].map((num) => (
                                          <label 
                                             key={num} 
                                             className="cursor-pointer group"
                                             onMouseEnter={() => setHoveredRating(num)}
                                             onMouseLeave={() => setHoveredRating(0)}
                                             onClick={() => setUserRating(num)}
                                          >
                                             <input type="radio" name="rating" value={num} className="sr-only" required />
                                             <Star 
                                                className={`w-6 h-6 transition-all duration-200 ${
                                                   (hoveredRating || userRating) >= num 
                                                      ? 'fill-gold-500 text-gold-500 scale-110' 
                                                      : 'text-slate-600 group-hover:text-gold-400'
                                                }`} 
                                             />
                                          </label>
                                       ))}
                                    </div>
                                 </div>
                                 <div>
                                    <label className="text-[10px] uppercase font-bold tracking-widest block mb-2 text-slate-400">{t('review_comment')}</label>
                                    <textarea
                                       name="comment"
                                       className="w-full bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 min-h-[100px]"
                                       placeholder={t('review_placeholder')}
                                    ></textarea>
                                 </div>
                                 <button
                                    disabled={submittingReview}
                                    type="submit"
                                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20 disabled:opacity-50"
                                 >
                                    {submittingReview ? t('common_sending') : t('btn_submit_review')}
                                 </button>
                              </form>
                           ) : (
                              <div className="text-center py-6 bg-white/5 rounded-2xl border border-white/10">
                                 <p className="text-sm text-slate-300 mb-4">{t('review_login_required')}</p>
                                 <Link to="/login" className="px-6 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg hover:bg-gold-500 hover:text-white transition-colors">
                                    {t('nav_login')}
                                 </Link>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Related Cars */}
            {relatedCars.length > 0 && (
               <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('car_you_might_like')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {relatedCars.map(relCar => {
                        const relName = getDisplayName(relCar);
                        return (
                              <Link key={relCar.id} to={`/fleet/${relCar.slug || relCar.id}`} className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 dark:border-slate-800">
                              <div className="h-48 overflow-hidden relative">
                                 <ImageWithFallback src={relCar.image} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={relName} />
                                 <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-gold-400 text-[10px] font-bold uppercase">{t(`filter_${getCategoryName(relCar.category).toLowerCase()}`)}</div>
                              </div>
                              <div className="p-6">
                                 <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{relName}</h4>
                                 <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-sm">{t('car_starting_from')}</span>
                                    <span className="text-gold-500 text-sm font-medium group-hover:underline">{t('service_btn_learn')}</span>
                                 </div>
                              </div>
                           </Link>
                        );
                     })}
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default CarDetailPage;
