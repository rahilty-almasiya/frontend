import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Offer } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Timer, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 6;

const OffersPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [offers, setOffers] = useState<Offer[]>([]);

  const formatDate = (date?: string) => date
    ? new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(date))
    : '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    api.getOffers().then(setOffers);
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(offers.length / ITEMS_PER_PAGE);
  const paginatedOffers = offers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO
        title={t('nav_offers')}
        description={t('offers_header_desc')}
      />
      {/* Header */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_offers') }]}
        title={t('offers_title')}
        subtitle={t('offers_header_desc')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedOffers.map((offer, index) => (
            <Link
              key={offer.id}
              to={`/offers/${offer.slug || offer.id}`}
              className="group w-full max-w-xs mx-auto bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 flex flex-col h-full border border-slate-200 dark:border-slate-800 animate-slide-up hover:-translate-y-1"
              style={{ animationDelay: `${index * 150}ms` }}
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
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-gold-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-lg text-xs">
                    <Tag className="w-4 h-4" />
                    <span>{offer.discount}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">{offer.title ? offer.title[language] : t(offer.titleKey)}</h3>

                {(t('payment_gateway_enabled') === 'true' && (offer.price || offer.originalPrice)) && (
                  <div className="flex items-center gap-3 mb-2">
                    {offer.originalPrice && <span className="text-sm text-slate-400 line-through">{offer.originalPrice} {language === 'ar' ? 'ريال' : 'SAR'}</span>}
                    {offer.price && <span className="text-base font-bold text-gold-500">{offer.price} {language === 'ar' ? 'ريال' : 'SAR'}</span>}
                  </div>
                )}

                {(t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true') && (
                  <div className="text-sm text-green-600 dark:text-green-400 mb-3 font-medium">
                    {language === 'ar' ? 'احجز عبر واتساب للسعر' : 'Book via WhatsApp for price'}
                  </div>
                )}

                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed line-clamp-2">{offer.desc ? offer.desc[language] : t(offer.descKey)}</p>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  {(offer.validFrom || offer.validUntil) && <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs font-medium min-w-0 leading-5">
                    <Timer className="w-4 h-4 mr-2 rtl:ml-2" />
                    <span>
                      {offer.validFrom && <>{language === 'ar' ? 'من' : 'From'}: {formatDate(offer.validFrom)}</>}
                      {offer.validFrom && offer.validUntil && <span className="mx-1">—</span>}
                      {offer.validUntil && <>{language === 'ar' ? 'حتى' : 'Until'}: {formatDate(offer.validUntil)}</>}
                    </span>
                  </div>}

                  <span className="inline-flex items-center flex-shrink-0 text-gold-600 dark:text-gold-400 font-bold text-xs uppercase tracking-wider">
                    {t('btn_view_details')}
                    {dir === 'ltr' ? (
                      <ArrowRight className="ml-2 w-4 h-4" />
                    ) : (
                      <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
};

export default OffersPage;
