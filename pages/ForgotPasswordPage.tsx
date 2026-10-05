import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { language, dir } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAr = language === 'ar';
  
  const text = isAr ? {
    title: 'استعادة كلمة المرور',
    subtitle: 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق (OTP) لإعادة تعيين كلمة مرورك.',
    email: 'البريد الإلكتروني المربع بحسابك',
    sendBtn: 'إرسال الرمز',
    processing: 'جاري الإرسال...',
    backToLogin: 'العودة لتسجيل الدخول',
    success: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
    error: 'فشل في إرسال الرمز. يرجى التحقق من البريد الإلكتروني.'
  } : {
    title: 'Forgot Password',
    subtitle: 'Enter your email address and we will send you an OTP to reset your password.',
    email: 'Registered Email Address',
    sendBtn: 'Send OTP',
    processing: 'Sending...',
    backToLogin: 'Back to Login',
    success: 'OTP sent successfully to your email',
    error: 'Failed to send OTP. Please check your email.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      toast.success(text.success);
      // Pass email to the reset password page via state so they don't have to type it again
      navigate('/reset-password', { state: { email } });
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
            <Mail className="text-gold-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{text.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text.subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
              <Mail size={20} />
            </div>
            <input required type="email" placeholder={text.email} dir="ltr"
              className={`w-full ${isAr ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl bg-gold-600 text-white font-bold hover:bg-gold-700 transition-all duration-300 shadow-md hover:shadow-lg ${loading ? 'opacity-80 cursor-wait' : ''}`}
          >
            {loading ? text.processing : text.sendBtn}
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

export default ForgotPasswordPage;
