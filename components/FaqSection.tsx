import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Faq } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import Skeleton from './Skeleton';

const FaqSection: React.FC = () => {
    const { t, language } = useLanguage();
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<string | null>(null);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await api.getFaqs();
                // Sort by order
                const sorted = data.sort((a, b) => a.order - b.order);
                setFaqs(sorted);
            } catch (error) {
                console.error('Failed to fetch FAQs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);

    const toggleFaq = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    if (!loading && faqs.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <ScrollReveal className="text-center mb-16" animation="fade-up">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('faq_title') || 'Frequently Asked Questions'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                        {t('faq_subtitle') || 'Find answers to common questions about our services'}
                    </p>
                    <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
                </ScrollReveal>

                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                                <Skeleton className="w-3/4 h-6 mb-4" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-1/2 h-4 mt-2" />
                            </div>
                        ))
                    ) : (
                        faqs.map((faq, index) => (
                            <ScrollReveal
                                key={faq.id}
                                delay={`${index * 100}ms`}
                                animation="fade-up"
                            >
                                <div
                                    className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden transition-all duration-300 border ${openId === faq.id ? 'border-gold-500 shadow-lg shadow-gold-500/10' : 'border-transparent shadow-sm hover:shadow-md'}`}
                                >
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-start focus:outline-none"
                                        aria-expanded={openId === faq.id}
                                    >
                                        <span className={`text-lg font-semibold ${openId === faq.id ? 'text-gold-500' : 'text-slate-900 dark:text-white'}`}>
                                            {faq.question[language]}
                                        </span>
                                        <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${openId === faq.id ? 'transform rotate-180 text-gold-500' : 'text-slate-400'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </span>
                                    </button>

                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 mt-2">
                                            {faq.answer[language]}
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
