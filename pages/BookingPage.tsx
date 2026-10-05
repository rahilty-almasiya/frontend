import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Car, Service } from '../types';
import { Calendar, MapPin, Clock, MessageCircle, Check } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageWithFallback from '../components/ImageWithFallback';
import { transformImage } from '../services/api';
import PageHero from '../components/PageHero';

const BookingPage: React.FC = () => {
  const { t, language, translations } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const preSelectedCarId = location.state?.carId;

  const [fleet, setFleet] = useState<Car[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    pickup: location.state?.pickup || '',
    dropoff: location.state?.dropoff || '',
    date: '',
    time: '',
    return_date: '',
    return_time: '',
    carId: preSelectedCarId || '',
    serviceId: location.state?.serviceId || '',
    service_type: location.state?.serviceId ? 'special_service' : 'daily',
    notes: location.state?.notes || '',
    fixedPrice: location.state?.fixedPrice || 0,
    with_driver: true,
    paymentMethod: 'online'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [sameAsPickup, setSameAsPickup] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidatingCode(true);
    try {
      const response = await api.validatePromoCode(promoCode);
      if (response.valid) {
        const data = response.data;
        let discount = 0;
        if (data.discount_type === 'percentage') {
          discount = (estimatedPrice * data.discount_value) / 100;
        } else {
          discount = Number(data.discount_value);
        }
        setAppliedDiscount(discount);
        setFormData(prev => ({ ...prev, promo_code: promoCode }));
        toast.success(language === 'ar' ? 'تم تطبيق الخصم!' : 'Discount applied!');
      } else {
         toast.error(language === 'ar' ? 'كود غير صالح' : 'Invalid code');
         setAppliedDiscount(0);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || (language === 'ar' ? 'كود غير صالح' : 'Invalid code'));
      setAppliedDiscount(0);
    } finally {
      setIsValidatingCode(false);
    }
  };

  useEffect(() => {
    if (sameAsPickup) {
      setFormData(prev => ({ ...prev, dropoff: prev.pickup }));
    }
  }, [formData.pickup, sameAsPickup]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cars, services] = await Promise.all([
          api.getFleet(),
          api.getServices()
        ]);
        setFleet(cars);
        setAllServices(services);
        
        // Auto-select first car if nothing pre-selected
        if (!formData.carId && !formData.serviceId && cars.length > 0) {
          setFormData(prev => ({ ...prev, carId: cars[0].id }));
        }
      } catch (error) {
        console.error("Failed to load data for booking", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Payment Methods
    const fetchMethods = async () => {
      const methods = await api.getPaymentMethods();
      setPaymentMethods(methods);
    };

    fetchData();
    fetchMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync user data if it changes or loads later
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Real-time price calculation
  useEffect(() => {
    const currentCar = fleet.find(c => c.id === formData.carId);
    const currentService = allServices.find(s => s.id === formData.serviceId);

    if (!currentCar && !currentService) {
      setEstimatedPrice(0);
      return;
    }

    if (currentService) {
      setEstimatedPrice(currentService.price || 0);
      return;
    }

    if (!currentCar) return;

    if (formData.fixedPrice > 0) {
      setEstimatedPrice(formData.fixedPrice);
      return;
    }
 
    let days = 1;
    if (formData.date && formData.return_date) {
      const start = new Date(formData.date);
      const end = new Date(formData.return_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (days < 1) days = 1;
    }

    const carPrice = currentCar.pricePerDay || 0;
    const driverCost = currentCar.driver_price
      ? Number(currentCar.driver_price)
      : (Number(translations['driver_fee_per_day']?.en) || 150);

    const driverFee = formData.with_driver ? driverCost : 0;

    setEstimatedPrice((carPrice * days) + (driverFee * days));
  }, [formData.carId, formData.serviceId, formData.date, formData.return_date, formData.with_driver, formData.fixedPrice, fleet, allServices, translations]);

  // Sync state if navigation occurs with new carId or route info
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        carId: location.state.carId || prev.carId,
        serviceId: location.state.serviceId || prev.serviceId,
        service_type: location.state.serviceId ? 'special_service' : prev.service_type,
        pickup: location.state.pickup || prev.pickup,
        dropoff: location.state.dropoff || prev.dropoff,
        fixedPrice: location.state.fixedPrice || prev.fixedPrice,
      }));
    }
  }, [location.state]);

  const getDisplayName = (carOrName: Car | string | undefined) => {
    if (!carOrName) return '';
    // If passed Car instance
    if (typeof carOrName !== 'string' && (carOrName as Car).name) {
      const c = carOrName as Car;
      if (typeof c.name === 'string') return c.name;
      return language === 'ar' ? c.name.ar : c.name.en;
    }
    // If passed name value (string | translations)
    const val = carOrName as string | any;
    if (typeof val === 'string') return val;
    return language === 'ar' ? val.ar : val.en;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentCar = fleet.find(c => c.id === formData.carId);
    const currentService = allServices.find(s => s.id === formData.serviceId);
    const selectedItemName = currentService 
      ? (language === 'ar' ? (currentService.title?.ar || currentService.titleKey) : (currentService.title?.en || currentService.titleKey))
      : (currentCar ? getDisplayName(currentCar) : 'N/A');

    try {
      const response = await api.createBooking(formData);
      const bookingId = response.data.booking.id;

      if (formData.paymentMethod === 'online') {
        const paymentResponse = await api.initiatePayment(bookingId, selectedPaymentMethod || undefined);
        if (paymentResponse.payment_url) {
          window.location.href = paymentResponse.payment_url;
          return;
        }
      }

      // WhatsApp message
      const msg = language === 'ar'
        ? `${t('wa_booking_intro')}\n\n` +
        `👤 ${t('wa_name')}: ${formData.name}\n` +
        `☎️ ${t('wa_phone')}: ${formData.phone}\n` +
        `📧 ${t('wa_email')}: ${formData.email}\n` +
        `🔖 ${currentService ? 'الخدمة' : t('wa_car')}: ${selectedItemName}\n` +
        `📅 ${t('wa_date')}: ${formData.date}\n` +
        `🕒 ${t('wa_time')}: ${formData.time}\n` +
        `📍 ${t('wa_pickup')}: ${formData.pickup}\n` +
        `🏁 ${t('wa_dropoff')}: ${formData.dropoff}\n` +
        `💰 ${language === 'ar' ? 'السعر' : 'Price'}: ${estimatedPrice} ${language === 'ar' ? 'ريال' : 'SAR'}\n` +
        `✅ ${t('wa_booking_id')}: ${bookingId}`
        : `${t('wa_booking_intro')}\n\n` +
        `👤 ${t('wa_name')}: ${formData.name}\n` +
        `☎️ ${t('wa_phone')}: ${formData.phone}\n` +
        `📧 ${t('wa_email')}: ${formData.email}\n` +
        `🔖 ${currentService ? 'Service' : t('wa_car')}: ${selectedItemName}\n` +
        `📅 ${t('wa_date')}: ${formData.date}\n` +
        `🕒 ${t('wa_time')}: ${formData.time}\n` +
        `📍 ${t('wa_pickup')}: ${formData.pickup}\n` +
        `🏁 ${t('wa_dropoff')}: ${formData.dropoff}\n` +
        `💰 Price: ${estimatedPrice} SAR\n` +
        `✅ Booking ID: ${bookingId}`;

      const whatsappUrl = `https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      toast.success(language === "ar" ? "تم إرسال طلبك بنجاح!" : "Your booking request has been submitted!");
    } catch (error) {
      console.error("Booking submission failed", error);
      toast.error(language === "ar" ? "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة عبر واتساب." : "Error submitting booking, please try WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCar = fleet.find(c => c.id === formData.carId);
  const selectedService = allServices.find(s => s.id === formData.serviceId);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[600px] rounded-2xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={t('nav_book')}
        description={t('hero_subtitle')}
      />
      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_book') }]}
        title={t('booking_title')}
        subtitle={t('hero_subtitle')}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_name')}</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                    value={formData.name} placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full Name'} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_phone')}</label>
                  <input required type="tel" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                    value={formData.phone} placeholder="05xxxxxxxx" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_email')}</label>
                <input required type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                  value={formData.email} placeholder="name@example.com" onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_pickup')}</label>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input required type="text" className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                      value={formData.pickup} placeholder={language === 'ar' ? 'مثال: مطار الملك خالد، الصالة 5' : 'Ex: King Khalid Airport, Terminal 5'} onChange={e => setFormData({ ...formData, pickup: e.target.value })} />
                  </div>
                </div>
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('label_dropoff')}</label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={sameAsPickup} onChange={e => setSameAsPickup(e.target.checked)} className="rounded text-gold-500 focus:ring-gold-500 w-4 h-4" />
                      <span className="text-xs text-slate-500">{t('same_as_pickup')}</span>
                    </label>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input required={!sameAsPickup} disabled={sameAsPickup} type="text" className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white ${sameAsPickup ? 'opacity-70 cursor-not-allowed' : ''}`}
                      value={formData.dropoff} placeholder={language === 'ar' ? 'مثال: فندق الريتز كارلتون' : 'Ex: Ritz Carlton Hotel'} onChange={e => setFormData({ ...formData, dropoff: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_date')}</label>
                  <div className="relative">
                    <Calendar className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                      value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_time')}</label>
                  <div className="relative">
                    <Clock className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input required type="time" className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                      value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_return_date')}</label>
                  <div className="relative">
                    <Calendar className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input type="date" className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                      value={formData.return_date} onChange={e => setFormData({ ...formData, return_date: e.target.value })} />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_return_time')}</label>
                  <div className="relative">
                    <Clock className="absolute top-3 left-3 w-5 h-5 text-slate-400" />
                    <input type="time" className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                      value={formData.return_time} onChange={e => setFormData({ ...formData, return_time: e.target.value })} />
                  </div>
                </div>
              </div>

              {!selectedService && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_car')}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {fleet.map(car => {
                      const name = getDisplayName(car);
                      return (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, carId: car.id })}
                          className={`relative rounded-xl border-2 p-2 transition-all ${formData.carId === car.id
                            ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-gold-300'
                            }`}
                        >
                          <img src={car.image} alt={name} className="w-full h-16 object-cover rounded-lg mb-2" />
                          <div className="text-xs font-semibold text-center dark:text-white truncate">{name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedService && (
                <div className="p-4 rounded-xl border-2 border-gold-500 bg-gold-50 dark:bg-gold-900/10">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('selected_service') || (language === 'ar' ? 'الخدمة المختارة' : 'Selected Service')}</label>
                  <div className="flex items-center gap-4">
                    <img src={selectedService.image} alt={language === 'ar' ? selectedService.title?.ar : selectedService.title?.en} className="w-24 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? selectedService.title?.ar : selectedService.title?.en}
                      </h4>
                      <p className="text-amber-600 font-bold">
                        {selectedService.price} SAR
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {t('payment_gateway_enabled') === 'true' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_payment_method')}</label>

                  {/* Dynamic Payment Methods Grid */}
                  {paymentMethods.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.PaymentMethodId}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(method.PaymentMethodId)}
                          className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center bg-white dark:bg-slate-800 ${selectedPaymentMethod === method.PaymentMethodId
                            ? 'border-gold-500 shadow-md ring-2 ring-gold-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-gold-300'
                            }`}
                        >
                          <img src={method.ImageUrl} alt={language === 'ar' ? method.PaymentMethodAr : method.PaymentMethodEn} className="h-8 object-contain mb-1" />
                          <span className="text-[10px] text-center font-medium dark:text-slate-300 truncate w-full">{language === 'ar' ? method.PaymentMethodAr : method.PaymentMethodEn}</span>
                          {selectedPaymentMethod === method.PaymentMethodId && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center text-white text-[10px]">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border-2 border-gold-500 bg-gold-50 dark:bg-gold-900/20">
                      {/* Fallback Static if API fails */}
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left rtl:text-right">
                          <div className="font-bold dark:text-white">{t('pay_online_title')}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{t('pay_online_desc')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true' && (
                <div className="p-4 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-900/10">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-left rtl:text-right">
                      <div className="font-bold text-green-700 dark:text-green-400">{language === 'ar' ? 'احجز عبر واتساب' : 'Book via WhatsApp'}</div>
                      <div className="text-xs text-green-600 dark:text-green-500">{language === 'ar' ? 'سيتم تأكيد السعر بعد التواصل معك' : 'Price will be confirmed after contact'}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                  t('payment_gateway_enabled') === 'true'
                    ? 'bg-gold-600 hover:bg-gold-700 shadow-gold-500/30'
                    : 'bg-[#25D366] hover:bg-[#1ebc57] shadow-[#25D366]/30'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {t('payment_gateway_enabled') === 'true' ? (
                      <>
                        <Clock className="w-5 h-5" />
                        <span>{t('btn_pay_now')}</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        <span>{t('btn_book_whatsapp') || (language === 'ar' ? 'احجز عبر واتساب' : 'Book via WhatsApp')}</span>
                      </>
                    )}
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-2xl sticky top-28 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gold-400">{t('booking_summary')}</h3>

              {selectedService ? (
                 <div className="mb-6">
                   <img src={selectedService.image} alt={language === 'ar' ? selectedService.title?.ar : selectedService.title?.en} className="w-full h-40 object-cover rounded-lg mb-4" />
                   <div className="text-lg font-bold">{language === 'ar' ? selectedService.title?.ar : selectedService.title?.en}</div>
                   <div className="text-sm text-slate-400">
                     {t('nav_services')}
                   </div>
                 </div>
              ) : selectedCar ? (
                <div className="mb-6">
                  <img src={selectedCar.image} alt={getDisplayName(selectedCar)} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <div className="text-lg font-bold">{getDisplayName(selectedCar)}</div>
                  <div className="text-sm text-slate-400">
                    {typeof selectedCar.category === 'string'
                      ? selectedCar.category
                      : (language === 'ar' ? selectedCar.category?.name_ar : selectedCar.category?.name_en)}
                  </div>
                </div>
              ) : (
                <div className="mb-6 text-slate-400">{t('booking_select')}</div>
              )}

              <div className="space-y-4 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-300 font-medium">{t('label_with_driver')}</span>
                  <input
                    type="checkbox"
                    checked={formData.with_driver}
                    onChange={e => setFormData({ ...formData, with_driver: e.target.checked })}
                    className="w-5 h-5 accent-gold-500 rounded"
                  />
                </div>

                {t('payment_gateway_enabled') === 'true' && (
                  <>
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t('booking_estimation')}</span>
                        <span className="text-gold-400 font-bold">
                          {estimatedPrice} {language === 'ar' ? 'ريال' : 'SAR'}
                        </span>
                      </div>
                      {!selectedService && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">{t('car_daily_rate')}</span>
                          <span className="text-slate-300">
                            {selectedCar?.pricePerDay} {language === 'ar' ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                      )}
                      {selectedService && (
                         <div className="flex justify-between text-[11px]">
                           <span className="text-slate-500">{language === 'ar' ? 'سعر الخدمة' : 'Service Price'}</span>
                           <span className="text-slate-300">
                             {selectedService.price} {language === 'ar' ? 'ريال' : 'SAR'}
                           </span>
                         </div>
                      )}
                      {formData.with_driver && !selectedService && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">{t('booking_driver_included')}</span>
                          <span className="text-slate-300">
                            {selectedCar?.driver_price ? Number(selectedCar.driver_price) : (Number(translations['driver_fee_per_day']?.en) || 150)} {language === 'ar' ? 'ريال' : 'SAR'} / {t('booking_per_day')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <label className="block text-xs text-slate-400 mb-2">{language === 'ar' ? 'كود الخصم' : 'Promo Code'}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-gold-500"
                          value={promoCode}
                          onChange={e => setPromoCode(e.target.value.toUpperCase())}
                          placeholder={language === 'ar' ? 'أدخل الكود' : 'Enter code'}
                        />
                        <button
                          type="button"
                          disabled={isValidatingCode || !promoCode}
                          onClick={handleApplyPromo}
                          className="h-9 px-4 bg-gold-600 hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-colors font-bold"
                        >
                          {isValidatingCode ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            language === 'ar' ? 'تطبيق' : 'Apply'
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-emerald-400">{language === 'ar' ? 'الخصم المطبق' : 'Applied Discount'}</span>
                          <span className="text-emerald-400 font-bold">
                            -{appliedDiscount} {language === 'ar' ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-end">
                        <span className="text-slate-400 text-xs">{t('booking_total')}</span>
                        <span className="text-2xl font-bold text-white leading-none">
                          {Math.max(0, estimatedPrice - appliedDiscount)} <span className="text-xs font-normal text-slate-400">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2 italic">* {t('booking_contact_rates')}</p>
                    </div>
                  </>
                )}

                {t('payment_gateway_enabled') !== 'true' && t('whatsapp_payment_enabled') === 'true' && (
                  <div className="pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-xs text-green-300 text-center font-medium">
                        {language === 'ar' 
                          ? 'سيتم تأكيد السعر من قبل فريق العمل بعد استقبال طلبك عبر واتساب'
                          : 'Your price will be confirmed by our team via WhatsApp after submitting your request'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;
