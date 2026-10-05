
import { Language } from '../types';

/**
 * Resolves a translatable value.
 * @param val The value to resolve. Can be a string (key) or an object {en, ar}.
 * @param language Current language ('en' | 'ar').
 * @param t Optional translation function to use if val is a key.
 * @returns The resolved string.
 */
export const resolveTranslation = (
  val: any,
  language: Language,
  t?: (key: string) => string
): string => {
  if (!val) return '';
  
  if (typeof val === 'object') {
    return val[language] || val['en'] || val['ar'] || '';
  }
  
  if (typeof val === 'string') {
    // If it looks like a key and we have t, use it.
    // Otherwise return it as is.
    if (t) {
      const translated = t(val);
      return translated;
    }
    return val;
  }
  
  return String(val);
};

/**
 * Helper to transform backend images to full URLs.
 */
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'http://localhost:8000/';
  // Remove leading slash if any
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const baseUrl = STORAGE_BASE_URL.endsWith('/') ? STORAGE_BASE_URL : `${STORAGE_BASE_URL}/`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Strips HTML tags and entities from a string.
 * Useful for card excerpts.
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";
  
  // Replace HTML entities first
  let text = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Strip tags
  return text.replace(/<[^>]*>?/gm, '').trim();
};
