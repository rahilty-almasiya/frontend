
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { XCircle, RefreshCcw, Headset } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const PaymentError: React.FC = () => {
    const { t } = useLanguage();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const errorMessage = query.get('message');

    return (
        <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-2xl mx-auto">
                <ScrollReveal animation="fade-up" className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl text-center border border-slate-100 dark:border-slate-800">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <XCircle className="w-12 h-12" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('pay_error_title') || 'Payment Unsuccessful'}
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {t('pay_error_desc') || 'We could not process your payment. Please ensure your card details are correct or try a different payment method.'}
                    </p>

                    {errorMessage && (
                        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium italic">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Link
                            to="/booking"
                            className="flex items-center justify-center w-full px-8 py-4 bg-gold-600 text-white rounded-xl font-bold hover:bg-gold-700 transition-all shadow-lg shadow-gold-500/30"
                        >
                            <RefreshCcw className="w-5 h-5 mr-2 rtl:ml-2" />
                            {t('pay_try_again') || 'Try Booking Again'}
                        </Link>

                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm text-slate-500 pt-4">
                            <span>{t('help_needed') || 'Need help?'}</span>
                            <Link to="/contact" className="text-gold-500 hover:underline font-bold flex items-center">
                                <Headset className="w-4 h-4 mr-1 rtl:ml-1" />
                                {t('contact_support') || 'Contact Support'}
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default PaymentError;
