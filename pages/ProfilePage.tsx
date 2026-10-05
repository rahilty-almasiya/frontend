import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  LogOut, 
  Calendar, 
  User as UserIcon, 
  Shield, 
  Camera, 
  Check, 
  Lock, 
  Clock,
  ChevronRight,
  History,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../context/LanguageContext';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import { transformImage } from '../services/api';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const ProfilePage: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language, translations } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'security'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'history'>('upcoming');

  // Form states
  const [isUpdating, setIsUpdating] = useState(false);
  const [passData, setPassData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      api.getCustomerBookings()
        .then(res => { setBookings(res); setLoading(false); })
        .catch(() => setLoading(false));
      api.getCustomerOrders()
        .then(res => { setOrders(res); setOrdersLoading(false); })
        .catch(() => setOrdersLoading(false));
    }
  }, [user]);

  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrderId(orderId);
    try {
      await api.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      toast.success(language === 'ar' ? 'تم إلغاء الطلب' : 'Order cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message || (language === 'ar' ? 'تعذر إلغاء الطلب' : 'Could not cancel order'));
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
    </div>
  );

  const handleLogout = () => {
    logout();
    toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح 👋' : 'Logged out successfully 👋');
    navigate('/');
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('avatar', file);

    try {
      setIsUpdating(true);
      await api.updateCustomerProfile(formData);
      toast.success(language === 'ar' ? 'تم تحديث الصورة الشخصية' : 'Profile picture updated');
      window.location.reload(); // Refresh to get new user data from context
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل تحديث الصورة' : 'Failed to update image');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.password !== passData.password_confirmation) {
      toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    try {
      setIsUpdating(true);
      await api.updateCustomerPassword(passData);
      toast.success(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      setPassData({ current_password: '', password: '', password_confirmation: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || (language === 'ar' ? 'فشل تغيير كلمة المرور' : 'Failed to change password'));
    } finally {
      setIsUpdating(false);
    }
  };

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status));
  const historyBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors pb-20 pt-24">
      <SEO
        title={t('حسابي', 'My Profile')}
        description={t('إدارة حسابك وحجوزاتك', 'Manage your account and bookings')}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: t('حسابي', 'My Profile') }]}
        title={t('حسابي', 'My Profile')}
        subtitle={t('أهلاً بك مجدداً ، ', 'Welcome back, ') + user.name.split(' ')[0]}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">

        
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-gold-600 to-amber-500 opacity-10"></div>
            
            <div className="relative inline-block mb-6 group select-none">
              <div 
                className={`w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100 cursor-pointer ${isUpdating ? 'opacity-50' : 'hover:scale-105 transition-transform duration-300'}`}
                onClick={handleAvatarClick}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gold-50 text-gold-600">
                    <UserIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-1 right-1 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 hover:text-gold-600 transition group-hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <h2 className="text-2xl font-bold dark:text-white mb-1">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.email}</p>

            <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'bookings' ? 'bg-gold-50 text-gold-600 dark:bg-gold-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <span className="flex items-center gap-3 font-medium">
                  <Calendar className="w-5 h-5" />
                  {t('حجوزاتي', 'My Bookings')}
                </span>
                <ChevronRight className={`w-4 h-4 transition ${activeTab === 'bookings' && (language === 'ar' ? 'rotate-180' : '')}`} />
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-gold-50 text-gold-600 dark:bg-gold-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <span className="flex items-center gap-3 font-medium">
                  <ShoppingBag className="w-5 h-5" />
                  {t('طلباتي', 'My Orders')}
                </span>
                <ChevronRight className={`w-4 h-4 transition ${activeTab === 'orders' && (language === 'ar' ? 'rotate-180' : '')}`} />
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === 'security' ? 'bg-gold-50 text-gold-600 dark:bg-gold-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <span className="flex items-center gap-3 font-medium">
                  <Shield className="w-5 h-5" />
                  {t('الأمان', 'Security')}
                </span>
                <ChevronRight className={`w-4 h-4 transition ${activeTab === 'security' && (language === 'ar' ? 'rotate-180' : '')}`} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{t('تسجيل الخروج', 'Logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8">
          {activeTab === 'bookings' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-800 min-h-[600px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-gold-600" />
                  {t('إدارة الحجوزات', 'Manage Bookings')}
                </h3>
                
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setBookingFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${bookingFilter === 'upcoming' ? 'bg-white dark:bg-slate-700 text-gold-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t('القادمة', 'Upcoming')}
                  </button>
                  <button 
                    onClick={() => setBookingFilter('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${bookingFilter === 'history' ? 'bg-white dark:bg-slate-700 text-gold-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t('السابقة', 'History')}
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-600"></div>
                  <p className="text-slate-400">{t('جاري تحميل الحجوزات...', 'Loading bookings...')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(bookingFilter === 'upcoming' ? upcomingBookings : historyBookings).length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <div className="bg-white dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        {bookingFilter === 'upcoming' ? <Clock className="w-8 h-8 text-slate-300" /> : <History className="w-8 h-8 text-slate-300" />}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {bookingFilter === 'upcoming' 
                          ? t('لا توجد حجوزات قادمة حالياً', 'No upcoming bookings found.')
                          : t('سجل الحجوزات فارغ', 'Your booking history is empty.')}
                      </p>
                    </div>
                  ) : (
                    (bookingFilter === 'upcoming' ? upcomingBookings : historyBookings).map((b) => (
                      <div 
                        key={b.id} 
                        className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-gold-300 dark:hover:border-gold-700/50 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0">
                              <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                              <div className="font-bold dark:text-white text-lg group-hover:text-gold-600 transition-colors">
                                {language === 'ar' ? (b.car?.name_ar || b.car?.name_en || 'مركبة') : (b.car?.name_en || 'Vehicle')}
                              </div>
                              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                                <span className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  {b.pickup_date} | {b.pickup_time}
                                </span>
                                <span className="text-sm text-slate-400 flex items-center gap-1.5">
                                  ID: #{b.id}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50 dark:border-slate-800">
                            <div className="text-left sm:text-right">
                              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t('إجمالي المبلغ', 'Total Price')}</div>
                              <div className="text-xl font-black text-gold-600">{b.total_price} <span className="text-xs uppercase">SAR</span></div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm border ${
                              b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              b.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              b.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {language === 'ar' ? (
                                b.status === 'confirmed' ? 'مؤكد' :
                                b.status === 'completed' ? 'مكتمل' :
                                b.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'
                              ) : b.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'orders' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-800 min-h-[600px]">
              <h3 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-gold-600" />
                {t('طلباتي', 'My Orders')}
              </h3>

              {ordersLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-600"></div>
                  <p className="text-slate-400">{t('جاري تحميل الطلبات...', 'Loading orders...')}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="bg-white dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {t('لا توجد طلبات حتى الآن', 'No orders yet.')}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:border-gold-300 dark:hover:border-gold-700/50 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="font-bold dark:text-white text-lg group-hover:text-gold-600 transition-colors">
                              {o.items?.length || 0} {t('عنصر', 'item(s)')}
                            </div>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
                              <span className="text-sm text-slate-400">ID: #{o.id}</span>
                              {o.payment_status === 'partial' && (
                                <span className="text-xs text-amber-600 font-bold">
                                  {t('عربون', 'Deposit')}: {o.amount_paid}/{o.total_price} SAR
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50 dark:border-slate-800">
                          <div className="text-left sm:text-right">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{t('إجمالي المبلغ', 'Total Price')}</div>
                            <div className="text-xl font-black text-gold-600">{o.total_price} <span className="text-xs uppercase">SAR</span></div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm border ${
                            o.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            o.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            o.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {language === 'ar' ? (
                              o.status === 'confirmed' ? 'مؤكد' :
                              o.status === 'completed' ? 'مكتمل' :
                              o.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'
                            ) : o.status}
                          </div>
                          {!['cancelled', 'completed'].includes(o.status) && (
                            <button
                              onClick={() => handleCancelOrder(o.id)}
                              disabled={cancellingOrderId === o.id}
                              className="text-[10px] font-bold text-red-500 hover:text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancellingOrderId === o.id
                                ? (language === 'ar' ? 'جاري الإلغاء...' : 'Cancelling...')
                                : (language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 border border-slate-100 dark:border-slate-800 min-h-[600px]">
              <h3 className="text-2xl font-bold dark:text-white mb-8 flex items-center gap-3">
                <Lock className="w-6 h-6 text-gold-600" />
                {t('تغيير كلمة المرور', 'Change Password')}
              </h3>
              
              <div className="bg-amber-50 dark:bg-gold-500/5 p-4 rounded-2xl flex gap-4 mb-8 border border-amber-100 dark:border-gold-500/10">
                <AlertCircle className="w-5 h-5 text-gold-600 flex-shrink-0" />
                <p className="text-sm text-gold-700 dark:text-gold-500 leading-relaxed font-medium">
                  {t(
                    'تأكد من اختيار كلمة مرور قوية تحتوي على أحرف وأرقام لحماية حسابك.',
                    'Make sure to choose a strong password with letters and numbers to protect your account.'
                  )}
                </p>
              </div>

              <form onSubmit={handlePassChange} className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">{t('كلمة المرور الحالية', 'Current Password')}</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-600 transition-colors" />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-gold-500 transition-all font-mono"
                      value={passData.current_password}
                      onChange={e => setPassData({...passData, current_password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">{t('كلمة المرور الجديدة', 'New Password')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-600 transition-colors" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-gold-500 transition-all font-mono"
                        value={passData.password}
                        onChange={e => setPassData({...passData, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 px-1">{t('تأكيد كلمة المرور', 'Confirm New Password')}</label>
                    <div className="relative group">
                      <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gold-600 transition-colors" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-gold-500 transition-all font-mono"
                        value={passData.password_confirmation}
                        onChange={e => setPassData({...passData, password_confirmation: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full bg-slate-900 dark:bg-gold-600 hover:bg-black dark:hover:bg-gold-700 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-gold-500/20 transition-all disabled:opacity-50 tracking-widest uppercase"
                  >
                    {isUpdating ? t('جاري التحديث...', 'Updating...') : t('تحديث كلمة المرور', 'Update Password')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
