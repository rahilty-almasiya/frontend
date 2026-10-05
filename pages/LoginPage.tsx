import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from '../components/PhoneInput';
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, KeyRound, Eye, EyeOff, Tag } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'verify';

const LoginPage: React.FC = () => {
  const { language, dir } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '', otp: '', promo_code: '' });
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const isAr = language === 'ar';
  
  const text = isAr ? {
    welcomeBack: 'مرحباً بعودتك',
    loginSubtitle: 'الرفاهية في التنقل تبدأ من هنا',
    createAccount: 'إنشاء حساب جديد',
    registerSubtitle: 'انضم إلينا واختبر تجربة تنقل استثنائية',
    verifyAccount: 'تأكيد البريد الإلكتروني',
    verifySubtitle: 'لقد أرسلنا رمز التحقق إلى بريدك الإلكتروني',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    otp: 'رمز التحقق (OTP)',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginBtn: 'تسجيل الدخول',
    registerBtn: 'إنشاء الحساب',
    verifyBtn: 'تحقق من الرمز',
    resendBtn: 'إعادة إرسال الرمز',
    processing: 'جاري المعالجة...',
    noAccount: 'ليس لديك حساب؟',
    haveAccount: 'لديك حساب بالفعل؟',
    signUp: 'سجل الآن',
    logIn: 'دخول',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    registerSuccess: 'تم إنشاء الحساب، يرجى تفعيل البريد الإلكتروني',
    verifySuccess: 'تم تفعيل الحساب وتسجيل الدخول بنجاح',
    passMissMatch: 'كلمات المرور غير متطابقة',
    authFailed: 'فشلت عملية المصادقة'
  } : {
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Luxury transportation starts here',
    createAccount: 'Create New Account',
    registerSubtitle: 'Join us for an exceptional travel experience',
    verifyAccount: 'Verify Email',
    verifySubtitle: 'We have sent a verification code to your email',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    otp: 'Verification Code (OTP)',
    forgotPassword: 'Forgot Password?',
    loginBtn: 'Sign In',
    registerBtn: 'Sign Up',
    verifyBtn: 'Verify Code',
    resendBtn: 'Resend Code',
    processing: 'Processing...',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    signUp: 'Create one',
    logIn: 'Log in here',
    loginSuccess: 'Logged in successfully',
    registerSuccess: 'Account created, please verify your email',
    verifySuccess: 'Account verified and logged in successfully',
    passMissMatch: 'Passwords do not match',
    authFailed: 'Authentication failed'
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      await api.resendVerificationOtp(formData.email);
      toast.success(isAr ? 'تم إعادة إرسال الرمز' : 'OTP Resent');
      setResendTimer(30);
    } catch(err: any) {
      toast.error(err.response?.data?.message || text.authFailed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'verify') {
        const response = await api.verifyEmail({ email: formData.email, otp: formData.otp });
        login(response.token, response.user);
        toast.success(text.verifySuccess);
        navigate('/profile');
      } else if (mode === 'login') {
        const response = await api.loginCustomer({ email: formData.email, password: formData.password });
        // If login returns requires_verification instead
        if (response.requires_verification) {
          setMode('verify');
          toast.info(response.message);
        } else {
          login(response.token, response.user);
          toast.success(text.loginSuccess);
          navigate('/profile');
        }
      } else {
        if (formData.password !== formData.password_confirmation) {
          toast.error(text.passMissMatch);
          setLoading(false);
          return;
        }
        const response = await api.registerCustomer(formData);
        if (response.requires_verification) {
          setMode('verify');
          setResendTimer(30);
          if (response.mail_failed) {
             toast.error(isAr ? 'تم إنشاء الحساب ولكن فشل إرسال رمز التفعيل. يرجى المحاولة لاحقاً.' : 'Account created but failed to send OTP.');
          } else {
             toast.success(text.registerSuccess);
          }
        } else {
          login(response.token, response.user);
          toast.success(text.loginSuccess);
          navigate('/profile');
        }
      }
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.requires_verification) {
        setMode('verify');
        setResendTimer(30);
        setFormData(prev => ({ ...prev, email: error.response.data.email || formData.email }));
        if (error.response.data.mail_failed) {
          toast.error(isAr ? 'حسابك يحتاج تفعيل، لكن فشل خادم البريد في إرسال الرمز.' : 'Account needs verification, but failed to send OTP.');
        } else {
          toast.info(isAr ? 'يرجى إدخال رمز التحقق المرسل لبريدك الإلكتروني.' : 'Please enter the verification code sent to your email.');
        }
      } else {
        toast.error(error.response?.data?.message || text.authFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-700">
        
        {/* Abstract/Image Section */}
        <div className="md:w-5/12 hidden md:block relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="/assets/fleet-header.jpg" alt="Luxury Transport" className="w-full h-full object-cover" />
             {/* Gradient overlay to ensure text is perfectly readable while keeping the image visible */}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10" />
          </div>
          
          <div className="relative z-20 h-full flex flex-col justify-end p-10 text-white">
            <h1 className="text-4xl font-bold mb-4 text-gold-500">رحلتي الماسية</h1>
            <p className="text-lg text-slate-300 font-light mb-8 max-w-sm">
              {isAr ? 'نقدم لك تجربة نقل فاخرة ومريحة، مصممة لتلبية تطلعاتك بأعلى معايير الجودة والأمان.' : 'We provide a luxurious and comfortable transportation experience, tailored to meet your expectations with the highest standards.'}
            </p>
            <div className="w-16 h-1 bg-gold-500 rounded-full mb-4"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-7/12 p-8 sm:p-12 relative flex flex-col justify-center bg-white dark:bg-slate-800">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-start">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                {mode === 'verify' ? text.verifyAccount : (mode === 'login' ? text.welcomeBack : text.createAccount)}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {mode === 'verify' ? text.verifySubtitle : (mode === 'login' ? text.loginSubtitle : text.registerSubtitle)}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'verify' && (
                <div className="relative group">
                  <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
                    <KeyRound size={20} />
                  </div>
                  <input required type="text" placeholder={text.otp} dir="ltr"
                    className={`w-full ${isAr ? 'pr-12 pl-4 text-center tracking-[0.5em]' : 'pl-12 pr-4 text-center tracking-[0.5em]'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-bold text-lg`}
                    value={formData.otp} onChange={e => setFormData({ ...formData, otp: e.target.value })} />
                </div>
              )}

              {mode === 'register' && (
                <>
                  <div className="relative group">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
                      <User size={20} />
                    </div>
                    <input required type="text" placeholder={text.name}
                      className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
                      value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  <div className="relative group">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors z-20`}>
                      <Phone size={20} />
                    </div>
                    <PhoneInput 
                      value={formData.phone} 
                      onChange={(val) => setFormData({ ...formData, phone: val })} 
                      isAr={isAr} 
                      placeholder={text.phone} 
                    />
                  </div>

                  <div className="relative group">
                    <div className={`absolute inset-y-0 ${isAr ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-slate-400 group-focus-within:text-gold-500 transition-colors`}>
                      <Tag size={20} />
                    </div>
                    <input type="text" placeholder={isAr ? 'كود الخصم (اختياري)' : 'Promo Code (Optional)'}
                      className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all`}
                      value={formData.promo_code} onChange={e => setFormData({ ...formData, promo_code: e.target.value })} />
                  </div>
                </>
              )}

              {mode !== 'verify' && (
                <>
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
                </>
              )}

              {mode === 'register' && (
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
              )}

              {mode === 'login' && (
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm font-medium text-gold-600 hover:text-gold-500 transition-colors">
                    {text.forgotPassword}
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 py-3.5 px-4 rounded-xl relative overflow-hidden group bg-gold-600 text-white font-bold hover:bg-gold-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
              >
                {loading ? text.processing : (mode === 'verify' ? text.verifyBtn : (mode === 'login' ? text.loginBtn : text.registerBtn))}
                {!loading && (isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />)}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
              {mode === 'verify' ? (
                 <button 
                  onClick={handleResendOtp} 
                  disabled={resendTimer > 0}
                  className={`font-bold transition-all duration-300 ${resendTimer > 0 ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'text-gold-600 dark:text-gold-500 hover:underline'}`} 
                  type="button"
                 >
                    {resendTimer > 0 
                      ? (isAr ? `إعادة الإرسال بعد (${resendTimer}ث)` : `Resend code in (${resendTimer}s)`)
                      : text.resendBtn}
                 </button>
              ) : (
                <>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {mode === 'login' ? text.noAccount : text.haveAccount}
                  </span>
                  <button 
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFormData({name: '', email: '', phone: '', password: '', password_confirmation: '', otp: '', promo_code: ''}); }} 
                    className="mx-2 text-gold-600 dark:text-gold-500 font-bold hover:underline"
                    type="button"
                  >
                    {mode === 'login' ? text.signUp : text.logIn}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
