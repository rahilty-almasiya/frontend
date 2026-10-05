import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { language, dir } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isAr = language === 'ar';

  useEffect(() => {
    // Auto fill email if navigated from Forgot Password page
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location]);

  const text = isAr ? {
    title: 'تغيير كلمة المرور',
    subtitle: 'أدخل الرمز المرسل إلى بريدك الإلكتروني مع كلمة المرور الجديدة.',
    email: 'البريد الإلكتروني',
    otp: 'رمز التحقق (OTP)',
    password: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور',
    submitBtn: 'حفظ كلمة المرور',
    processing: 'جاري الحفظ...',
    backToLogin: 'العودة لتسجيل الدخول',
    success: 'تم تغيير كلمة المرور بنجاح',
    passMissMatch: 'كلمات المرور غير متطابقة',
    error: 'رمز غير صالح أو منتهي الصلاحية'
  } : {
    title: 'Reset Password',
    subtitle: 'Enter the OTP sent to your email along with your new password.',
    email: 'Email Address',
    otp: 'Verification Code (OTP)',
    password: 'New Password',
    confirmPassword: 'Confirm Password',
    submitBtn: 'Reset Password',
    processing: 'Processing...',
    backToLogin: 'Back to Login',
    success: 'Password reset successfully',
    passMissMatch: 'Passwords do not match',
    error: 'Invalid or expired OTP'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error(text.passMissMatch);
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(formData);
      toast.success(text.success);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || text.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-600">
            <KeyRound className="text-gold-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{text.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
              <Mail size={20} />
            </div>
            <input required type="email" placeholder={text.email} dir="ltr"
              className={`w-full ${isAr ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="relative group">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
              <KeyRound size={20} />
            </div>
            <input required type="text" placeholder={text.otp} dir="ltr"
              className={`w-full ${isAr ? 'pr-12 pl-4 text-center tracking-[0.5em]' : 'pl-12 pr-4 tracking-[0.5em] text-center'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-bold text-lg`}
              value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} />
          </div>

          <div className="relative group">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
              <Lock size={20} />
            </div>
            <input required type={showPassword ? 'text' : 'password'} minLength={8} placeholder={text.password} dir="ltr"
              className={`w-full ${isAr ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 ${isAr ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-slate-400 hover:text-gold-500 transition-colors focus:outline-none`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative group">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
              <Lock size={20} />
            </div>
            <input required type={showConfirmPassword ? 'text' : 'password'} minLength={8} placeholder={text.confirmPassword} dir="ltr"
              className={`w-full ${isAr ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
              value={formData.password_confirmation} onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute inset-y-0 ${isAr ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-slate-400 hover:text-gold-500 transition-colors focus:outline-none`}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3.5 px-4 rounded-xl relative overflow-hidden group bg-gold-600 text-white font-bold hover:bg-gold-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
          >
            {loading ? text.processing : text.submitBtn}
            {!loading && (isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
            {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {text.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
