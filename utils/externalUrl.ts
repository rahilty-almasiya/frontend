/** Accept only absolute HTTP(S) links; translation key fallbacks are never links. */
export const getExternalUrl = (value?: string): string | null => {
  const candidate = value?.trim();
  if (!candidate || !/^https?:\/\//i.test(candidate)) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch { return null; }
};

/**
 * Build a wa.me link only when the phone value is a real number; translation key
 * fallbacks (e.g. the raw key echoed back when a translation is missing) are never links.
 */
export const getWhatsAppUrl = (phone?: string, message?: string): string | null => {
  const digits = phone?.replace(/[^0-9]/g, '');
  if (!digits || digits.length < 8) return null;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
