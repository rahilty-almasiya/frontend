
// import React, { useState, useEffect } from 'react';
// import { api } from '../services/api';
// import { BlogPost } from '../types';
// import { useLanguage } from '../context/LanguageContext';
// import { Calendar, ArrowRight } from 'lucide-react';
// import Skeleton from './Skeleton';
// import ScrollReveal from './ScrollReveal';

// interface BlogSectionProps {
//   limit?: number;
// }

// const BlogSection: React.FC<BlogSectionProps> = ({ limit }) => {
//   const { t, dir } = useLanguage();
//   const [posts, setPosts] = useState<BlogPost[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const data = await api.getBlogPosts();
//         setPosts(limit ? data.slice(0, limit) : data);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, [limit]);

//   const gridClass = limit === 4
//     ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
//     : "grid grid-cols-1 md:grid-cols-3 gap-8";

//   return (
//     <section className="py-24 relative z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <ScrollReveal animation="fade-up" className="flex flex-col items-start  md:flex-row justify-between lg:items-end mb-12">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
//               {t('blog_title')}
//             </h2>
//             <p className="text-slate-600 dark:text-slate-400 mb-4">{t('blog_subtitle')}</p>
//             <div className="h-1 w-20 bg-gold-500 rounded-full"></div>
//           </div>
//           {!limit && (
//             <button className="hidden md:flex items-center text-gold-500 font-semibold hover:text-gold-600 transition-all hover:translate-x-1">
//                 {t('btn_read_more')} {dir === 'ltr' ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowRight className="mr-2 w-4 h-4 rotate-180" />}
//             </button>
//           )}
//         </ScrollReveal>

//         <div className={gridClass}>
//           {loading 
//              ? Array.from({ length: limit || 3 }).map((_, i) => (
//                  <div key={i} className="flex flex-col h-full gap-4">
//                    <Skeleton className="w-full h-56 rounded-2xl" />
//                    <Skeleton className="w-1/3 h-4" />
//                    <Skeleton className="w-3/4 h-6" />
//                    <Skeleton className="w-full h-16" />
//                  </div>
//                ))
//              : posts.map((post, index) => (
//             <ScrollReveal 
//                 key={post.id} 
//                 delay={`${index * 100}ms`}
//                 animation="fade-up"
//                 className="h-full"
//             >
//               <div className="group cursor-pointer flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
//                 <div className="relative h-56 overflow-hidden">
//                   <img 
//                     src={post.image} 
//                     alt={t(post.titleKey)} 
//                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
//                     loading="lazy"
//                   />
//                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
//                   <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider shadow-sm">
//                     {post.category}
//                   </div>
//                 </div>

//                 <div className="flex flex-col flex-grow p-6">
//                     <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-2 rtl:space-x-reverse">
//                       <Calendar className="w-3.5 h-3.5 text-gold-500" />
//                       <span>{post.date}</span>
//                     </div>

//                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors line-clamp-2">
//                       {t(post.titleKey)}
//                     </h3>

//                     <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
//                       {t(post.excerptKey)}
//                     </p>

//                     <div className="mt-auto">
//                       <span className="inline-flex items-center text-sm font-semibold text-gold-500 hover:text-gold-600 border-b-2 border-transparent hover:border-gold-500 transition-all pb-0.5">
//                           {t('btn_read_more')} 
//                           {dir === 'ltr' ? <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" /> : <ArrowRight className="mr-1 w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />}
//                       </span>
//                     </div>
//                 </div>
//               </div>
//             </ScrollReveal>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BlogSection;
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowRight } from 'lucide-react';
import Skeleton from './Skeleton';
import ScrollReveal from './ScrollReveal';
import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import { stripHtml } from '../utils/helpers';

interface BlogSectionProps {
  limit?: number;
}

const BlogSection: React.FC<BlogSectionProps> = ({ limit }) => {
  const { t, dir, language } = useLanguage();
  const formatDate = (date: string) => new Intl.DateTimeFormat(
    language === 'ar' ? 'ar-SA' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(new Date(date));
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getBlogPosts();
        setPosts(limit ? data.slice(0, limit) : data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [limit]);

  const gridClass =
    limit === 4
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
      : 'grid grid-cols-1 md:grid-cols-3 gap-8';

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          animation="fade-up"
          className="flex flex-col items-start md:flex-row justify-between lg:items-end mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {t('blog_title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t('blog_subtitle')}
            </p>
            <div className="h-1 w-20 bg-gold-500 rounded-full" />
          </div>

          {!limit && (
            <button className="hidden md:flex items-center text-gold-500 font-semibold hover:text-gold-600 transition-all hover:translate-x-1">
              {t('btn_read_more')}{' '}
              {dir === 'ltr' ? (
                <ArrowRight className="ml-2 w-4 h-4" />
              ) : (
                <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
              )}
            </button>
          )}
        </ScrollReveal>

        <div className={gridClass}>
          {loading
            ? Array.from({ length: limit || 3 }).map((_, i) => (
              <div key={i} className="flex flex-col h-full gap-4">
                <Skeleton className="w-full h-56 rounded-2xl" />
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-16" />
              </div>
            ))
            : posts.map((post, index) => (
              <ScrollReveal
                key={post.id}
                delay={`${index * 100}ms`}
                animation="fade-up"
                className="h-full"
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="group block cursor-pointer flex flex-col h-full hover:-translate-y-2 transition-transform duration-500 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title ? post.title[language] : t(post.titleKey)}
                      className="w-full h-full"
                      imageClassName="object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider shadow-sm">
                      {post.category
                        ? typeof post.category === 'string'
                          ? t(post.category)
                          : language === 'en'
                            ? post.category.name_en
                            : post.category.name_ar
                        : ''}
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-2 rtl:space-x-reverse">
                      <Calendar className="w-3.5 h-3.5 text-gold-500" />
                      <span>{formatDate(post.date)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors line-clamp-2">
                      {post.title ? post.title[language] : t(post.titleKey)}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                      {stripHtml(post.excerpt ? post.excerpt[language] : t(post.excerptKey))}
                    </p>

                    <div className="mt-auto">
                      <span className="inline-flex items-center text-sm font-semibold text-gold-500 hover:text-gold-600 border-b-2 border-transparent hover:border-gold-500 transition-all pb-0.5">
                        {t('btn_read_more')}
                        {dir === 'ltr' ? (
                          <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        ) : (
                          <ArrowRight className="mr-1 w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
