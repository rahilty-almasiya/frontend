import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;