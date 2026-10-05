import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import PageHero from '../components/PageHero';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiv2.rahilatialmasiya.com/public/api';

export default function CmsPage() {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const [page, setPage] = useState<any>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    axios.get(`${API_BASE_URL}/pages/${encodeURIComponent(slug)}`).then(r => setPage(r.data)).catch(() => setMissing(true));
  }, [slug]);
  if (missing) return <div className="min-h-screen pt-32 text-center">Page not found</div>;
  if (!page) return <div className="min-h-screen pt-32 text-center">Loading...</div>;
  const title = page[`title_${language}`] || page.title_en;
  const content = page[`content_${language}`] || page.content_en || '';
  return <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-950">
    <SEO title={page[`seo_title_${language}`] || title} description={page[`seo_description_${language}`] || ''} />
    <PageHero title={title} breadcrumbItems={[{ label: title }]} />
    <article className="prose prose-slate dark:prose-invert max-w-4xl mx-auto px-4" dangerouslySetInnerHTML={{ __html: content }} />
  </div>;
}
