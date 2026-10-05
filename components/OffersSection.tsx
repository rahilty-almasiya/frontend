
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Offer } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';

const OffersSection: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await api.getOffers();
        setOffers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {t('offers_title')}
            </h2>
            <div className="h-1 w-20 bg-gold-500 rounded-full"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-[340px] rounded-2xl w-full" />
            ))
            : offers.map((offer, index) => (
              <ScrollReveal
                key={offer.id}
                delay={`${index * 150}ms`}
                animation="zoom-in"
                className="h-full max-w-sm mx-auto w-full"
              >
                <Link
                  to={`/offers/${offer.slug || offer.id}`}
                  className="group h-full rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <ImageWithFallback
                      src={offer.image}
                      alt={offer.title ? offer.title[language] : t(offer.titleKey)}
                      className="w-full"
                      imageClassName="!h-auto !object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      style={{ height: 'auto', objectFit: 'contain' }}
                    />
                    {offer.discount && (
                      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-gold-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-lg text-xs">
                        {offer.discount}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">{offer.title ? offer.title[language] : t(offer.titleKey)}</h3>

                    {(t('payment_gateway_enabled') === 'true' && (offer.price || offer.originalPrice)) && (
                      <div className="flex items-center gap-2 mb-2">
                        {offer.originalPrice && <span className="text-xs text-slate-400 line-through">{offer.originalPrice} {language === 'ar' ? 'ريال' : 'SAR'}</span>}
                        {offer.price && <span className="text-base font-bold text-gold-500">{offer.price} {language === 'ar' ? 'ريال' : 'SAR'}</span>}
                      </div>
                    )}

                    {(t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true') && (
                      <div className="text-sm text-green-600 dark:text-green-400 mb-2 font-medium">
                        {language === 'ar' ? 'احجز عبر واتساب للسعر' : 'Book via WhatsApp for price'}
                      </div>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{offer.desc ? offer.desc[language] : t(offer.descKey)}</p>
                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
                      {(offer.validFrom || offer.validUntil) && <div className="flex items-center text-slate-500 text-[10px] font-medium min-w-0">
                        <Timer className="w-4 h-4 mr-2 rtl:ml-2" />
                        <span className="truncate">
                          {offer.validUntil && <>{language === 'ar' ? 'حتى' : 'Until'}: {new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(offer.validUntil))}</>}
                        </span>
                      </div>}
                      <span className="flex items-center flex-shrink-0 text-gold-500 text-xs font-bold uppercase tracking-wider">
                        {t('btn_view_details')}
                        {dir === 'ltr' ? <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> : <ArrowRight className="w-4 h-4 mr-2 rotate-180 transition-transform group-hover:-translate-x-1" />}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
