
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { Offer } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Timer, Tag, Check, Car, Shield, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import NotFound from './NotFound';

const OfferDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { t, dir, language } = useLanguage();
   const [offer, setOffer] = useState<Offer | null>(null);
   const [relatedOffers, setRelatedOffers] = useState<Offer[]>([]);
   const [loading, setLoading] = useState(true);
   const [notFound, setNotFound] = useState(false);
   const [activeImage, setActiveImage] = useState<string>('');

   useEffect(() => {
      let cancelled = false;
      const fetchOffer = async (isRetry = false) => {
         if (!id) return;
         if (!isRetry) { setLoading(true); setNotFound(false); }
         let willRetry = false;
         try {
            const data = await api.getOfferById(id);
            if (cancelled) return;
            if (!data) {
               setOffer(null);
               setNotFound(true);
               return;
            }
            const allOffers = await api.getOffers();
            if (cancelled) return;
            setOffer(data);
            if (data.gallery) {
               setActiveImage(data.gallery[0] || data.image);
            } else {
               setActiveImage(data.image);
            }
            setRelatedOffers(allOffers.filter(o => o.id !== data.id).slice(0, 3));
         } catch (error: any) {
            console.error(error);
            if (cancelled) return;
            // Only a real 404 means the offer is gone; other failures (network/timeout) are
            // transient and shouldn't render <NotFound noIndex> for a page that actually exists.
            if (error?.response?.status === 404) {
               setNotFound(true);
            } else if (!isRetry) {
               willRetry = true;
               setTimeout(() => fetchOffer(true), 1500);
            }
         } finally {
            if (!cancelled && !willRetry) setLoading(false);
         }
      };
      fetchOffer();
      return () => { cancelled = true; };
   }, [id]);

   // Old numeric-id URLs (e.g. /offers/5) should canonicalize to the slug URL.
   const isNumericParam = !!id && /^\d+$/.test(id);
   const shouldRedirectToSlug = !loading && !notFound && offer && isNumericParam && offer.slug && offer.slug !== id;

   if (loading) {
      return (
         <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-7xl mx-auto">
               <Skeleton className="w-48 h-6 mb-8" />
               <Skeleton className="w-full h-[500px] rounded-3xl mb-8" />
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
      return <Navigate to={`/offers/${offer!.slug}`} replace />;
   }

   if (notFound || !offer) return <NotFound />;

   const displayTitle = offer.title ? offer.title[language] : (offer.titleKey ? t(offer.titleKey) : '');
   const displayDesc = offer.desc ? offer.desc[language] : (offer.descKey ? t(offer.descKey) : '');
   const galleryImages = offer.gallery && offer.gallery.length > 0 ? offer.gallery : [offer.image];
   const categoryNames: Record<string, { ar: string; en: string }> = {
      summer: { ar: 'عرض صيفي', en: 'Summer offer' },
      winter: { ar: 'عرض شتوي', en: 'Winter offer' },
      special: { ar: 'عرض خاص', en: 'Special offer' },
      seasonal: { ar: 'عرض موسمي', en: 'Seasonal offer' },
   };
   const categoryKey = offer.category?.trim().toLowerCase() || '';
   const displayCategory = categoryNames[categoryKey]?.[language] || offer.category || '';
   const formatDate = (date?: string) => date
      ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', {
         year: 'numeric', month: 'long', day: 'numeric',
      }).format(new Date(date))
      : '';
   const currency = language === 'ar' ? 'ريال' : 'SAR';
   return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24">
         <SEO
            title={(language === 'ar' ? offer.meta_title_ar : offer.meta_title_en) || offer.seo_title || displayTitle}
            description={(language === 'ar' ? offer.meta_description_ar : offer.meta_description_en) || offer.seo_description || displayDesc}
            image={offer.image}
            keywords={language === 'ar' ? offer.meta_keywords_ar : offer.meta_keywords_en}
         />

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

               {/* Left Content */}
               <div className="lg:col-span-2 space-y-6 bg-white dark:bg-slate-900 rounded-[2rem] p-4 md:p-6 shadow-xl shadow-slate-200/60 dark:shadow-black/20 border border-slate-100 dark:border-slate-800">

                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(240px,.85fr)] gap-4 items-stretch">
                     <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <ImageWithFallback
                           src={activeImage || offer.image}
                           alt={displayTitle}
                           loading="eager"
                           className="w-full h-full"
                           imageClassName="!object-contain"
                        />
                        {offer.discount && (
                           <div className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                              <Tag className="w-4 h-4" />
                              {offer.discount}
                           </div>
                        )}
                     </div>

                  {/* Offer summary */}
                  <div className="flex flex-col gap-3">
                     {displayCategory && (
                        <div className="inline-flex self-start items-center gap-2 rounded-full bg-gold-50 dark:bg-gold-900/20 px-4 py-2 text-sm font-bold text-gold-700 dark:text-gold-400">
                           <Car className="w-4 h-4" />
                           {displayCategory}
                        </div>
                     )}
                     {offer.discount && (
                        <div className="flex items-center gap-3 rounded-2xl bg-gold-50 dark:bg-gold-900/20 p-4 border border-gold-100 dark:border-gold-900/30">
                           <Tag className="w-5 h-5 text-gold-600" />
                           <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{language === 'ar' ? 'قيمة الخصم' : 'Discount'}</div>
                              <div className="font-bold text-slate-900 dark:text-white">{offer.discount}</div>
                           </div>
                        </div>
                     )}
                     {(offer.price !== undefined || offer.originalPrice !== undefined) && (
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-5 border border-slate-200 dark:border-slate-800">
                           <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{language === 'ar' ? 'سعر العرض' : 'Offer price'}</div>
                           <div className="flex items-center gap-3">
                              {offer.price !== undefined && <span className="text-xl font-bold text-gold-600">{offer.price} {currency}</span>}
                              {offer.originalPrice !== undefined && <span className="text-sm text-slate-400 line-through">{offer.originalPrice} {currency}</span>}
                           </div>
                        </div>
                     )}
                     {(offer.validFrom || offer.validUntil) && (
                        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-800">
                           <Timer className="w-5 h-5 text-gold-600 flex-shrink-0" />
                           <div className="text-sm text-slate-700 dark:text-slate-200 space-y-2">
                              {offer.validFrom && <div>{language === 'ar' ? 'ساري من' : 'Valid from'}: <strong>{formatDate(offer.validFrom)}</strong></div>}
                              {offer.validUntil && <div>{language === 'ar' ? 'ساري حتى' : 'Valid until'}: <strong>{formatDate(offer.validUntil)}</strong></div>}
                           </div>
                        </div>
                     )}
                     <p className="mt-1 rounded-2xl bg-white dark:bg-slate-900 px-4 py-3 text-sm leading-7 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">{displayDesc}</p>
                  </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-3xl bg-slate-50/80 dark:bg-slate-800/30 p-5 md:p-6 border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-3 mb-3">
                        <span className="h-8 w-1.5 rounded-full bg-gold-500" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('offer_details')}</h2>
                     </div>
                     <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {offer.fullDesc ? offer.fullDesc[language] : (offer.fullDescKey ? t(offer.fullDescKey) : t(offer.descKey))}
                     </p>
                  </div>

                  {/* Inclusions */}
                  {offer.inclusions && offer.inclusions.length > 0 && <div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('offer_inclusions')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {offer.inclusions?.map((item, idx) => (
                           <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                              <div className="w-8 h-8 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center flex-shrink-0">
                                 <Check className="w-4 h-4" />
                              </div>
                              <span className="text-slate-700 dark:text-slate-200 font-medium">{item}</span>
                           </div>
                        ))}
                     </div>
                  </div>}

                  {/* Gallery */}
                  {galleryImages.filter(Boolean).length > 1 && <div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('service_gallery')}</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {galleryImages.map((img, idx) => (
                           <div key={idx} className="rounded-xl overflow-hidden shadow-md h-48 group cursor-pointer bg-slate-100 dark:bg-slate-950" onClick={() => setActiveImage(img)}>
                              <ImageWithFallback
                                 src={img}
                                 className="w-full h-full"
                                 imageClassName="!object-contain group-hover:scale-105 transition-transform duration-700"
                              />
                           </div>
                        ))}
                     </div>
                  </div>}

                  {/* Terms */}
                  {(offer.terms?.length || offer.validFrom || offer.validUntil) && <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-900 dark:text-white font-bold mb-4">
                        <AlertCircle className="w-5 h-5 text-gold-500" />
                        <h3>{t('offer_terms')}</h3>
                     </div>
                     <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {offer.terms?.map((term, idx) => (
                           <li key={idx}>{term}</li>
                        ))}
                        {offer.validFrom && <li>{language === 'ar' ? 'ساري من' : 'Valid from'}: {formatDate(offer.validFrom)}</li>}
                        {offer.validUntil && <li>{language === 'ar' ? 'ساري حتى' : 'Valid until'}: {formatDate(offer.validUntil)}</li>}
                     </ul>
                  </div>}

               </div>

               {/* Right Booking Sidebar */}
               <div className="lg:col-span-1">
                  <div className="sticky top-28 space-y-4">

                     {/* Booking Box */}
                     <div className="bg-gradient-to-br from-slate-950 to-slate-800 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                           <Tag className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                           <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{t('booking_title')}</p>

                           {offer.price !== undefined && (
                              <div className="mb-6 pb-6 border-b border-white/10">
                                 <div className="flex items-end gap-3">
                                    <span className="text-4xl font-black text-gold-400">{offer.price}</span>
                                    <span className="text-sm text-slate-300 mb-1">{currency}</span>
                                 </div>
                                 {offer.originalPrice !== undefined && (
                                    <span className="text-sm text-slate-500 line-through">{offer.originalPrice} {currency}</span>
                                 )}
                              </div>
                           )}

                           {/* Pricing Display removed by user request if gateway off, but we can verify here */}
                           {t('payment_gateway_enabled') === 'true' && (
                              <div className="text-center mb-6">
                                 {/* Optional: Add price display here if needed when enabled */}
                              </div>
                           )}

                           {t('payment_gateway_enabled') === 'true' ? (
                              <Link
                                 to="/booking"
                                 state={{ notes: `Booking for offer: ${displayTitle}` }}
                                 className="w-full py-4 bg-gold-600 hover:bg-gold-700 text-white font-bold text-center rounded-xl shadow-lg hover:shadow-gold-500/30 transition-all flex justify-center items-center group mb-4"
                              >
                                 <Clock className="w-5 h-5 mr-2 animate-pulse" />
                                 {t('nav_book')}
                              </Link>
                           ) : (
                              <a
                                 href={`https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('whatsapp_offer_msg') + ' ' + displayTitle)}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="w-full py-4 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold text-center rounded-xl shadow-lg hover:shadow-[#25D366]/30 transition-all flex justify-center items-center group mb-4"
                              >
                                 <MessageCircle className="w-5 h-5 mr-2 animate-pulse" />
                                 {t('btn_book_whatsapp')}
                              </a>
                           )}

                           <p className="text-xs text-center text-slate-500">
                              {t('offer_instant')}
                           </p>
                        </div>
                     </div>

                     {/* Highlights */}
                     <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 px-2">{t('offer_highlights')}</h3>
                        <div className="space-y-4">
                           <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <div className="w-10 h-10 bg-gold-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gold-500 mr-3 rtl:ml-3">
                                 <Shield className="w-5 h-5" />
                              </div>
                              <div className="text-sm">
                                 <div className="font-bold text-slate-900 dark:text-white">{t('highlight_vip')}</div>
                                 <div className="text-slate-500">{t('highlight_vip_desc')}</div>
                              </div>
                           </div>
                           <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                              <div className="w-10 h-10 bg-gold-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gold-500 mr-3 rtl:ml-3">
                                 <Clock className="w-5 h-5" />
                              </div>
                              <div className="text-sm">
                                 <div className="font-bold text-slate-900 dark:text-white">{t('highlight_247')}</div>
                                 <div className="text-slate-500">{t('highlight_247_desc')}</div>
                              </div>
                           </div>
                           {offer.category && (
                              <div className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                 <div className="w-10 h-10 bg-gold-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gold-500 mr-3 rtl:ml-3">
                                    <Car className="w-5 h-5" />
                                 </div>
                                 <div className="text-sm">
                                    <div className="font-bold text-slate-900 dark:text-white">{displayCategory}</div>
                                    <div className="text-slate-500">{t('highlight_luxury_desc')}</div>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>

                  </div>
               </div>

            </div>

            {/* Related Offers */}
            {relatedOffers.length > 0 && (
               <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">{t('offer_more')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {relatedOffers.map(relOffer => (
                        <Link key={relOffer.id} to={`/offers/${relOffer.slug || relOffer.id}`} className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 dark:border-slate-800">
                           <div className="h-48 overflow-hidden relative bg-slate-100 dark:bg-slate-950">
                              <ImageWithFallback
                                 src={relOffer.image}
                                 className="w-full h-full"
                                 imageClassName="!object-contain transform group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">{relOffer.discount}</div>
                           </div>
                           <div className="p-6">
                              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{relOffer.title ? relOffer.title[language] : t(relOffer.titleKey)}</h4>
                              <div className="flex items-center justify-between text-sm mt-4">
                                 <div className="flex items-center text-slate-500">
                                    <Timer className="w-4 h-4 mr-1 rtl:ml-1" />
                                    <span>{relOffer.validUntil}</span>
                                 </div>
                                 <span className="text-gold-500 font-medium group-hover:underline">{t('btn_view_details')}</span>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default OfferDetailPage;
