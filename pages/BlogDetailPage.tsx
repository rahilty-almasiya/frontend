
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, transformImage } from '../services/api';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, Clock, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/Skeleton';
import SEO from '../components/SEO';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import PageHero from '../components/PageHero';
import NotFound from './NotFound';

const BlogDetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { t, dir, language } = useLanguage();
   const [post, setPost] = useState<BlogPost | null>(null);
   const [loading, setLoading] = useState(true);

   // Function to decode HTML entities
   const decodeHtmlEntities = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
   };

   const [notFound, setNotFound] = useState(false);

   useEffect(() => {
      let cancelled = false;
      const fetchData = async (isRetry = false) => {
         if (!id) return;
         if (!isRetry) { setLoading(true); setNotFound(false); }
         let willRetry = false;
         try {
            const data = await api.getBlogPostById(id);
            if (cancelled) return;
            if (!data) {
               setPost(null);
               setNotFound(true);
            } else {
               setPost(data);
            }
         } catch (error: any) {
            console.error(error);
            if (cancelled) return;
            // Only a real 404 means the post is gone; other failures (network/timeout) are
            // transient and shouldn't render <NotFound noIndex> for a page that actually exists.
            if (error?.response?.status === 404) {
               setNotFound(true);
            } else if (!isRetry) {
               willRetry = true;
               setTimeout(() => fetchData(true), 1500);
            }
         } finally {
            if (!cancelled && !willRetry) setLoading(false);
         }
      };
      fetchData();
      return () => { cancelled = true; };
   }, [id]);

   if (loading) {
      return (
         <div className="min-h-screen pt-32 pb-12 bg-slate-50 dark:bg-slate-950 px-4">
            <div className="max-w-3xl mx-auto">
               <Skeleton className="w-32 h-6 mb-6" />
               <Skeleton className="w-3/4 h-12 mb-4" />
               <Skeleton className="w-1/2 h-6 mb-8" />
               <Skeleton className="w-full h-[400px] rounded-2xl mb-12" />
               <div className="space-y-4">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
               </div>
            </div>
         </div>
      );
   }

   if (notFound || !post) return <NotFound />;

   // Content Renderer Engine
   const renderContent = () => {
      if (!post.content) {
         const rawExcerpt = (post.excerpt ? post.excerpt[language] : t(post.excerptKey)).replace(/&nbsp;/g, ' ').replace(new RegExp(" ", 'g'), ' ');
         return <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed rich-text max-w-none" dir={language === 'ar' ? 'rtl' : 'ltr'}>{parse(rawExcerpt)}</div>;
      }

      // Handle Rich Text (HTML)
      if (typeof post.content === 'object' && post.content !== null && 'en' in post.content) {
         const htmlContent = post.content[language] || '';
         // If empty content, fallback to excerpt
         if (!htmlContent.trim()) {
            const rawExcerpt = (post.excerpt ? post.excerpt[language] : t(post.excerptKey)).replace(/&nbsp;/g, ' ').replace(new RegExp(" ", 'g'), ' ');
            return <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed rich-text max-w-none" dir={language === 'ar' ? 'rtl' : 'ltr'}>{parse(rawExcerpt)}</div>;
         }

         // Decode HTML entities
         let decodedHtml = htmlContent
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");

         // Secondary decode if it was double-encoded
         if (decodedHtml.includes('&lt;')) {
            decodedHtml = decodedHtml
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'");
         }

         // Content pasted from Word/Docs is often full of non-breaking spaces,
         // which stop the browser from ever wrapping the line — replace with
         // normal spaces so long paragraphs wrap naturally instead of overflowing.
         decodedHtml = decodedHtml.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');

         return <div className="rich-text max-w-none" dir={language === 'ar' ? 'rtl' : 'ltr'}>{parse(decodedHtml)}</div>;
      }

      // Handle Legacy Blocks
      if (Array.isArray(post.content)) {
         return post.content.map((block, idx) => {
            switch (block.type) {
               case 'h2':
                  return <h2 key={idx} className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6 tracking-tight">{block.value ? block.value[language] : t(block.valueKey || '')}</h2>;
               case 'paragraph':
                  return <p key={idx} className="text-slate-700 dark:text-slate-300 mb-6 leading-8 text-lg font-light">{block.value ? block.value[language] : t(block.valueKey || '')}</p>;
               case 'quote':
                  return (
                     <blockquote key={idx} className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-gold-500 pl-6 rtl:pr-6 italic text-xl text-slate-800 dark:text-slate-200 my-10 py-2">
                        "{block.value ? block.value[language] : t(block.valueKey || '')}"
                     </blockquote>
                  );
               case 'list':
                  return (
                     <ul key={idx} className="list-disc list-outside ml-6 rtl:mr-6 rtl:ml-0 space-y-3 text-slate-700 dark:text-slate-300 mb-8 marker:text-gold-500 text-lg">
                        {block.items
                           ? block.items.map((item, i) => <li key={i} className="pl-2 rtl:pr-2 rtl:pl-0">{item[language]}</li>)
                           : block.itemsKeys?.map((itemKey, i) => <li key={i} className="pl-2 rtl:pr-2 rtl:pl-0">{t(itemKey)}</li>)
                        }
                     </ul>
                  );
               case 'image':
                  return (
                     <div key={idx} className="my-10 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                        <ImageWithFallback
                           src={block.src || ''}
                           className="w-full"
                           imageClassName="h-auto object-contain"
                           style={{ height: 'auto', objectFit: 'contain' }}
                        />
                     </div>
                  );
               default:
                  return null;
            }
         });
      }

      return null;
   };

   const displayTitle = post.title ? post.title[language] : t(post.titleKey);
   const displayExcerpt = post.excerpt ? post.excerpt[language] : t(post.excerptKey);

   const getCategoryName = (cat: any) => {
      if (!cat) return '';
      if (typeof cat === 'string') return cat;
      return language === 'ar' ? cat.name_ar : cat.name_en;
   };

   return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pb-20 pt-24">
         <SEO
            title={post.seo_title || displayTitle}
            description={post.seo_description || displayExcerpt}
            image={post.image}
            keywords={language === 'ar' ? post.meta_keywords_ar : post.meta_keywords_en}
         />

         {/* Hero Header */}
         <PageHero
        breadcrumbItems={[
                     { label: t('nav_blog'), path: '/blog' },
                     { label: displayTitle }
                  ]}
        title={displayTitle}
      />

         <article className="max-w-4xl mx-auto px-4 sm:px-6">

            {/* Featured Image */}
            <div className="relative isolate mb-12 overflow-hidden rounded-3xl border border-white/70 bg-slate-950 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 dark:border-slate-700/70 dark:ring-white/5">
               {/* A soft backdrop keeps images with different aspect ratios visually balanced. */}
               <img
                  src={post.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />
               <ImageWithFallback
                  src={post.image}
                  alt={displayTitle}
                  className="relative z-10 flex h-[clamp(320px,60vw,720px)] w-full items-center justify-center bg-transparent p-2 sm:p-4"
                  imageClassName="object-contain drop-shadow-2xl"
                  style={{ objectFit: 'contain' }}
                  loading="eager"
               />
            </div>

            {/* Main Content */}
            <div className="max-w-none">
               {renderContent()}
            </div>

            {/* Footer / Back Link */}
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex justify-center md:justify-start">
               <Link
                  to="/blog"
                  className="group inline-flex items-center font-bold text-slate-900 dark:text-white hover:text-gold-500 transition-colors"
               >
                  {dir === 'ltr' ? (
                     <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  ) : (
                     <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  )}
                  {dir === 'ltr' ? 'Back to Articles' : 'العودة للمقالات'}
               </Link>
            </div>

         </article>
      </div>
   );
};

export default BlogDetailPage;
