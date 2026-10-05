import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { transformImage } from '../services/api';
import ImageWithFallback from './ImageWithFallback';
import Breadcrumbs from './Breadcrumbs';

const HERO_SETTING_BY_SECTION: Record<string, string> = {
  about: 'hero_about_image',
  services: 'hero_services_image',
  fleet: 'hero_fleet_image',
  offers: 'hero_offers_image',
  blog: 'hero_blog_image',
  destinations: 'hero_destinations_image',
  tours: 'hero_tours_image',
  hotels: 'hero_hotels_image',
  flights: 'hero_flights_image',
  booking: 'hero_booking_image',
  contact: 'hero_contact_image',
  terms: 'hero_terms_image',
  privacy: 'hero_privacy_image',
  profile: 'hero_profile_image',
};

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbItems: BreadcrumbItem[];
  eyebrow?: string;
  image?: string;
  height?: 'sm' | 'lg';
}

/**
 * Shared hero header used across all listing/detail pages, so every page in the
 * site shares one consistent, premium visual treatment (image, overlay, breadcrumbs,
 * display-font title, optional eyebrow label).
 */
const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, breadcrumbItems, eyebrow, image, height = 'lg' }) => {
  const { t } = useLanguage();
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const section = ['ar', 'en'].includes(pathParts[0]) ? pathParts[1] : pathParts[0];
  const pageImageKey = HERO_SETTING_BY_SECTION[section || ''];
  const pageImageValue = pageImageKey ? t(pageImageKey) : '';
  const configuredPageImage = pageImageValue && pageImageValue !== pageImageKey ? transformImage(pageImageValue) : '';
  const globalImageValue = t('hero_global_image');
  const configuredGlobalImage = globalImageValue !== 'hero_global_image' ? transformImage(globalImageValue) : '';
  const heroImage = image || configuredPageImage || configuredGlobalImage;

  return (
    <div className={`relative w-full overflow-hidden bg-slate-950 ${height === 'sm'
      ? 'h-[170px] sm:h-[190px] md:h-[230px] mb-5'
      : 'h-[190px] mb-8 sm:h-[225px] md:h-[320px] lg:h-[380px] xl:h-[420px] md:mb-10'
    }`}>
      <ImageWithFallback
        src={heroImage}
        alt={title}
        className="relative h-full w-full bg-transparent"
        imageClassName="object-cover object-center"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-slate-950/80"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"></div>
      <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto animate-fade-in pt-3 sm:pt-5 ${height === 'sm' ? 'md:pt-12' : 'md:pt-20'}`}>
        <Breadcrumbs items={breadcrumbItems} className="justify-center mb-1.5 text-[10px] text-slate-300 sm:mb-2 sm:text-xs md:mb-6 md:text-sm" />
        {eyebrow && (
          <span className="section-eyebrow justify-center mb-1 text-gold-400 sm:mb-2 md:mb-4">{eyebrow}</span>
        )}
        <h1 className="font-display text-xl sm:text-2xl md:text-6xl lg:text-7xl font-bold text-white mb-1.5 sm:mb-2 md:mb-6 drop-shadow-xl leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="line-clamp-1 max-w-sm text-[11px] leading-relaxed text-slate-200 drop-shadow-md sm:max-w-xl sm:text-xs md:line-clamp-2 md:max-w-3xl md:text-xl md:font-light" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHero;
