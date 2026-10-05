import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string;
    type?: 'website' | 'article' | 'product';
    schema?: Record<string, any>;
    noIndex?: boolean;
}

type ManagedSeo = Record<string, any>;
declare global { interface Window { __SEO_DATA__?: ManagedSeo; } }
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiv2.rahilatialmasiya.com/public/api';
const DOMAIN = 'https://rahilatialmasiya.com';
const PRIVATE_PATHS = ['/login', '/forgot-password', '/reset-password', '/profile', '/checkout', '/booking', '/payment-success', '/payment-error'];

const normaliseContentPath = (pathname: string) => {
    const withoutLocale = pathname.replace(/^\/(?:ar|en)(?=\/|$)/, '') || '/';
    return withoutLocale === '/' ? '/' : withoutLocale.replace(/\/$/, '');
};

const localiseCanonical = (configuredUrl: string, language: string) => {
    try {
        const parsed = new URL(configuredUrl, DOMAIN);
        const basePath = parsed.pathname.replace(/^\/(?:ar|en)(?=\/|$)/, '') || '/';
        parsed.pathname = `/${language}${basePath === '/' ? '' : basePath}`;
        return parsed.toString();
    } catch {
        return configuredUrl;
    }
};

const SEO: React.FC<SEOProps> = ({ title, description, image, url, keywords, type = 'website', schema, noIndex = false }) => {
    const { language, t } = useLanguage();
    const location = useLocation();
    const contentPath = normaliseContentPath(location.pathname);
    const [managed, setManaged] = useState<ManagedSeo | null>(() => window.__SEO_DATA__ || null);

    useEffect(() => {
        let active = true;
        axios.get(`${API_BASE_URL}/seo/resolve`, { params: { path: contentPath } })
            .then(response => { if (active) setManaged(response.data); })
            .catch(() => { if (active) setManaged(null); });
        return () => { active = false; };
    }, [contentPath]);

    const values = useMemo(() => {
        const suffix = language === 'ar' ? 'ar' : 'en';
        const siteName = language === 'ar' ? 'رحلتي الماسية' : 'Rahilty Almasiya';
        const defaultTitle = language === 'ar' ? 'سياحة ونقل فاخر' : 'Luxury Travel & Transportation';
        const defaultDescription = language === 'ar'
            ? 'رحلتي الماسية تقدم رحلات سياحية ونقلاً خاصاً فاخراً في المملكة العربية السعودية.'
            : 'Rahilty Almasiya offers curated tours, private transport, and premium hospitality across Saudi Arabia.';
        const managedTitle = managed?.[`meta_title_${suffix}`];
        const managedDescription = managed?.[`meta_description_${suffix}`];
        const managedOgTitle = managed?.[`og_title_${suffix}`];
        const managedOgDescription = managed?.[`og_description_${suffix}`];
        const fallbackTitle = title ? `${title} | ${siteName}` : `${siteName} | ${defaultTitle}`;
        const localisedPath = `/${language}${contentPath === '/' ? '' : contentPath}`;
        const canonical = managed?.canonical_url
            ? localiseCanonical(managed.canonical_url, language)
            : url || `${DOMAIN}${localisedPath}`;
        const forceNoIndex = noIndex || PRIVATE_PATHS.includes(contentPath);

        return {
            siteName,
            title: managedTitle || fallbackTitle,
            description: managedDescription || description || defaultDescription,
            keywords: managed?.[`meta_keywords_${suffix}`] || keywords || '',
            image: managed?.og_image || image || `${DOMAIN}/assets/logo.png`,
            canonical,
            ogTitle: managedOgTitle || managedTitle || fallbackTitle,
            ogDescription: managedOgDescription || managedDescription || description || defaultDescription,
            robots: `${forceNoIndex || managed?.indexable === false ? 'noindex' : 'index'},${managed?.follow_links === false ? 'nofollow' : 'follow'}`,
            twitterCard: managed?.twitter_card || 'summary_large_image',
            schema: managed?.schema_json || schema,
        };
    }, [managed, language, title, description, image, url, keywords, schema, noIndex, contentPath]);

    useEffect(() => {
        const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
            let element = document.head.querySelector(selector) as HTMLMetaElement | null;
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, key);
                document.head.appendChild(element);
            }
            element.content = content;
        };
        const named = (name: string, content: string) => setMeta(`meta[name="${name}"]`, 'name', name, content);
        const property = (name: string, content: string) => setMeta(`meta[property="${name}"]`, 'property', name, content);

        document.title = values.title;
        named('description', values.description);
        named('robots', values.robots);
        if (values.keywords) named('keywords', values.keywords);
        property('og:site_name', values.siteName);
        property('og:title', values.ogTitle);
        property('og:description', values.ogDescription);
        property('og:url', values.canonical);
        property('og:type', type);
        property('og:image', values.image);
        property('og:locale', language === 'ar' ? 'ar_SA' : 'en_US');
        named('twitter:card', values.twitterCard);
        named('twitter:title', values.ogTitle);
        named('twitter:description', values.ogDescription);
        named('twitter:image', values.image);

        let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = values.canonical;

        const setAlternate = (hreflang: string, href: string) => {
            let link = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'alternate';
                link.hreflang = hreflang;
                document.head.appendChild(link);
            }
            link.href = href;
        };
        const routePath = contentPath === '/' ? '' : contentPath;
        setAlternate('ar', `${DOMAIN}/ar${routePath}`);
        setAlternate('en', `${DOMAIN}/en${routePath}`);
        setAlternate('x-default', `${DOMAIN}/ar${routePath}`);

        let script = document.head.querySelector('#seo-schema') as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement('script');
            script.id = 'seo-schema';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        const organization = {
            '@type': 'Organization', name: 'Rahilty Almasiya', url: DOMAIN,
            logo: `${DOMAIN}/assets/logo.png`,
            contactPoint: { '@type': 'ContactPoint', telephone: t('contact_phone') || '+966567546669', contactType: 'customer service', areaServed: 'SA', availableLanguage: ['en', 'ar'] }
        };
        const page = values.schema || { '@type': 'WebPage', name: values.title, description: values.description, url: values.canonical };
        script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, page] });
    }, [values, type, language, t, contentPath]);

    return null;
};

export default SEO;
