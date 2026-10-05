
// import React, { useEffect, useState } from 'react';
// import { BLOG_POSTS, BLOG_CATEGORIES } from '../constants';
// import { useLanguage } from '../context/LanguageContext';
// import { Calendar, ArrowRight, User, Search, Filter } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import ImageWithFallback from '../components/ImageWithFallback';
// import Pagination from '../components/Pagination';

// const ITEMS_PER_PAGE = 3;

// const BlogPage: React.FC = () => {
//   const { t, dir } = useLanguage();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [currentPage]);

//   // Filtering Logic
//   useEffect(() => {
//     let result = BLOG_POSTS;

//     if (selectedCategory !== 'All') {
//       result = result.filter(post => post.category === selectedCategory);
//     }

//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(post => 
//         t(post.titleKey).toLowerCase().includes(q) || 
//         t(post.excerptKey).toLowerCase().includes(q)
//       );
//     }

//     setFilteredPosts(result);
//     setCurrentPage(1); // Reset to page 1 on filter change
//   }, [selectedCategory, searchQuery, t]);

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
//   const paginatedPosts = filteredPosts.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   return (
//     <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors">

//        {/* Hero Header */}
//        <div className="relative mb-12">
//           <div className="absolute inset-0 h-[300px] z-0 overflow-hidden">
//              <div className="absolute inset-0 bg-slate-900/90 z-10"></div>
//              <ImageWithFallback 
//                 src="/assets/offer1.avif" 
//                 alt="Blog Header" 
//                 className="w-full h-full object-cover"
//              />
//           </div>
//           <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[300px] flex flex-col justify-center text-center">
//              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">{t('blog_title')}</h1>
//              <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>{t('blog_subtitle')}</p>
//           </div>
//        </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">

//         {/* Controls Bar */}
//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 mb-12 border border-slate-100 dark:border-slate-800 animate-fade-in">
//            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">

//               {/* Category Filter */}
//               <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
//                  <div className="flex space-x-2 rtl:space-x-reverse min-w-max">
//                     {BLOG_CATEGORIES.map(cat => (
//                        <button
//                           key={cat}
//                           onClick={() => setSelectedCategory(cat)}
//                           className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
//                              selectedCategory === cat 
//                                ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30' 
//                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
//                           }`}
//                        >
//                           {cat}
//                        </button>
//                     ))}
//                  </div>
//               </div>

//               {/* Search */}
//               <div className="relative w-full lg:w-80">
//                  <input 
//                     type="text" 
//                     placeholder={t('blog_search_placeholder')}
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
//                  />
//                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               </div>
//            </div>
//         </div>

//         {/* Blog Grid */}
//         {filteredPosts.length > 0 ? (
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
//              {paginatedPosts.map((post, index) => (
//                <Link 
//                    to={`/blog/${post.id}`}
//                    key={post.id} 
//                    className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-slate-800 animate-slide-up"
//                    style={{ animationDelay: `${index * 100}ms` }}
//                >
//                  <div className="relative h-60 overflow-hidden">
//                    <ImageWithFallback 
//                      src={post.image} 
//                      alt={post.title ? post.title[language] : t(post.titleKey)} 
//                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
//                    />
//                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
//                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-gold-400 uppercase tracking-wider shadow-sm">
//                      {post.category}
//                    </div>
//                  </div>

//                  <div className="p-6 flex flex-col flex-grow">
//                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4 space-x-4 rtl:space-x-reverse">
//                        <div className="flex items-center">
//                            <Calendar className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-gold-500" />
//                            <span>{post.date}</span>
//                        </div>
//                        <div className="flex items-center">
//                            <User className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-gold-500" />
//                            <span>{post.author}</span>
//                        </div>
//                      </div>

//                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors line-clamp-2 leading-tight">
//                        {t(post.titleKey)}
//                      </h2>

//                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
//                        {t(post.excerptKey)}
//                      </p>

//                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
//                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{post.readTime}</span>
//                          <span className="inline-flex items-center text-sm font-bold text-gold-500 group-hover:underline">
//                              {t('blog_read_more')} 
//                              {dir === 'ltr' ? (
//                                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
//                              ) : (
//                                  <ArrowRight className="mr-2 w-4 h-4 rotate-180 transform group-hover:-translate-x-1 transition-transform" />
//                              )}
//                          </span>
//                      </div>
//                  </div>
//                </Link>
//              ))}
//            </div>
//         ) : (
//            <div className="text-center py-20 text-slate-500 dark:text-slate-400">
//               <p className="text-lg">No articles found matching your criteria.</p>
//               <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="mt-4 text-gold-500 hover:underline">Clear Filters</button>
//            </div>
//         )}

//         {/* Pagination */}
//         <Pagination 
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//         />

//       </div>
//     </div>
//   );
// };

// export default BlogPage;
import React, { useEffect, useState } from 'react';
import { api, transformImage } from '../services/api';
import { BlogCategory, BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, ArrowRight, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import { stripHtml } from '../utils/helpers';
import parse from 'html-react-parser';
import PageHero from '../components/PageHero';

const ITEMS_PER_PAGE = 3;

const BlogPage: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const formatDate = (date: string) => new Intl.DateTimeFormat(
    language === 'ar' ? 'ar-SA' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(new Date(date));
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Helper to get category name safely
  const getCategoryName = (post: BlogPost): string => {
    if (!post.category) return "Uncategorized";
    if (typeof post.category === 'string') return post.category;
    return language === 'ar' ? post.category.name_ar : post.category.name_en;
  };

  // Helper to get category name for filtering (English or original string)
  const getCategoryFilterValue = (post: BlogPost): string => {
    if (!post.category) return "Uncategorized";
    if (typeof post.category === 'string') return post.category;
    return post.category.name_en;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    Promise.all([
      api.getBlogPosts(),
      api.getBlogCategories()
    ]).then(([postsData, catsData]) => {
      setPosts(postsData);
      setFilteredPosts(postsData);
      setCategories(catsData);
    }).catch(err => console.error("Failed to load blog data", err));
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = posts;

    if (selectedCategory !== 'All') {
      result = result.filter(post => getCategoryFilterValue(post) === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => {
        const title = post.title ? post.title[language] : t(post.titleKey);
        const excerpt = post.excerpt ? post.excerpt[language] : t(post.excerptKey);
        return title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
      });
    }

    setFilteredPosts(result);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [selectedCategory, searchQuery, t, posts, language]);

  // Combine static "All" with fetched categories
  const filterCategories = ['All', ...categories.map(c => c.name_en)];

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEO
        title={t('nav_blog')}
        description={t('blog_subtitle')}
      />
      {/* Hero Header */}
      <PageHero
        breadcrumbItems={[{ label: t('nav_blog') }]}
        title={t('blog_title')}
        subtitle={t('blog_subtitle')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30">

        {/* Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 mb-12 border border-slate-100 dark:border-slate-800 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">

            {/* Category Filter */}
            <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <div className="flex space-x-2 rtl:space-x-reverse min-w-max">
                {filterCategories.map(cat => {
                  // Find localized name if available
                  const categoryLogin = categories.find(c => c.name_en === cat);
                  const displayName = cat === 'All' ? t('cat_all') : (
                    language === 'ar' && categoryLogin ? categoryLogin.name_ar : cat
                  );

                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selectedCategory === cat}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                        ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                      {displayName}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder={t('blog_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedPosts.map((post, index) => (
              <Link
                to={`/blog/${post.id}`}
                key={post.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 flex flex-col h-full border border-slate-100 dark:border-slate-800 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title ? post.title[language] : t(post.titleKey)}
                    className="w-full h-full"
                    imageClassName="object-contain"
                    style={{ objectFit: 'contain' }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-gold-400 uppercase tracking-wider shadow-sm">
                    {getCategoryName(post)}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-4 space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-gold-500" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 text-gold-500" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-gold-500 transition-colors line-clamp-2 leading-tight">
                    {post.title ? post.title[language] : t(post.titleKey)}
                  </h2>

                  <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {stripHtml(post.excerpt ? post.excerpt[language] : t(post.excerptKey))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{post.readTime}</span>
                    <span className="inline-flex items-center text-sm font-bold text-gold-500 group-hover:underline">
                      {t('blog_read_more')}
                      {dir === 'ltr' ? (
                        <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="mr-2 w-4 h-4 rotate-180 transform group-hover:-translate-x-1 transition-transform" />
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <p className="text-lg">{t('blog_no_results')}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-4 text-gold-500 hover:underline"
            >
              {t('blog_clear_filters')}
            </button>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
};

export default BlogPage;
