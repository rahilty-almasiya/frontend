import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import Logo from './Logo';
import { api } from '../services/api';
import { PaymentMethod } from '../types';
import { toast } from 'sonner';
import { getExternalUrl } from '../utils/externalUrl';

const Footer: React.FC = () => {
  const { t, dir, language } = useLanguage();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const fetchData = async () => {
      try {
        const methods = await api.getPaymentMethods();

        if (Array.isArray(methods)) {
          setPaymentMethods(methods);
        } else if (methods && typeof methods === 'object' && 'Data' in methods && Array.isArray((methods as any).Data)) {
          setPaymentMethods((methods as any).Data);
        }
      } catch (error) {
        console.error("Failed to fetch footer data", error);
      }
    };

    if (!('IntersectionObserver' in window)) {
      fetchData();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchData();
        observer.disconnect();
      }
    }, { rootMargin: '400px 0px' });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);

    try {
      await api.subscribeNewsletter(email);
      toast.success(t('newsletter_success') || 'Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error(t('newsletter_error') || 'Failed to subscribe. Try again.');
    } finally {
      setSubscribing(false);
    }
  };

  // Google Maps Link
  const mapLink = t('contact_map_link') || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('contact_address') || 'Rahilty Almasiya')}`;
  const facebookUrl = getExternalUrl(t('facebook_url'));
  const instagramUrl = getExternalUrl(t('instagram_url'));
  const snapchatUrl = getExternalUrl(t('snapchat_url'));
  const tiktokUrl = getExternalUrl(t('tiktok_url'));
  const safeMapLink = getExternalUrl(mapLink);

  return (
    <footer ref={footerRef} className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-start">
              <Logo className="w-72 h-32 !object-cover object-center" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('footer_desc')}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 rtl:space-x-reverse pt-2">

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:text-gold-400 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:text-gold-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}

              {snapchatUrl && (
                <a
                  href={snapchatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Snapchat"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:text-gold-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 2c2.5 0 4.5 2 4.5 4.5 0 1 .3 1.8.8 2.6.4.6 1 1.1 1.7 1.3.4.2.7.5.7.9s-.3.7-.7.9c-.7.3-1.3.7-1.7 1.3-.5.8-.8 1.6-.8 2.6 0 2.5-2 4.5-4.5 4.5S7.5 19.5 7.5 17c0-1-.3-1.8-.8-2.6-.4-.6-1-1.1-1.7-1.3-.4-.2-.7-.5-.7-.9s.3-.7.7-.9c.7-.3 1.3-.7 1.7-1.3.5-.8.8-1.6.8-2.6C7.5 4 9.5 2 12 2z" />
                  </svg>
                </a>
              )}

              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:text-gold-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M21 8.5c-2 0-3.7-1.6-3.9-3.6V4h-3v12.2c0 1.6-1.3 3-3 3s-3-1.4-3-3 1.3-3 3-3c.3 0 .7 0 1 .1V10c-.3 0-.7-.1-1-.1-3.3 0-6 2.7-6 6.1S7.7 22 11 22c3.2 0 5.9-2.6 6-5.8V10c1 1.5 2.7 2.5 4.5 2.5V8.5z" />
                  </svg>
                </a>
              )}

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/fleet" className="hover:text-gold-500 transition-colors text-sm">{t('nav_fleet')}</Link></li>
              <li><Link to="/hotels" className="hover:text-gold-500 transition-colors text-sm">{t('nav_hotels')}</Link></li>
              <li><Link to="/flights" className="hover:text-gold-500 transition-colors text-sm">{t('nav_flights')}</Link></li>
              <li><Link to="/tours" className="hover:text-gold-500 transition-colors text-sm">{t('nav_tours')}</Link></li>
              <li><Link to="/destinations" className="hover:text-gold-500 transition-colors text-sm">{t('nav_destinations')}</Link></li>
              <li><Link to="/services" className="hover:text-gold-500 transition-colors text-sm">{t('nav_services')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {t('nav_contact')}
            </h3>
            <ul className="space-y-4">
              {safeMapLink && <li className="flex items-start">
                <a
                  href={safeMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 rtl:space-x-reverse group"
                >
                  <MapPin className="w-5 h-5 text-gold-500 flex-shrink-0 group-hover:text-gold-400 transition-colors" />
                  <span className="text-sm hover:text-gold-500 transition-colors">{t('contact_address')}</span>
                </a>
              </li>}

              <li className="pt-2">
                <p className="text-sm font-semibold text-white">
                  {language === 'ar' ? 'لحجز السيارات' : 'For car reservations'}
                </p>
              </li>

              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a href={`tel:${t('contact_phone')}`} className="text-sm hover:text-gold-500 transition-colors">
                  <bdi>{t('contact_phone')}</bdi>
                </a>
              </li>

              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <a href={`mailto:${t('contact_email')}`} className="text-sm hover:text-gold-500 transition-colors">
                  {t('contact_email')}
                </a>
              </li>

              <li className="pt-2">
                <p className="mb-3 text-sm font-semibold text-white">
                  {language === 'ar' ? 'لحجز الفنادق' : 'For hotel reservations'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <a href={`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gold-500 transition-colors">
                      <bdi>{t('contact_tourism_phone')}</bdi>
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <a href={`mailto:${t('contact_tourism_email')}`} className="text-sm hover:text-gold-500 transition-colors">
                      {t('contact_tourism_email')}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / VIP */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">
              {t('footer_vip')}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {t('footer_vip_desc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder={t('label_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-gold-500 hover:bg-gold-600 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
              >
                {subscribing ? '...' : t('btn_subscribe')}
              </button>
            </form>
          </div>

          {/* Certifications */}
          <div className="lg:col-span-4 mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex min-w-0 flex-col items-center justify-center gap-2 text-center lg:flex-row lg:gap-3">
              <img src="/assets/footer_logos/logo1.jpg" alt="Ministry of Commerce" className="h-14 w-16 sm:h-16 sm:w-20 object-contain bg-white rounded p-1" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs lg:text-sm text-slate-400 font-mono tracking-wider">7052461824</span>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-2 text-center lg:flex-row lg:gap-3">
              <img src="/assets/footer_logos/logo2.jpg" alt="Saudi Business Center" className="h-14 w-16 sm:h-16 sm:w-20 object-contain bg-white rounded p-1" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs lg:text-sm text-slate-400 font-mono tracking-wider">0000207056</span>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-2 text-center lg:flex-row lg:gap-3">
              <img src="/assets/footer_logos/logo3.jpg" alt="VAT" className="h-14 w-16 sm:h-16 sm:w-20 object-contain bg-white rounded p-1" />
              <span className="whitespace-nowrap text-[10px] sm:text-xs lg:text-sm text-slate-400 font-mono tracking-wider">314377956900003</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-4 mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <div className="text-sm text-slate-400 font-medium">
              {t('label_payment_methods') || 'We Accept Secure Payments'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {paymentMethods.length > 0 ? (
                paymentMethods.map(pm => (
                  <div key={pm.PaymentMethodId} className="h-8 bg-white/10 px-2 rounded flex items-center justify-center border border-white/5" title={language === 'ar' ? pm.PaymentMethodAr : pm.PaymentMethodEn}>
                    <img src={pm.ImageUrl} alt={language === 'ar' ? pm.PaymentMethodAr : pm.PaymentMethodEn} className="h-full object-contain" />
                  </div>
                ))
              ) : (
                // Fallback if API fails or empty
                <>
                  <div className="h-8 bg-white/10 px-3 rounded flex items-center justify-center border border-white/5" title="MADA">
                    <span className="text-[12px] font-bold text-white tracking-widest uppercase">MADA</span>
                  </div>
                  <div className="h-8 bg-white/10 px-3 rounded flex items-center justify-center border border-white/5" title="KNET">
                     <span className="text-[12px] font-bold text-white tracking-widest uppercase">KNET</span>
                  </div>
                  <div className="h-8 bg-white/10 px-3 rounded flex items-center justify-center border border-white/5" title="VISA">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 12" className="h-3 object-contain"><path fill="#fff" d="M16 0l-2.4 11.6h3.8L19.8 0H16zm9.8 11.1c-1-.5-1.6-.8-1.6-1.3 0-.5.6-.7 1.4-.7.6 0 1.2.2 1.7.4l.3-1.9c-.5-.2-1.2-.4-1.9-.4-2 0-3.5 1-3.5 2.5 0 1.1 1 1.8 1.7 2.1.8.4 1 .6 1 1 0 .5-.7.7-1.3.7-.9 0-1.5-.2-2-.5l-.3 1.9c.5.2 1.3.5 2.1.5 2.2 0 3.6-1 3.6-2.6-.1-1-.6-1.6-1.7-2.1zM35.6 0h-2.9c-.5 0-.8.2-1 .7l-4.5 10.9h4l.8-2.2h4.8l.5 2.2h3.5L35.6 0zm-2.3 2.8l1.2 3.2h-2.3l1.1-3.2zm-13.3-2.8L17.5 11.6h-3.8L16.2 3c-.7-2-3-2.7-5.7-2.8L10.5 11.6H6.6L9.8 0h10.2z"/></svg>
                  </div>
                  <div className="h-8 bg-white/10 px-3 rounded flex items-center justify-center border border-white/5" title="MasterCard">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 28" className="h-4 object-contain"><circle fill="#EB001B" cx="14" cy="14" r="14"/><circle fill="#F79E1B" cx="30" cy="14" r="14"/><path fill="#FF5F00" d="M22 25.4c-3-2.5-4.8-6.1-4.8-10.2s1.8-7.7 4.8-10.2c3 2.5 4.8 6.1 4.8 10.2S25 22.9 22 25.4z"/></svg>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-400 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Rahilty Almasiya. {t('footer_rights')}.
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              {t('footer_privacy')}
            </Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">
              {t('footer_terms')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
