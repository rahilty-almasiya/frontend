
import React from 'react';
import Navbar from './Navbar';
import MobileTopBar from './MobileTopBar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import WhatsAppButton from './WhatsAppButton';
import AnimatedBackground from './AnimatedBackground';
import { Toaster } from 'sonner';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300 font-sans">

      {/* Global Animated Background */}
      <AnimatedBackground />
      <Toaster position="bottom-right" richColors />

      {/* Desktop/Tablet Navbar */}
      <Navbar />

      {/* Mobile Top Bar (Logo + Settings only) */}
      <MobileTopBar />

      {/* Main Content Area */}
      {/* z-10 ensures content sits above the animated background */}
      <main className="flex-grow w-full relative z-10 pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <div className="pb-24 md:pb-0 relative z-10">
        <Footer />
      </div>

      {/* Floating Action Button */}
      <WhatsAppButton />

      {/* Mobile Navigation - Fixed Bottom */}
      <MobileBottomNav />

    </div>
  );
};

export default Layout;
