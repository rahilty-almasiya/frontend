import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api, transformImage } from '../services/api';
import { Hotel, HotelRoom } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { MapPin, Star, Users, ShoppingCart, Phone } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import ReviewsSection from '../components/ReviewsSection';
import PageHero from '../components/PageHero';
import NotFound from './NotFound';

const nightsBetween = (start: string, end: string) => {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const RoomCard: React.FC<{ room: HotelRoom; hotelName: string; hotelImage: string }> = ({ room, hotelName, hotelImage }) => {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [quote, setQuote] = useState<{ total_price: number; has_seasonal_pricing: boolean } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const nights = nightsBetween(startDate, endDate);
  // Fall back to the flat rate for display until the real (seasonal-aware) quote loads.
  const total = quote?.total_price ?? (nights * room.pricePerNight);

  useEffect(() => {
    if (!startDate || !endDate || nightsBetween(startDate, endDate) < 1) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    setQuoteLoading(true);
    api.getRoomPriceQuote(room.id, startDate, endDate)
      .then(res => { if (!cancelled) setQuote(res); })
      .catch(() => { if (!cancelled) setQuote(null); })
      .finally(() => { if (!cancelled) setQuoteLoading(false); });
    return () => { cancelled = true; };
  }, [room.id, startDate, endDate]);

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      toast.error(language === 'ar' ? 'اختر تاريخ الوصول والمغادرة' : 'Please select check-in and check-out dates');
      return;
    }
    if (nights < 1) {
      toast.error(language === 'ar' ? 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول' : 'Check-out must be after check-in');
      return;
    }
    if (quoteLoading) {
      toast.error(language === 'ar' ? 'جاري حساب السعر، حاول بعد ثانية' : 'Price is still loading, try again in a second');
      return;
    }

    if (t('payment_gateway_enabled') !== 'true') {
      const message = language === 'ar'
        ? `مرحبًا، أريد حجز غرفة عبر واتساب:\nالفندق: ${hotelName}\nالغرفة: ${room.name.ar}\nالوصول: ${startDate}\nالمغادرة: ${endDate}\nعدد الضيوف: ${guests}\nالإجمالي التقديري: ${total} ريال`
        : `Hello, I would like to book a room via WhatsApp:\nHotel: ${hotelName}\nRoom: ${room.name.en}\nCheck-in: ${startDate}\nCheck-out: ${endDate}\nGuests: ${guests}\nEstimated total: ${total} SAR`;
      window.open(`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    addItem({
      type: 'hotel_room',
      id: room.id,
      name: `${hotelName} - ${room.name[language]}`,
      image: room.image || hotelImage,
      start_date: startDate,
      end_date: endDate,
      quantity: 1,
      guests_count: guests,
      unitPrice: quote ? Math.round((quote.total_price / nights) * 100) / 100 : room.pricePerNight,
      estimatedTotal: total,
    });

    toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart');
    navigate('/checkout');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="h-48 md:h-full">
          <ImageWithFallback src={room.image || hotelImage} className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{room.name[language]}</h4>
            <div className="text-gold-500 font-bold text-lg">
              {room.pricePerNight} <span className="text-xs font-normal text-slate-500">{language === 'ar' ? 'ريال / ليلة' : 'SAR / night'}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{room.desc?.[language]}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users className="w-4 h-4" />
            {room.capacityAdults} {language === 'ar' ? 'بالغين' : 'adults'}
            {room.capacityChildren ? `, ${room.capacityChildren} ${language === 'ar' ? 'أطفال' : 'children'}` : ''}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{language === 'ar' ? 'وصول' : 'Check-in'}</label>
              <input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{language === 'ar' ? 'مغادرة' : 'Check-out'}</label>
              <input type="date" min={startDate || today} value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full px-2 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{language === 'ar' ? 'الضيوف' : 'Guests'}</label>
              <input type="number" min={1} value={guests} onChange={e => setGuests(Number(e.target.value))}
                className="w-full px-2 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white" />
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1 text-white text-xs font-bold rounded-lg transition-all px-2 ${
                t('payment_gateway_enabled') === 'true'
                  ? 'bg-gold-600 hover:bg-gold-700'
                  : 'bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg shadow-[#25D366]/25'
              }`}
            >
              {t('payment_gateway_enabled') === 'true' ? <ShoppingCart className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              {t('payment_gateway_enabled') === 'true'
                ? (language === 'ar' ? 'أضف للسلة' : 'Add')
                : (language === 'ar' ? 'احجز عبر واتساب' : 'Book via WhatsApp')}
            </button>
          </div>
          {nights > 0 && (
            <div className="text-xs text-slate-500">
              {quoteLoading ? (
                language === 'ar' ? 'جاري حساب السعر...' : 'Calculating price...'
              ) : (
                <>
                  {nights} {language === 'ar' ? 'ليالي' : 'nights'} = <span className="font-bold text-slate-900 dark:text-white">{total} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                  {quote?.has_seasonal_pricing && (
                    <span className="ml-2 rtl:ml-0 rtl:mr-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-bold">
                      {language === 'ar' ? 'سعر موسمي' : 'Seasonal rate'}
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let cancelled = false;
    const fetchHotel = async (isRetry = false) => {
      if (!id) return;
      if (!isRetry) { setLoading(true); setNotFound(false); }
      let willRetry = false;
      try {
        const data = await api.getHotelById(id);
        if (cancelled) return;
        if (!data) {
          setHotel(null);
          setNotFound(true);
          return;
        }
        setHotel(data);
      } catch (error: any) {
        console.error(error);
        if (cancelled) return;
        // A real 404 from the API means the hotel is genuinely gone — index that as not-found.
        // Any other failure (network hiccup, timeout, CORS) is transient: retry once instead of
        // rendering <NotFound noIndex>, so a brief fetch error never gets a real page noindexed.
        if (error?.response?.status === 404) {
          setNotFound(true);
        } else if (!isRetry) {
          willRetry = true;
          setTimeout(() => fetchHotel(true), 1500);
        }
      } finally {
        if (!cancelled && !willRetry) setLoading(false);
      }
    };
    fetchHotel();
    return () => { cancelled = true; };
  }, [id]);

  // Old numeric-id URLs (e.g. /hotels/12) should canonicalize to the slug URL.
  const isNumericParam = !!id && /^\d+$/.test(id);
  const shouldRedirectToSlug = !loading && !notFound && hotel && isNumericParam && hotel.slug && hotel.slug !== id;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="w-48 h-6 mb-8" />
          <Skeleton className="w-full h-[400px] rounded-3xl mb-12" />
          <Skeleton className="w-full h-40 mb-4" />
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    );
  }

  if (shouldRedirectToSlug) {
    return <Navigate to={`/hotels/${hotel!.slug}`} replace />;
  }

  if (notFound || !hotel) return <NotFound />;

  const displayName = hotel.name[language];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO title={displayName} description={hotel.desc?.[language]} image={hotel.image} />

      <PageHero
        breadcrumbItems={[
          { label: language === 'ar' ? 'الفنادق' : 'Hotels', path: '/hotels' },
          ...(hotel.destination ? [{
            label: hotel.destination.name[language],
            path: `/hotels/category/${hotel.destination.slug || hotel.destination.id}`,
          }] : []),
          { label: displayName },
        ]}
        title={displayName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{language === 'ar' ? 'عن الفندق' : 'About the Hotel'}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {hotel.longDesc?.[language] || hotel.desc?.[language]}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{language === 'ar' ? 'الغرف المتاحة' : 'Available Rooms'}</h3>
          <div className="space-y-6">
            {hotel.rooms && hotel.rooms.length > 0 ? (
              hotel.rooms.map(room => <RoomCard key={room.id} room={room} hotelName={displayName} hotelImage={hotel.image} />)
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
                {language === 'ar' ? 'لا توجد غرف متاحة حالياً' : 'No rooms available yet'}
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 mb-2">{t('car_need_help')}</p>
          <a href={`tel:${t('contact_tourism_phone')?.replace(/\s+/g, '')}`} className="inline-flex items-center justify-center text-slate-900 dark:text-white font-bold hover:text-gold-500 transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            {t('contact_tourism_phone')}
          </a>
        </div>

        <ReviewsSection reviewableType="hotel" reviewableId={hotel.id} />
      </div>
    </div>
  );
};

export default HotelDetailPage;
