
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, ArrowRight, Star, Clock, Calendar, Phone, Plus, Minus, MessageCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import DOMPurify from 'dompurify';
import PageHero from '../components/PageHero';
import NotFound from './NotFound';

const ServiceDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { t, dir, language } = useLanguage();
   const [service, setService] = useState<Service | null>(null);
   const [relatedServices, setRelatedServices] = useState<Service[]>([]);
   const [loading, setLoading] = useState(true);
   const [notFound, setNotFound] = useState(false);
   const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

   useEffect(() => {
      let cancelled = false;
      const fetchService = async (isRetry = false) => {
         if (!id) return;
         if (!isRetry) { setLoading(true); setNotFound(false); }
         let willRetry = false;
         try {
            const data = await api.getServiceById(id);
            if (cancelled) return;
            if (!data) {
               setService(null);
               setNotFound(true);
               return;
            }
            const allServices = await api.getServices();
            if (cancelled) return;
            setService(data);
            setRelatedServices(allServices.filter(s => s.id !== data.id).slice(0, 3));
         } catch (error: any) {
            console.error(error);
            if (cancelled) return;
            // Only a real 404 means the service is gone; other failures (network/timeout) are
            // transient and shouldn't render <NotFound noIndex> for a page that actually exists.
            if (error?.response?.status === 404) {
               setNotFound(true);
            } else if (!isRetry) {
               willRetry = true;
               setTimeout(() => fetchService(true), 1500);
            }
         } finally {
            if (!cancelled && !willRetry) setLoading(false);
         }
      };
      fetchService();
      return () => { cancelled = true; };
   }, [id]);

   // Old numeric-id URLs (e.g. /services/3) should canonicalize to the slug URL.
   const isNumericParam = !!id && /^\d+$/.test(id);
   const shouldRedirectToSlug = !loading && !notFound && service && isNumericParam && service.slug && service.slug !== id;

   const toggleAccordion = (index: number) => {
      setActiveAccordion(activeAccordion === index ? null : index);
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
                     <Skeleton className="w-full h-16" />
                  </div>
                  <Skeleton className="h-96 rounded-2xl" />
               </div>
            </div>
         </div>
      );
   }

   if (shouldRedirectToSlug) {
      return <Navigate to={`/services/${service!.slug}`} replace />;
   }

   if (notFound || !service) return <NotFound />;

   const decodeHtmlEntities = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
   };

   const displayName = service.title ? service.title[language] : t(service.titleKey);
   const isTourismService = service.id === '8' || service.titleKey === 'services_hotel_booking_title';

   const handleWhatsAppBooking = () => {
      if (!service) return;
      const msg = encodeURIComponent(t('wa_booking_intro') + ' ' + displayName);
      const whatsappKey = isTourismService ? 'contact_tourism_whatsapp' : 'contact_whatsapp';
      const whatsappUrl = `https://wa.me/${t(whatsappKey)?.replace(/[^0-9]/g, '')}?text=${msg}`;
      window.open(whatsappUrl, '_blank');
   };

   return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
         <SEO
            title={service.seo_title || displayName}
            description={service.seo_description || (service.desc ? service.desc[language] : t(service.descKey))}
            image={service.image}
            keywords={language === 'ar' ? service.meta_keywords_ar : service.meta_keywords_en}
         />

         {/* 1. Hero Header */}
         <PageHero
        breadcrumbItems={[
                     { label: t('nav_services'), path: '/services' },
                     { label: displayName }
                  ]}
        title={displayName}
      />

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

               {/* Main Content (Left) */}
               <div className="lg:col-span-2 space-y-12">

                  {/* 2. Overview */}
                  <div className="animate-fade-in">
                     <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <ImageWithFallback src={service.image} className="w-full h-80 object-cover" />
                     </div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t('service_overview')}</h2>
                     <div
                        className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 rich-text max-w-none"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        dangerouslySetInnerHTML={{
                           __html: DOMPurify.sanitize(
                              decodeHtmlEntities(service.desc ? service.desc[language] : t(service.descKey)),
                              {
                                 ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'a', 'span'],
                                 ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'rel']
                              }
                           )
                        }}
                     />
                     <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                        {t('services_hero_desc')}
                     </p>

                     {/* Features List */}
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('service_features')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features?.map((feature, idx) => (
                           <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                              <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{t(feature)}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 4. Gallery */}
                  {service.gallery && service.gallery.length > 0 && (
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('service_gallery')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {service.gallery.map((img, idx) => (
                              <div key={idx} className="rounded-xl overflow-hidden shadow-md h-64 hover:shadow-xl transition-shadow cursor-pointer">
                                 <ImageWithFallback src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* 5. FAQs */}
                  {service.faqs && service.faqs.length > 0 && (
                     <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('service_faq')}</h3>
                        <div className="space-y-4">
                           {service.faqs.map((faq, idx) => (
                              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
                                 <button
                                    onClick={() => toggleAccordion(idx)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                 >
                                    <span className="font-bold text-slate-900 dark:text-white">{t(faq.question)}</span>
                                    {activeAccordion === idx ? <Minus className="w-5 h-5 text-gold-500" /> : <Plus className="w-5 h-5 text-slate-400" />}
                                 </button>
                                 <div className={`px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed transition-all duration-300 ${activeAccordion === idx ? 'block' : 'hidden'}`}>
                                    {t(faq.answer)}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

               </div>

               {/* Right Booking Sidebar */}
               <div className="lg:col-span-1">
                  <div className="sticky top-28 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                     
                     {(t('payment_gateway_enabled') === 'true' && service.price !== undefined && service.price !== null && Number(service.price) > 0) && (
                        <div className="text-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                           <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{t('car_starting_from')}</p>
                           <div className="text-2xl font-bold text-gold-500">
                              {service.price} <span className="text-sm font-normal text-slate-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                           </div>
                           <p className="text-gold-500 text-xs font-bold mt-2">{t('car_best_price')}</p>
                        </div>
                     )}

                     {(t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true') && (
                        <div className="text-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                           <p className="text-green-500 text-sm font-medium">
                              {language === 'ar' ? 'احجز عبر واتساب للحصول على السعر' : 'Book via WhatsApp for pricing'}
                           </p>
                        </div>
                     )}

                     <div className="space-y-4">
                        {t('payment_gateway_enabled') === 'true' ? (
                           <Link
                              to="/booking"
                              state={{ serviceId: service.id }}
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
                           href={`tel:${t(isTourismService ? 'contact_tourism_phone' : 'contact_phone')?.replace(/\s+/g, '')}`}
                           className="flex items-center justify-center text-slate-900 dark:text-white font-bold hover:text-gold-500 transition-colors"
                        >
                           <Phone className="w-4 h-4 mr-2" />
                           {t(isTourismService ? 'contact_tourism_phone' : 'contact_phone')}
                        </a>
                     </div>
                  </div>
               </div>

            </div>
         </div>

         {/* 6. Related Services */}
         <div className="bg-slate-100 dark:bg-slate-900/50 py-20 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('related_services')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedServices.map(relService => (
                     <Link key={relService.id} to={`/services/${relService.slug || relService.id}`} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                        <div className="h-48 overflow-hidden">
                           <ImageWithFallback src={relService.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-6">
                           <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">{t(relService.titleKey)}</h3>
                           <div className="flex items-center text-sm text-gold-500 font-medium">
                              {t('service_btn_learn')} <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180" />
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>

      </div>
   );
};

export default ServiceDetailPage;
