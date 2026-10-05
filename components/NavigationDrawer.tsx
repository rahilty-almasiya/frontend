import React, { useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, User as UserIcon, LogOut, Moon, Sun, Globe, Shield, FileText, Info, Tag, Phone, Mail, MapPin, Compass, Building2, PlaneTakeoff, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const { t, dir, language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { items: cartItems } = useCart();
  const navigate = useNavigate();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { path: '/hotels', label: 'nav_hotels', icon: Building2 },
    { path: '/flights', label: 'nav_flights', icon: PlaneTakeoff },
    { path: '/tours', label: 'nav_tours', icon: Compass },
    { path: '/destinations', label: 'nav_destinations', icon: MapPin },
    { path: '/about', label: 'nav_about', icon: Info },
    { path: '/offers', label: 'nav_offers', icon: Tag },
    { path: '/contact', label: 'nav_contact', icon: Phone },
    { path: '/privacy-policy', label: 'footer_privacy', icon: Shield },
    { path: '/terms-conditions', label: 'footer_terms', icon: FileText },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 bottom-0 z-[70] w-[85%] max-w-[320px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out border-r border-slate-200 dark:border-slate-800 ${
          dir === 'ltr' 
            ? (isOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full') 
            : (isOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full')
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
             <div className="flex items-center gap-3">
                {user ? (
                  <Link to="/profile" onClick={onClose} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500 shadow-lg flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gold-50 dark:bg-gold-500/10 flex items-center justify-center text-gold-600">
                          <UserIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-gold-600 transition-colors uppercase tracking-wider text-xs truncate max-w-[120px]">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{t('nav_profile' as any) || 'My Profile'}</div>
                    </div>
                  </Link>
                ) : (
                  <Logo className="w-40 h-14 !object-cover object-center" />
                )}
             </div>
             <button 
               onClick={onClose}
               aria-label={t('close_menu' as any) || (language === 'ar' ? 'إغلاق القائمة' : 'Close menu')}
               className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors text-slate-500 dark:text-slate-400"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Links Section */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <div className="px-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400 dark:text-slate-500">
                {t('menu_navigation' as any) || 'Quick Links'}
              </span>
            </div>
            
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between p-4 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                  style={{ 
                    animation: isOpen ? `slideUp 0.5s ease-out ${index * 0.05}s forwards` : 'none',
                    opacity: 0,
                    transform: 'translateY(10px)'
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gold-500'}`} />
                        <span className="font-medium text-sm lg:text-base">{t(link.label)}</span>
                      </div>
                      {dir === 'ltr' ? (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-1'}`} />
                      ) : (
                        <ChevronLeft className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:-translate-x-1'}`} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* Cart */}
            <NavLink
              to="/checkout"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center justify-between p-4 rounded-xl transition-all duration-300 group
                ${isActive
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <ShoppingCart className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gold-500'}`} />
                    <span className="font-medium text-sm lg:text-base">
                      {language === 'ar' ? 'السلة' : 'Cart'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cartItems.length > 0 && (
                      <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-gold-600' : 'bg-gold-500 text-white'}`}>
                        {cartItems.length}
                      </span>
                    )}
                    {dir === 'ltr' ? (
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-1'}`} />
                    ) : (
                      <ChevronLeft className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:-translate-x-1'}`} />
                    )}
                  </div>
                </>
              )}
            </NavLink>

            {/* Settings Section */}
            <div className="pt-6 px-3 mb-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400 dark:text-slate-500">
                {t('menu_settings' as any) || 'Settings'}
              </span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-between w-full p-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-gold-500" />
                <span className="font-medium text-sm lg:text-base">{language === 'en' ? 'العربية' : 'English'}</span>
              </div>
              <span className="text-[10px] font-bold bg-gold-100 dark:bg-gold-500/20 text-gold-600 px-2 py-0.5 rounded uppercase">
                {language === 'en' ? 'AR' : 'EN'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-500" /> : <Moon className="w-5 h-5 text-gold-500" />}
                <span className="font-medium text-sm lg:text-base">
                  {theme === 'dark' ? (language === 'ar' ? 'الوضع النهاري' : 'Light Mode') : (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
                </span>
              </div>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-3">
             {user ? (
               <button 
                 onClick={handleLogout}
                 className="flex items-center justify-center gap-3 w-full py-4 bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95"
               >
                 <LogOut className="w-5 h-5" />
                 {t('nav_logout' as any) || 'Logout'}
               </button>
             ) : (
               <Link 
                 to="/login"
                 onClick={onClose}
                 className="flex items-center justify-center gap-3 w-full py-4 bg-gold-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-gold-500/20 hover:bg-gold-600 transition-all active:scale-95"
               >
                 <UserIcon className="w-5 h-5" />
                 {t('nav_login' as any) || 'Login'}
               </Link>
             )}
          </div>

        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
