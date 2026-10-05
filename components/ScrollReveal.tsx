
import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
  delay?: string; // e.g. '0ms', '100ms'
  duration?: string; // e.g. '700ms'
  threshold?: number;
  width?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = '', 
  animation = 'fade-up', 
  delay = '0ms', 
  duration = '1000ms',
  threshold = 0.1,
  width = 'w-full'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger once
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0 pointer-events-none'; 
    
    switch (animation) {
      case 'fade-up': return 'opacity-100 translate-y-0';
      case 'fade-in': return 'opacity-100';
      case 'slide-left': return 'opacity-100 translate-x-0';
      case 'slide-right': return 'opacity-100 translate-x-0';
      case 'zoom-in': return 'opacity-100 scale-100';
      default: return 'opacity-100 translate-y-0';
    }
  };

  const getInitialClass = () => {
     switch (animation) {
      case 'fade-up': return 'translate-y-12';
      case 'fade-in': return '';
      case 'slide-left': return '-translate-x-12';
      case 'slide-right': return 'translate-x-12';
      case 'zoom-in': return 'scale-95';
      default: return 'translate-y-12';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`${width} transition-all ease-out will-change-transform ${getAnimationClass()} ${!isVisible ? getInitialClass() : ''} ${className}`}
      style={{ transitionDuration: duration, transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
