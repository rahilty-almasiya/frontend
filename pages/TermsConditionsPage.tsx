
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api, transformImage } from '../services/api';
import Loader from '../components/Loader';
import { ClipboardList } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

interface PageData {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
}

const TermsConditionsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await api.getPageBySlug('terms-conditions');
        setData(response);
      } catch (error) {
        console.error("Failed to fetch terms and conditions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-bold">{t('error_page_not_found') || 'Page Not Found'}</h1>
      </div>
    );
  }

  const title = language === 'ar' ? data.title_ar : data.title_en;
  const content = language === 'ar' ? data.content_ar : data.content_en;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-24">
      <SEO
        title={title}
        description={t('terms_subtitle') || title}
      />

      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: title }]}
        title={title}
        subtitle={t('terms_subtitle') || t('hero_subtitle')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none 
              prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:mb-6
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
              prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center p-8 rounded-xl bg-slate-100 dark:bg-slate-800/50">
          <p className="text-xs text-slate-400 italic">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

      </div>
    </div>
  );
};

export default TermsConditionsPage;
