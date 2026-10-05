import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Trash2, ShoppingCart, Check } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';

const CheckoutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { items, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();
  const paymentEnabled = t('payment_gateway_enabled') === 'true';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
    paymentMethod: 'online',
    paymentPlan: 'full' as 'full' | 'deposit',
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

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

  useEffect(() => {
    if (paymentEnabled) {
      api.getPaymentMethods().then(setPaymentMethods).catch(() => {});
    } else {
      setPaymentMethods([]);
    }
  }, [paymentEnabled]);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidatingCode(true);
    try {
      const response = await api.validatePromoCode(promoCode);
      if (response.valid) {
        const data = response.data;
        const discount = data.discount_type === 'percentage'
          ? (total * data.discount_value) / 100
          : Number(data.discount_value);
        setAppliedDiscount(discount);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error(language === 'ar' ? 'السلة فارغة' : 'Your cart is empty');
      return;
    }

    if (!paymentEnabled) {
      const itemLines = items.map((item, index) => {
        const dates = item.start_date && item.end_date ? ` | ${item.start_date} → ${item.end_date}` : '';
        return `${index + 1}. ${item.name} × ${item.quantity}${dates} | ${item.estimatedTotal} SAR`;
      }).join('\n');
      const message = language === 'ar'
        ? `مرحبًا، أريد تأكيد الحجز عبر واتساب:\n\n${itemLines}\n\nالإجمالي: ${Math.max(0, total - appliedDiscount)} ريال\nالاسم: ${formData.name}\nالهاتف: ${formData.phone}\nالبريد: ${formData.email}${formData.notes ? `\nملاحظات: ${formData.notes}` : ''}`
        : `Hello, I would like to confirm this booking via WhatsApp:\n\n${itemLines}\n\nTotal: ${Math.max(0, total - appliedDiscount)} SAR\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`;
      const isCarOnlyBooking = items.every(item => item.type === 'car');
      const whatsappKey = isCarOnlyBooking ? 'contact_whatsapp' : 'contact_tourism_whatsapp';
      window.open(`https://wa.me/${t(whatsappKey)?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      toast.success(language === 'ar' ? 'تم تجهيز طلبك وإرساله إلى واتساب' : 'Your booking request is ready in WhatsApp');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.createOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
        promo_code: promoCode || undefined,
        payment_method: formData.paymentMethod,
        payment_plan: formData.paymentPlan,
        items,
      });
      const orderId = response.order.id;

      if (formData.paymentMethod === 'online') {
        const paymentResponse = await api.initiateOrderPayment(orderId, selectedPaymentMethod || undefined);
        if (paymentResponse.payment_url) {
          clearCart();
          window.location.href = paymentResponse.payment_url;
          return;
        }
      }

      clearCart();
      toast.success(language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Your order has been submitted!');
      navigate('/');
    } catch (error: any) {
      console.error('Order submission failed', error);
      toast.error(error.response?.data?.message || (language === 'ar' ? 'حدث خطأ أثناء إرسال الطلب' : 'Error submitting order'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalTotal = Math.max(0, total - appliedDiscount);

  return (
    <div className="min-h-screen pt-24 pb-12 relative z-10">
      <SEO
        title={language === 'ar' ? 'السلة والدفع' : 'Cart & Checkout'}
        description={language === 'ar' ? 'أكمل حجزك' : 'Complete your booking'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs items={[{ label: language === 'ar' ? 'السلة' : 'Cart' }]} className="mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10">
          {language === 'ar' ? 'السلة والدفع' : 'Cart & Checkout'}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <ShoppingCart className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 mb-6">{language === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
            <Link to="/hotels" className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white font-bold rounded-xl transition-colors">
              {language === 'ar' ? 'تصفح الفنادق' : 'Browse Hotels'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.cartId} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  {item.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback src={item.image} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    {item.start_date && item.end_date && (
                      <p className="text-xs text-slate-500">{item.start_date} → {item.end_date}</p>
                    )}
                    <p className="text-sm text-gold-500 font-bold mt-1">{item.estimatedTotal} {language === 'ar' ? 'ريال' : 'SAR'}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 mt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{language === 'ar' ? 'بيانات التواصل' : 'Contact Details'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required type="text" placeholder={language === 'ar' ? 'الاسم الثلاثي' : 'Full Name'}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <input required type="tel" placeholder="05xxxxxxxx"
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <input required type="email" placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <textarea placeholder={language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none dark:text-white"
                  rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />

                {paymentEnabled && paymentMethods.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_payment_method')}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
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
                          <img src={method.ImageUrl} alt="" className="h-8 object-contain mb-1" />
                          {selectedPaymentMethod === method.PaymentMethodId && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center text-white text-[10px]">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paymentEnabled && <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {language === 'ar' ? 'خطة الدفع' : 'Payment Plan'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentPlan: 'full' })}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.paymentPlan === 'full'
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold-300'
                        }`}
                    >
                      {language === 'ar' ? 'دفع كامل' : 'Pay in Full'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentPlan: 'deposit' })}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.paymentPlan === 'deposit'
                        ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 text-gold-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold-300'
                        }`}
                    >
                      {language === 'ar' ? 'دفع عربون' : 'Pay Deposit'}
                    </button>
                  </div>
                  {formData.paymentPlan === 'deposit' && (
                    <p className="text-xs text-slate-500 mt-2">
                      {language === 'ar'
                        ? 'هيتم تحصيل نسبة من الإجمالي كعربون الآن، والباقي لاحقًا.'
                        : 'A percentage of the total will be charged now as a deposit; the rest is due later.'}
                    </p>
                  )}
                </div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-lg shadow-lg transition-all ${
                    paymentEnabled
                      ? 'bg-gold-600 hover:bg-gold-700'
                      : 'bg-[#25D366] hover:bg-[#1ebe5d] shadow-[#25D366]/25'
                  } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    paymentEnabled
                      ? (language === 'ar' ? 'الدفع الآن' : 'Pay Now')
                      : (language === 'ar' ? 'إتمام الحجز عبر واتساب' : 'Complete via WhatsApp')
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900/90 backdrop-blur-md text-white p-8 rounded-2xl sticky top-28 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-gold-400">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>

                <div className="space-y-3 text-sm mb-6">
                  {items.map(item => (
                    <div key={item.cartId} className="flex justify-between">
                      <span className="text-slate-300 truncate max-w-[60%]">{item.name}</span>
                      <span className="text-slate-300">{item.estimatedTotal} SAR</span>
                    </div>
                  ))}
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

                <div className="pt-6 mt-6 border-t border-slate-800">
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-emerald-400">{language === 'ar' ? 'الخصم المطبق' : 'Applied Discount'}</span>
                      <span className="text-emerald-400 font-bold">-{appliedDiscount} SAR</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs">{t('booking_total')}</span>
                    <span className="text-2xl font-bold text-white leading-none">
                      {finalTotal} <span className="text-xs font-normal text-slate-400">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
