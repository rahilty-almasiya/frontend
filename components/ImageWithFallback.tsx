import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  containerClassName = "",
  imageClassName = "",
  fallbackText = 'Image Unavailable',
  loading = "lazy", // Default to lazy for performance
  fetchPriority = loading === 'eager' ? 'high' : 'low',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const srcSet = typeof src === 'string' && /-1600\.webp(?:\?.*)?$/i.test(src)
    ? `${src.replace(/-1600\.webp(\?.*)?$/i, '-400.webp$1')} 400w, ${src.replace(/-1600\.webp(\?.*)?$/i, '-800.webp$1')} 800w, ${src} 1600w`
    : undefined;

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${containerClassName} ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-200 dark:bg-slate-800 animate-pulse">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin opacity-50" />
        </div>
      )}

      {/* Actual Image */}
      {src && !error ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1600px' : undefined}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${imageClassName} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          {...props}
        />
      ) : (
        /* Error State */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <picture className="contents">
            <source srcSet="/assets/logo-512.webp" type="image/webp" />
            <img
              src="/assets/logo.png"
              alt="Placeholder"
              className="w-1/2 h-1/2 max-w-[120px] object-contain opacity-20 filter grayscale"
            />
          </picture>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-4">{fallbackText}</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;
