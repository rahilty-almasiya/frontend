import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../utils/externalUrl';

const WhatsAppButton: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const transportLink = getWhatsAppUrl(
    t('contact_whatsapp'),
    language === 'ar' ? 'مرحبًا، أريد الاستفسار عن السيارات وخدمات النقل' : 'Hello, I would like to inquire about cars and transport services'
  );
  const tourismLink = getWhatsAppUrl(
    t('contact_tourism_whatsapp'),
    language === 'ar' ? 'مرحبًا، أريد الاستفسار عن الفنادق والخدمات السياحية' : 'Hello, I would like to inquire about hotels and tourism services'
  );

  if (!transportLink && !tourismLink) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 transition-all duration-700 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        bottom-24 right-4 md:bottom-8 md:right-8
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute bottom-full right-0 mb-4 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0 pointer-events-none'
        }`}
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
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">🚘</span>
            <span>{language === 'ar' ? 'السيارات وخدمات النقل' : 'Cars & Transport'}</span>
          </a>
        )}
        {tourismLink && (
          <a
            role="menuitem"
            href={tourismLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-800">🏨</span>
            <span>{language === 'ar' ? 'الفنادق والسياحة' : 'Hotels & Tourism'}</span>
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('whatsapp_label')}
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-900 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.4)] transition-all duration-300 transform hover:scale-110"
      >
        {/* Pulsing Ring Animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-20 animate-ping duration-[2000ms]"></span>

        {/* Border Ring (Gold/Green mix for premium feel) */}
        <span className="absolute inset-0 rounded-full border border-slate-100 dark:border-slate-800 group-hover:border-green-500/30 transition-colors"></span>

        {/* WhatsApp Icon (Inline SVG for brand accuracy) */}
        <svg
          className="w-8 h-8 md:w-9 md:h-9 text-[#25D366] fill-current z-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          {/* Font Awesome WhatsApp Path */}
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>

        {/* Tooltip (Desktop Only) */}
        <div
          className={`hidden md:block absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-800 dark:text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300
             ${dir === 'ltr'
              ? (isHovered ? 'right-full mr-4 opacity-100 translate-x-0' : 'right-full mr-2 opacity-0 translate-x-4')
              : (isHovered ? 'right-full mr-4 opacity-100 translate-x-0' : 'right-full mr-2 opacity-0 -translate-x-4')
            }
           `}
        >
          {language === 'ar' ? 'اختر قسم التواصل' : 'Choose WhatsApp department'}
          {/* Arrow tip */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-[6px] border-transparent 
                ${dir === 'ltr'
                ? 'right-[-12px] border-l-white/90 dark:border-l-slate-800/90'
                : 'right-[-12px] border-l-white/90 dark:border-l-slate-800/90'
              }
             `}
          ></div>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;
