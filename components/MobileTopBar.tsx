import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getWhatsAppUrl } from '../utils/externalUrl';
import Logo from './Logo';

const MobileTopBar: React.FC = () => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isWhatsAppMenuOpen, setIsWhatsAppMenuOpen] = useState(false);
   const { t, toggleLanguage, language } = useLanguage();
   const { theme, toggleTheme } = useTheme();
   const transportLink = getWhatsAppUrl(
      t('contact_whatsapp'),
      language === 'ar' ? 'مرحبًا، أريد الاستفسار عن السيارات وخدمات النقل' : 'Hello, I would like to inquire about cars and transport services'
   );
   const tourismLink = getWhatsAppUrl(
      t('contact_tourism_whatsapp'),
      language === 'ar' ? 'مرحبًا، أريد الاستفسار عن الفنادق والخدمات السياحية' : 'Hello, I would like to inquire about hotels and tourism services'
   );

   useEffect(() => {
      const handleScroll = () => {
         setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   return (
      <div className={`md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
         <div className="px-4 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="relative flex h-20 w-40 flex-col items-center justify-center flex-shrink-0 overflow-visible">
               <Logo className="h-16 w-full !object-cover object-[center_55%]" />
               <div className="-mt-3 text-center leading-none text-gold-500 transition-colors">
                  <div className="text-[10px] font-medium">{t('license_label')} {t('license_number')}</div>
               </div>
            </Link>

            {/* Settings Toggles */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
               {t('payment_gateway_enabled') !== 'true' && (transportLink || tourismLink) && (
                  <div className="relative">
                     <button
                        type="button"
                        onClick={() => setIsWhatsAppMenuOpen(open => !open)}
                        aria-expanded={isWhatsAppMenuOpen}
                        aria-haspopup="menu"
                        aria-label={language === 'ar' ? 'اختر قسم الواتساب' : 'Choose WhatsApp department'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400 backdrop-blur-md'}`}
                     >
                        <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                     </button>

                     <div
                        role="menu"
                        className={`absolute top-full mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${
                           language === 'ar' ? 'left-0' : 'right-0'
                        } ${isWhatsAppMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none'}`}
                     >
                        <p className="px-3 py-2 text-sm font-bold text-slate-900 dark:text-white">
                           {language === 'ar' ? 'اختر القسم للتواصل' : 'Choose a department'}
                        </p>
                        {transportLink && (
                           <a
                              role="menuitem"
                              href={transportLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsWhatsAppMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                           >
                              <span className="text-xl">🚘</span>
                              <span>{language === 'ar' ? 'السيارات وخدمات النقل' : 'Cars & Transport'}</span>
                           </a>
                        )}
                        {tourismLink && (
                           <a
                              role="menuitem"
                              href={tourismLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsWhatsAppMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                           >
                              <span className="text-xl">🏨</span>
                              <span>{language === 'ar' ? 'الفنادق والسياحة' : 'Hotels & Tourism'}</span>
                           </a>
                        )}
                     </div>
                  </div>
               )}
               <button
                  onClick={toggleLanguage}
                  aria-label={language === 'en' ? 'Switch language to Arabic' : 'تغيير اللغة إلى الإنجليزية'}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-black/20 text-white backdrop-blur-md'}`}
               >
                  <span className="text-[10px] font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
               </button>
               <button
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? (language === 'ar' ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (language === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isScrolled ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'bg-black/20 text-white backdrop-blur-md'}`}
               >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
               </button>
            </div>
         </div>
      </div>
   );
};

export default MobileTopBar;
