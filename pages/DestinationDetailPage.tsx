import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { Destination, TourPackage } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, MapPin, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, dir, language } = useLanguage();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [relatedDestinations, setRelatedDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [data, allDestinations, allTours] = await Promise.all([
          api.getDestinationById(id),
          api.getDestinations(),
          api.getTourPackages(id),
        ]);
        setDestination(data || null);
        setRelatedDestinations(allDestinations.filter(d => d.id !== id).slice(0, 3));
        setTours(allTours);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  if (!destination) return <div className="min-h-screen pt-32 text-center text-slate-900 dark:text-white">{t('destination_not_found')}</div>;

  const displayName = destination.name[language];
  const displayRegion = destination.region ? destination.region[language] : '';

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO
        title={destination.seo_title || displayName}
        description={destination.seo_description || destination.desc[language]}
        image={destination.image}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[
              { label: t('nav_destinations'), path: '/destinations' },
              { label: displayName }
            ]}
        title={displayName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="animate-fade-in">
              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                <ImageWithFallback src={destination.image} className="w-full h-80 object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{t('destination_overview')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                {destination.longDesc && destination.longDesc[language] ? destination.longDesc[language] : destination.desc[language]}
              </p>

              {destination.highlights && destination.highlights.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('destination_highlights')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="w-6 h-6 text-gold-500 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {destination.gallery && destination.gallery.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('destination_gallery')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-md h-64 hover:shadow-xl transition-shadow cursor-pointer">
                      <ImageWithFallback src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('destination_tours')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {tours.length > 0 ? `${tours.length}` : '0'}
              </p>
              <Link
                to="/tours"
                state={{ destinationId: destination.id }}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center rounded-xl shadow-lg transition-all flex justify-center items-center hover:scale-105"
              >
                {t('view_tours_cta')}
              </Link>
              <a
                href={`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  language === 'ar'
                    ? `مرحبًا، أريد الاستفسار عن البرامج السياحية في ${displayName}`
                    : `Hello, I would like to inquire about tourism programs in ${displayName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-center rounded-xl shadow-lg transition-all flex justify-center items-center hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('btn_book_whatsapp')}
              </a>
            </div>
          </div>
        </div>

        {/* Tour Packages for this destination */}
        <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('destination_tours')}</h2>
          {tours.length === 0 ? (
            <div className="text-center py-12 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">{t('destination_no_tours')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tours.map(tour => (
                <Link key={tour.id} to={`/tours/${tour.id}`} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback src={tour.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">{tour.title[language]}</h3>
                    {(tour.durationDays || tour.durationNights) && (
                      <div className="flex items-center text-xs text-slate-400 mb-3">
                        <Clock className="w-3.5 h-3.5 mr-1 rtl:ml-1" />
                        {tour.durationDays ? `${tour.durationDays} ${t('days_label')}` : ''}
                        {tour.durationNights ? ` / ${tour.durationNights} ${t('nights_label')}` : ''}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gold-500 font-medium">
                      {t('service_btn_learn')} <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Related Destinations */}
        {relatedDestinations.length > 0 && (
          <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t('related_destinations')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedDestinations.map(rel => (
                <Link key={rel.id} to={`/destinations/${rel.id}`} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <ImageWithFallback src={rel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-gold-500 transition-colors">{rel.name[language]}</h3>
                    <div className="flex items-center text-sm text-gold-500 font-medium">
                      {t('service_btn_learn')} <ArrowRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180" />
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

export default DestinationDetailPage;
