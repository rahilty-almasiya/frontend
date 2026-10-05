import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, Car, FileText, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import NavigationDrawer from './NavigationDrawer';

const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'nav_home', icon: Home },
    { path: '/services', label: 'nav_services', icon: Briefcase },
    { path: '/fleet', label: 'nav_fleet', icon: Car },
    { path: '/blog', label: 'nav_blog', icon: FileText },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.4)] transition-all duration-300">
        <div className="flex justify-around items-center h-[76px] px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 group tap-highlight-transparent`}
              >
                <div 
                  className={`relative p-2.5 rounded-2xl transition-all duration-500 ease-out flex items-center justify-center ${
                    isActive 
                      ? 'text-gold-600 dark:text-gold-400 bg-gold-500/10 dark:bg-gold-500/20' 
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-gold-500'
                  }`}
                >
                  <Icon 
                    className={`w-6 h-6 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {isActive && (
                     <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(184,146,64,0.5)] ring-2 ring-white dark:ring-slate-950"></span>
                  )}
                </div>
                
                <span 
                  className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive 
                      ? 'text-slate-900 dark:text-white scale-105' 
                      : 'text-slate-400 opacity-70'
                  }`}
                >
                  {t(item.label as any)}
                </span>
              </NavLink>
            );
          })}

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 group tap-highlight-transparent`}
          >
            <div 
              className={`relative p-2.5 rounded-2xl transition-all duration-500 ease-out flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-gold-500 bg-transparent`}
            >
              <Menu 
                className={`w-6 h-6 transition-all duration-500 group-hover:scale-110`} 
                strokeWidth={2}
              />
            </div>
            
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-70 transition-all duration-300 group-hover:text-gold-500">
              {t('nav_menu' as any) || 'Menu'}
            </span>
          </button>
        </div>
      </div>

      <NavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MobileBottomNav;