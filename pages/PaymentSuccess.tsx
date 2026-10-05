import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { CheckCircle, ArrowRight, Calendar, Hash, MapPin, Receipt, Car, User, Download } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { t, language } = useLanguage();
    const bookingId = searchParams.get('booking_id');
    const orderId = searchParams.get('order_id');
    const [booking, setBooking] = useState<any>(null);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPayingRemaining, setIsPayingRemaining] = useState(false);

    const handlePayRemaining = async () => {
        if (!order) return;
        setIsPayingRemaining(true);
        try {
            const paymentResponse = await api.initiateOrderPayment(order.id);
            if (paymentResponse.payment_url) {
                window.location.href = paymentResponse.payment_url;
                return;
            }
        } catch (error) {
            console.error('Failed to initiate remaining payment', error);
        } finally {
            setIsPayingRemaining(false);
        }
    };

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                if (orderId) {
                    const data = await api.getOrderReceipt(orderId);
                    setOrder(data);
                } else if (bookingId) {
                    const data = await api.getBookingReceipt(bookingId);
                    setBooking(data);
                }
            } catch (error) {
                console.error("Failed to fetch receipt", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReceipt();
    }, [bookingId, orderId]);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-3xl mx-auto">
                <ScrollReveal animation="fade-up" className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">

                    {/* Header */}
                    <div className="bg-emerald-500 p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce backdrop-blur-sm">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {t('pay_success_title') || 'Payment Received!'}
                        </h1>
                        <p className="text-emerald-100 text-lg">
                            {t('pay_success_desc') || 'Your booking has been confirmed successfully.'}
                        </p>
                    </div>

                    <div className="p-8 md:p-12">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-10 h-10 border-4 border-slate-200 border-t-gold-500 rounded-full animate-spin"></div>
                            </div>
                        ) : order ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('wa_booking_id')}</p>
                                                <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{order.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Receipt className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('transaction_id') || 'Transaction ID'}</p>
                                                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">{order.transaction_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 md:border-l md:border-r-0 rtl:md:border-r rtl:md:border-l-0 md:border-slate-200 md:dark:border-slate-700 md:pl-6 rtl:md:pr-6">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('label_name')}</p>
                                                <p className="font-medium text-slate-900 dark:text-white">{order.first_name} {order.last_name}</p>
                                                <p className="text-sm text-slate-500">{order.email}</p>
                                                <p className="text-sm text-slate-500 ltr:font-mono">{order.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{language === 'ar' ? 'العناصر' : 'Items'}</p>
                                    {(order.items || []).map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
                                            <span className="text-slate-700 dark:text-slate-300">
                                                {item.itemable?.name_en || item.itemable?.title_en || item.itemable_type}
                                                {item.start_date ? ` (${item.start_date} → ${item.end_date})` : ''}
                                            </span>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white">{item.total_price} SAR</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t-2 border-slate-100 dark:border-slate-800 pt-6 mt-6 flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{t('booking_total')}</span>
                                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {order.total_price} <span className="text-base font-normal text-slate-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                                    </span>
                                </div>

                                {order.payment_status === 'partial' && (
                                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-6 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">{language === 'ar' ? 'المدفوع' : 'Paid'}</span>
                                            <span className="font-bold text-emerald-600">{order.amount_paid} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-300">{language === 'ar' ? 'المتبقي' : 'Remaining'}</span>
                                            <span className="font-bold text-amber-600">{(order.total_price - order.amount_paid).toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                        </div>
                                        <button
                                            onClick={handlePayRemaining}
                                            disabled={isPayingRemaining}
                                            className={`w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all ${isPayingRemaining ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isPayingRemaining
                                                ? (language === 'ar' ? 'جاري التحويل...' : 'Redirecting...')
                                                : (language === 'ar' ? 'ادفع المتبقي الآن' : 'Pay Remaining Balance')}
                                        </button>
                                    </div>
                                )}

                                <div className="text-center">
                                    <button onClick={() => window.print()} className="inline-flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium">
                                        <Download className="w-4 h-4 mr-2 rtl:ml-2" />
                                        {t('download_receipt') || 'Print / Download Receipt'}
                                    </button>
                                </div>
                            </div>
                        ) : booking ? (
                            <div className="space-y-8">
                                {/* Invoice Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('wa_booking_id')}</p>
                                                <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{booking.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('label_date')}</p>
                                                <p className="font-medium text-slate-900 dark:text-white">{booking.pickup_date} {booking.pickup_time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Receipt className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('transaction_id') || 'Transaction ID'}</p>
                                                <p className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">{booking.transaction_id || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:border-l md:border-r-0 rtl:md:border-r rtl:md:border-l-0 md:border-slate-200 md:dark:border-slate-700 md:pl-6 rtl:md:pr-6">
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('label_name')}</p>
                                                <p className="font-medium text-slate-900 dark:text-white">{booking.first_name} {booking.last_name}</p>
                                                <p className="text-sm text-slate-500">{booking.email}</p>
                                                <p className="text-sm text-slate-500 ltr:font-mono">{booking.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                            <Car className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('label_car')}</p>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {language === 'ar' ? booking.car?.name_ar : booking.car?.name_en}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-700 mx-2"></div>
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    </div>
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="w-1/2 pr-2 rtl:pl-2">
                                            <p className="text-xs text-slate-500 mb-1">{t('label_pickup')}</p>
                                            <p className="font-medium dark:text-white">{booking.pickup_location}</p>
                                        </div>
                                        <div className="w-1/2 pl-2 rtl:pr-2 text-right rtl:text-left">
                                            <p className="text-xs text-slate-500 mb-1">{t('label_dropoff')}</p>
                                            <p className="font-medium dark:text-white">{booking.dropoff_location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-t-2 border-slate-100 dark:border-slate-800 pt-6 mt-6 flex justify-between items-center">
                                    <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{t('booking_total')}</span>
                                    <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {booking.total_price} <span className="text-base font-normal text-slate-500">{language === 'ar' ? 'ريال' : 'SAR'}</span>
                                    </span>
                                </div>
                                <div className="text-center">
                                    <button onClick={() => window.print()} className="inline-flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium">
                                        <Download className="w-4 h-4 mr-2 rtl:ml-2" />
                                        {t('download_receipt') || 'Print / Download Receipt'}
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <p className="text-center text-slate-500">Booking details not found.</p>
                        )}

                        {/* Actions */}
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                to="/"
                                className="flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white transition-all shadow-lg"
                            >
                                {t('nav_home')}
                            </Link>
                            <Link
                                to="/fleet"
                                className="flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md group"
                            >
                                {t('cta_secondary')}
                                <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default PaymentSuccess;
