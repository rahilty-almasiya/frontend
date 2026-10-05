
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, User as UserIcon, ShoppingCart, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
// import Logo from './Logo';


const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isWhatsAppMenuOpen, setIsWhatsAppMenuOpen] = useState(false);
  const { t, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const location = useLocation();

  // Check if we are on Home Page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Primary links stay visible at all times; secondary ones collapse into "More"
  // so the bar doesn't overflow now that Hotels/Flights were added.
  const navLinks = [
    { path: '/', label: 'nav_home' },
    { path: '/fleet', label: 'nav_fleet' },
    { path: '/hotels', label: 'nav_hotels' },
    { path: '/flights', label: 'nav_flights' },
    { path: '/tours', label: 'nav_tours' },
    { path: '/destinations', label: 'nav_destinations' },
    { path: '/offers', label: 'nav_offers' },
  ];

  const moreLinks = [
    { path: '/services', label: 'nav_services' },
    { path: '/about', label: 'nav_about' },
    { path: '/blog', label: 'nav_blog' },
    { path: '/contact', label: 'nav_contact' },
  ];

  const isMoreActive = moreLinks.some(link => location.pathname.startsWith(link.path));

  // Define styles based on page context and scroll state
  const getNavbarStyles = () => {
    if (isScrolled || !isHomePage) {
      return 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg py-3 border-b border-slate-200/50 dark:border-slate-800/50';
    }
    return 'bg-transparent py-6 border-b border-transparent';
  };

  const navbarClasses = getNavbarStyles();

  // Text colors for links
  const getLinkClasses = (isActive: boolean) => {
    if (isActive) {
      return 'text-gold-500 dark:text-gold-400 font-bold';
    }
    if (isScrolled || !isHomePage) {
      return 'text-slate-600 dark:text-slate-300 hover:text-gold-500 dark:hover:text-gold-400';
    }
    return 'text-white/90 hover:text-white hover:drop-shadow-md';
  };

  return (
    <nav
      className={`hidden md:block fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${navbarClasses}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center justify-center group relative z-50 flex-shrink-0 w-44 lg:w-52 h-20 lg:h-24 overflow-visible transition-transform duration-300 hover:scale-105">
            <picture className="contents">
              <source srcSet="/assets/logo-512.webp" type="image/webp" />
              <img src="/assets/logo.png" alt="Logo" className="w-full h-16 lg:h-20 object-cover object-[center_55%]" />
            </picture>
            <div className="-mt-2 text-center leading-tight text-gold-500 transition-colors">
              <div className="text-[9px] lg:text-[10px] font-medium">{t('license_label')} {t('license_number')}</div>
            </div>
          </Link>

          {/* Desktop/Tablet Navigation */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-3 lg:gap-5 px-2 lg:px-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) => `
                    relative text-xs lg:text-sm font-medium transition-all duration-300 py-2 whitespace-nowrap
                    ${getLinkClasses(isActive)}
                    group
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{t(link.label)}</span>
                      {/* Hover Underline */}
                      <span className={`
                        absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 transform origin-left transition-transform duration-300 ease-out
                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                      `} />
                      {/* Glow effect on hover */}
                      <span className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-lg scale-0 group-hover:scale-110 transition-transform duration-300 opacity-0 group-hover:opacity-100 -z-10"></span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* More dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsMoreOpen(true)}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(open => !open)}
                  aria-expanded={isMoreOpen}
                  aria-haspopup="menu"
                  className={`relative flex items-center gap-1 text-xs lg:text-sm font-medium transition-all duration-300 py-2 whitespace-nowrap group ${isMoreActive ? 'text-gold-500 dark:text-gold-400 font-bold' : getLinkClasses(false)}`}
                >
                  <span className="relative z-10">{language === 'ar' ? 'المزيد' : 'More'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                  <span className={`
                    absolute bottom-0 left-0 w-full h-0.5 bg-gold-500 transform origin-left transition-transform duration-300 ease-out
                    ${isMoreActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                  `} />
                </button>

                <div
                  role="menu"
                  className={`absolute top-full ltr:right-0 rtl:left-0 w-48 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-200 origin-top ${isMoreOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                  {moreLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={({ isActive }) => `block px-4 py-3 text-sm font-medium transition-colors ${isActive
                        ? 'bg-gold-500 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gold-500'
                        }`}
                    >
                      {t(link.label)}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Divider */}
            <div className={`h-6 w-px mx-2 lg:mx-4 transition-colors duration-500 ${isScrolled ? 'bg-slate-300 dark:bg-slate-700' : 'bg-white/20'}`}></div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${(isScrolled || !isHomePage)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gold-500 hover:text-white'
                  : 'bg-white/10 text-white hover:bg-gold-500 hover:text-white backdrop-blur-sm shadow-sm'
                  }`}
                aria-label="Toggle Language"
              >
                <span className="text-[10px] lg:text-xs font-bold">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${(isScrolled || !isHomePage)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gold-500 hover:text-white'
                  : 'bg-white/10 text-white hover:bg-gold-500 hover:text-white backdrop-blur-sm shadow-sm'
                  }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3 h-3 lg:w-4 lg:h-4" /> : <Moon className="w-3 h-3 lg:w-4 lg:h-4" />}
              </button>

              <Link
                to="/checkout"
                className={`relative flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${(isScrolled || !isHomePage)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gold-500 hover:text-white'
                  : 'bg-white/10 text-white hover:bg-gold-500 hover:text-white backdrop-blur-sm shadow-sm'
                  }`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-3 h-3 lg:w-4 lg:h-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-gold-500 text-white text-[9px] font-bold shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                to={user ? "/profile" : "/login"}
                className={`flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${(isScrolled || !isHomePage)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gold-500 hover:text-white'
                  : 'bg-white/10 text-white hover:bg-gold-500 hover:text-white backdrop-blur-sm shadow-sm'
                  } overflow-hidden`}
                aria-label="Profile"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                )}
              </Link>

              {t('payment_gateway_enabled') === 'true' ? (
                <Link
                  to="/booking"
                  state={location.pathname.startsWith('/fleet/') ? { carId: location.pathname.split('/').pop() } : undefined}
                  className="hidden lg:inline-block px-6 py-2.5 bg-gold-500 text-white text-xs lg:text-sm font-bold rounded-full shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap overflow-hidden relative group"
                >
                  <span className="relative z-10">{t('nav_book')}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
              ) : (
                <div className="relative hidden lg:block">
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppMenuOpen(open => !open)}
                    aria-expanded={isWhatsAppMenuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs lg:text-sm font-bold rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap overflow-hidden relative group"
                  >
                    <span className="relative z-10">{t('btn_book_whatsapp')}</span>
                    <ChevronDown className={`relative z-10 h-4 w-4 transition-transform ${isWhatsAppMenuOpen ? 'rotate-180' : ''}`} />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>

                  <div
                    role="menu"
                    className={`absolute top-full mt-3 ltr:right-0 rtl:left-0 w-64 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 ${
                      isWhatsAppMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 pointer-events-none'
                    }`}
                  >
                    <p className="px-3 py-2 text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'اختر القسم للحجز' : 'Choose a department'}
                    </p>
                    <a
                      role="menuitem"
                      href={`https://wa.me/${t('contact_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        language === 'ar' ? 'مرحبًا، أريد حجز سيارة أو خدمة نقل' : 'Hello, I would like to book a car or transport service'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsWhatsAppMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    >
                      <span className="text-xl">🚘</span>
                      {language === 'ar' ? 'السيارات وخدمات النقل' : 'Cars & Transport'}
                    </a>
                    <a
                      role="menuitem"
                      href={`https://wa.me/${t('contact_tourism_whatsapp')?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        language === 'ar' ? 'مرحبًا، أريد حجز فندق أو خدمة سياحية' : 'Hello, I would like to book a hotel or tourism service'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsWhatsAppMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 dark:text-slate-200 dark:hover:bg-green-500/10 dark:hover:text-green-400"
                    >
                      <span className="text-xl">🏨</span>
                      {language === 'ar' ? 'الفنادق والسياحة' : 'Hotels & Tourism'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
