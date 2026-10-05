import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
    const { t, dir } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            <SEO title="404 - Not Found" description="The page you are looking for does not exist." noIndex />

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-400 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full text-center relative z-10">
                <div className="mb-8">
                    <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 animate-pulse">404</h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            {t('error_404_title') || 'Page Not Found'}
                        </div>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
                    {t('error_404_desc') || "The page you're looking for doesn't exist or has been moved."}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center space-x-2 rtl:space-x-reverse px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl shadow-lg shadow-gold-500/30 transition-all hover:scale-105"
                >
                    {dir === 'ltr' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    <span>{t('nav_home')}</span>
                    <Home className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
