
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageWithFallback from '../components/ImageWithFallback';
import { api, transformImage } from '../services/api';
import { toast } from 'sonner';
import PageHero from '../components/PageHero';

const ContactPage: React.FC = () => {
   const { t, language } = useLanguage();
   const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      message: ''
   });

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         await api.sendContactMessage(formData);

         const msg = language === 'ar'
            ? `مرحباً، لدي استفسار:\n\n` +
            `👤 ${t('wa_name')}: ${formData.name}\n` +
            `📱 ${t('wa_phone')}: ${formData.phone}\n` +
            `📧 ${t('wa_email')}: ${formData.email}\n` +
            `💬 ${t('wa_message')}: ${formData.message}\n` +
            `✅ Ticket: Submitted`
            : `Hello, I have an inquiry:\n\n` +
            `👤 ${t('wa_name')}: ${formData.name}\n` +
            `📱 ${t('wa_phone')}: ${formData.phone}\n` +
            `📧 ${t('wa_email')}: ${formData.email}\n` +
            `💬 ${t('wa_message')}: ${formData.message}\n` +
            `✅ Ticket: Submitted`;

         const whatsappUrl = `https://wa.me/${t('contact_whatsapp')}?text=${encodeURIComponent(msg)}`;
         window.open(whatsappUrl, '_blank');

         toast.success(language === "ar" ? "تم إرسال رسالتك بنجاح!" : "Your message has been sent!");
         setFormData({ name: '', phone: '', email: '', message: '' }); // Reset form
      } catch (error) {
         console.error("Contact submission failed", error);
         toast.error(language === "ar" ? "حدث خطأ، يرجى المحاولة عبر واتساب." : "Error sending message, please try WhatsApp.");

         // Fallback
         const msg = language === 'ar'
            ? `مرحباً، لدي استفسار:\n\n` +
            `👤 ${t('wa_name')}: ${formData.name}\n` +
            `📱 ${t('wa_phone')}: ${formData.phone}\n` +
            `📧 ${t('wa_email')}: ${formData.email}\n` +
            `💬 ${t('wa_message')}: ${formData.message}`
            : `Hello, I have an inquiry:\n\n` +
            `👤 ${t('wa_name')}: ${formData.name}\n` +
            `📱 ${t('wa_phone')}: ${formData.phone}\n` +
            `📧 ${t('wa_email')}: ${formData.email}\n` +
            `💬 ${t('wa_message')}: ${formData.message}`;

         const whatsappUrl = `https://wa.me/${t('contact_whatsapp')}?text=${encodeURIComponent(msg)}`;
         window.open(whatsappUrl, '_blank');
      }
   };

   return (
      <div className="min-h-screen pt-24 pb-12 relative z-10">
         <SEO
            title={t('nav_contact')}
            description={t('contact_subtitle')}
         />

         {/* Hero Header */}
         <PageHero
        breadcrumbItems={[{ label: t('nav_contact') }]}
        title={t('contact_title')}
        subtitle={t('contact_subtitle')}
      />

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

               {/* Info Side */}
               <div className="space-y-8">
                  {/* Contact Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4">
                           <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('label_phone')}</h3>
                        <a href={`tel:${t('contact_phone')}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-gold-500 transition-colors" dir="ltr">{t('contact_phone')}</a>
                     </div>
                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4">
                           <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('label_email')}</h3>
                        <a href={`mailto:${t('contact_email')}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-gold-500 transition-colors">{t('contact_email')}</a>
                     </div>
                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4">
                           <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                           {language === 'ar' ? 'هاتف وواتساب الفنادق والسياحة' : 'Hotels & Tourism Phone/WhatsApp'}
                        </h3>
                        <a href={`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 dark:text-slate-400 hover:text-gold-500 transition-colors" dir="ltr">
                           {t('contact_tourism_phone')}
                        </a>
                     </div>
                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4">
                           <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                           {language === 'ar' ? 'بريد الفنادق والسياحة' : 'Hotels & Tourism Email'}
                        </h3>
                        <a href={`mailto:${t('contact_tourism_email')}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-gold-500 transition-colors">
                           {t('contact_tourism_email')}
                        </a>
                     </div>
                     <a
                        href={t('contact_map_link') || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('contact_address') || 'Rahilty Almasiya')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-gold-500 hover:shadow-md transition-all cursor-pointer group"
                     >
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                           <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact_location')}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{t('contact_address')}</p>
                     </a>
                     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center text-gold-500 mb-4">
                           <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('contact_hours_label')}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('contact_hours')}</p>
                     </div>
                  </div>

                  {/* Map */}
                  <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative shadow-lg">
                     <iframe
                        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3714.4691999785073!2d39.785157685060845!3d21.410795085792603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjHCsDI0JzM4LjkiTiAzOcKwNDYnNTguNyJF!5e0!3m2!1sar!2seg!4v1765204700531!5m2!1sar!2seg"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                     ></iframe>
                  </div>
               </div>

               {/* Form Side */}
               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 h-fit">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{t('contact_form_title')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_name')}</label>
                           <input
                              type="text"
                              required
                              placeholder={t('placeholder_name')}
                              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_phone')}</label>
                           <input
                              type="tel"
                              required
                              placeholder={t('placeholder_phone')}
                              className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_email')}</label>
                        <input
                           type="email"
                           required
                           placeholder={t('placeholder_email')}
                           className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                           value={formData.email}
                           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('label_message')}</label>
                        <textarea
                           rows={4}
                           required
                           placeholder={t('placeholder_message')}
                           className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all dark:text-white"
                           value={formData.message}
                           onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                     </div>

                     <button type="submit" className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-[#25D366]/30 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse">
                        <MessageCircle className="w-5 h-5" />
                        <span>{t('btn_send')}</span>
                     </button>
                  </form>
               </div>

            </div>
         </div>
      </div>
   );
};

export default ContactPage;
