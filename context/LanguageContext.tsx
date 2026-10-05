import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '../types';
import { api } from '../services/api';
import { TRANSLATIONS } from '../constants';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  translations: Record<string, { en: string; ar: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translations, setTranslations] = useState(TRANSLATIONS);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await api.getSettings();
      setTranslations({ ...TRANSLATIONS, ...data });
    };
    fetchSettings();
  }, []);

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const pathLanguage = window.location.pathname.split('/').filter(Boolean)[0];
      if (pathLanguage === 'en' || pathLanguage === 'ar') return pathLanguage;
      const saved = localStorage.getItem('language');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    }
    return 'ar';
  });

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts[0] === 'ar' || parts[0] === 'en') parts.shift();
    window.location.assign(`/${next}${parts.length ? `/${parts.join('/')}` : ''}${window.location.search}${window.location.hash}`);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
