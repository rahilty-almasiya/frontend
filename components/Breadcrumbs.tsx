import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { dir } = useLanguage();
  const Icon = dir === 'ltr' ? ChevronRight : ChevronLeft;

  const isCentered = className.includes('justify-center');

  return (
    <nav className={`flex items-center text-sm font-medium mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className={`flex items-center space-x-2 rtl:space-x-reverse flex-wrap ${isCentered ? 'justify-center w-full' : ''}`}>
        <li>
          <Link to="/" aria-label={dir === 'rtl' ? 'الصفحة الرئيسية' : 'Home'} className="text-white/80 hover:text-gold-400 transition-colors flex min-h-11 min-w-11 items-center justify-center">
            <Home className="w-4 h-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <Icon className="w-4 h-4 mx-2 text-slate-100 dark:text-slate-600" />
            {item.path ? (
              <Link to={item.path} className="text-white/60 hover:text-gold-500 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gold-500 dark:text-white font-semibold cursor-default">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
