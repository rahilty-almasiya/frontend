import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { api, transformImage } from '../services/api';
import { Flight } from '../types';
import { PlaneTakeoff, PlaneLanding, Search, ShoppingCart, Phone } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const formatDateTime = (value: string, language: 'en' | 'ar') => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [cabinClass, setCabinClass] = useState<'economy' | 'business'>('economy');
  const [quantity, setQuantity] = useState(1);

  const unitPrice = cabinClass === 'business' && flight.priceBusiness ? flight.priceBusiness : flight.priceEconomy;
  const seatsRemaining = flight.seatsRemaining ?? flight.seatsAvailable;

  const handleAddToCart = () => {
    if (seatsRemaining < quantity) {
      toast.error(language === 'ar' ? 'لا يوجد عدد مقاعد كافٍ' : 'Not enough seats available');
      return;
    }

    if (t('payment_gateway_enabled') !== 'true') {
      const message = language === 'ar'
        ? `مرحبًا، أريد حجز رحلة طيران عبر واتساب:\nشركة الطيران: ${flight.airline.ar}\nرقم الرحلة: ${flight.flightNumber}\nالمسار: ${flight.origin.ar} ← ${flight.destination.ar}\nالدرجة: ${cabinClass === 'business' ? 'رجال أعمال' : 'اقتصادية'}\nعدد المقاعد: ${quantity}\nالإجمالي التقديري: ${unitPrice * quantity} ريال`
        : `Hello, I would like to book a flight via WhatsApp:\nAirline: ${flight.airline.en}\nFlight: ${flight.flightNumber}\nRoute: ${flight.origin.en} → ${flight.destination.en}\nClass: ${cabinClass}\nSeats: ${quantity}\nEstimated total: ${unitPrice * quantity} SAR`;
      window.open(`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    addItem({
      type: 'flight',
      id: flight.id,
      name: `${flight.airline[language]} ${flight.flightNumber} — ${flight.origin[language]} → ${flight.destination[language]}`,
      image: flight.image,
      quantity,
      cabin_class: cabinClass,
      unitPrice,
      estimatedTotal: unitPrice * quantity,
    });

    toast.success(language === 'ar' ? 'تمت الإضافة إلى السلة' : 'Added to cart');
    navigate('/checkout');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{flight.airline[language]}</h4>
          <span className="text-xs text-slate-500 font-mono">{flight.flightNumber}</span>
        </div>
        <div className="text-gold-500 font-bold text-lg">
          {unitPrice} <span className="text-xs font-normal text-slate-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="w-4 h-4 text-gold-500" />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{flight.origin[language]}</div>
            <div className="text-xs text-slate-500">{formatDateTime(flight.departureAt, language)}</div>
          </div>
        </div>
        <div className="flex-1 mx-4 border-t border-dashed border-slate-300 dark:border-slate-700"></div>
        <div className="flex items-center gap-2">
          <div className="text-right rtl:text-left">
            <div className="font-bold text-slate-900 dark:text-white">{flight.destination[language]}</div>
            <div className="text-xs text-slate-500">{formatDateTime(flight.arrivalAt, language)}</div>
          </div>
          <PlaneLanding className="w-4 h-4 text-gold-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs text-slate-500 mb-1">{language === 'ar' ? 'الدرجة' : 'Class'}</label>
          <select
            value={cabinClass}
            onChange={e => setCabinClass(e.target.value as 'economy' | 'business')}
            className="w-full px-2 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
          >
            <option value="economy">{language === 'ar' ? 'اقتصادية' : 'Economy'}</option>
            {flight.priceBusiness ? (
              <option value="business">{language === 'ar' ? 'رجال أعمال' : 'Business'}</option>
            ) : null}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">{language === 'ar' ? 'عدد المقاعد' : 'Seats'}</label>
          <input
            type="number" min={1} max={Math.max(1, seatsRemaining)} value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
          />
        </div>
        <div className="text-xs text-slate-500 col-span-1">
          {seatsRemaining} {language === 'ar' ? 'مقعد متاح' : 'seats left'}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={seatsRemaining < 1}
          className={`flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all px-2 py-2 ${
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
    </div>
  );
};

const FlightsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origin: '', destination: '', date: '' });

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await api.getFlights({
        origin: filters.origin || undefined,
        destination: filters.destination || undefined,
        date: filters.date || undefined,
      });
      setFlights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFlights();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={language === 'ar' ? 'تذاكر الطيران' : 'Flights'}
        description={language === 'ar' ? 'ابحث واحجز تذاكر الطيران' : 'Search and book flight tickets'}
      />

      <PageHero
        breadcrumbItems={[{ label: language === 'ar' ? 'الطيران' : 'Flights' }]}
        title={language === 'ar' ? 'تذاكر الطيران' : 'Flights'}
        subtitle={language === 'ar' ? 'ابحث عن أفضل رحلات الطيران' : 'Find the best flight for your trip'}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text" placeholder={language === 'ar' ? 'مدينة المغادرة' : 'From'}
            value={filters.origin} onChange={e => setFilters({ ...filters, origin: e.target.value })}
            className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
          />
          <input
            type="text" placeholder={language === 'ar' ? 'مدينة الوصول' : 'To'}
            value={filters.destination} onChange={e => setFilters({ ...filters, destination: e.target.value })}
            className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
          />
          <input
            type="date"
            value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })}
            className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
          />
          <button type="submit" className="flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-lg transition-colors">
            <Search className="w-4 h-4" />
            {language === 'ar' ? 'بحث' : 'Search'}
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-full h-40 rounded-2xl" />)
        ) : flights.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <PlaneTakeoff className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500">{language === 'ar' ? 'لا توجد رحلات مطابقة' : 'No matching flights found'}</p>
          </div>
        ) : (
          flights.map(flight => <FlightCard key={flight.id} flight={flight} />)
        )}
      </div>
    </div>
  );
};

export default FlightsPage;
