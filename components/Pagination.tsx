
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const { dir } = useLanguage();

  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis for large ranges
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`flex justify-center items-center space-x-2 rtl:space-x-reverse mt-16 animate-fade-in select-none ${className}`} 
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-gold-500 hover:text-gold-500 dark:hover:border-gold-500 dark:hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all duration-300 shadow-sm"
        aria-label="Previous Page"
      >
        {dir === 'ltr' ? (
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>

      {/* Mobile Compact View */}
      <div className="md:hidden flex items-center px-4 font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-full h-10 shadow-sm border border-slate-100 dark:border-slate-800 mx-2">
        <span className="text-gold-500 font-bold">{currentPage}</span>
        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <span>{totalPages}</span>
      </div>

      {/* Desktop Full View */}
      <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse bg-white dark:bg-slate-900 p-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 px-2">
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-10 h-10 flex items-center justify-center text-slate-400">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            ) : (
              <button
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/30 scale-105'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-gold-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="group flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-gold-500 hover:text-gold-500 dark:hover:border-gold-500 dark:hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-all duration-300 shadow-sm"
        aria-label="Next Page"
      >
        {dir === 'ltr' ? (
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>
    </nav>
  );
};

export default Pagination;
