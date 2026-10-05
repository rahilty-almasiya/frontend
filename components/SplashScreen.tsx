import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Logo from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);
  const { dir } = useLanguage();

  useEffect(() => {
    // Start exit animation
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 2500);

    // Unmount after animation finishes
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearTimeout(unmountTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-opacity duration-700 ease-in-out`}
      style={{ opacity: opacity / 100 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing Gold Glow */}
        <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full animate-pulse"></div>
        
        {/* Logo Container */}
        <div className="relative z-10 mb-8 transform transition-all duration-1000 animate-bounce-slow">
           <Logo className="h-24 md:h-32" />
        </div>

        {/* Text */}
        <div className="text-center space-y-3 relative z-10 animate-slide-up">
           <div className="flex items-center justify-center space-x-3 text-sm text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase mt-4">
              <span className="w-8 h-[1px] bg-gold-500/50"></span>
              <span className='px-1'>{dir === 'rtl' ? 'نقوم بإعداد كل شيء لك...' : 'Setting things up for you...'}</span>
              <span className="w-8 h-[1px] bg-gold-500/50"></span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;