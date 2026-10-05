import React, { Suspense, useEffect } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import DeferredRender from '../components/DeferredRender';

const AboutSection = React.lazy(() => import('../components/AboutSection'));
const FleetSection = React.lazy(() => import('../components/FleetSection'));
const DestinationsSection = React.lazy(() => import('../components/DestinationsSection'));
const OffersSection = React.lazy(() => import('../components/OffersSection'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const BlogSection = React.lazy(() => import('../components/BlogSection'));
const PartnersSection = React.lazy(() => import('../components/PartnersSection'));
const FaqSection = React.lazy(() => import('../components/FaqSection'));

const sectionFallback = <div className="min-h-48 animate-pulse bg-slate-100/40 dark:bg-slate-900/20" />;

const Home: React.FC = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in relative">
      <SEO
        title={t('nav_home')}
        description={t('hero_subtitle')}
      />
      <Hero />

      {/* 1. Latest Services Section */}
      <Services />

      {/* 2. Latest Fleet Section */}
      <DeferredRender minHeight={520}>
        <Suspense fallback={sectionFallback}>
          <FleetSection limit={4} />
        </Suspense>
      </DeferredRender>

      <DeferredRender minHeight={500}>
        <Suspense fallback={sectionFallback}>
          <AboutSection />
        </Suspense>
      </DeferredRender>

      <DeferredRender minHeight={480}>
        <Suspense fallback={sectionFallback}>
          <DestinationsSection limit={4} />
        </Suspense>
      </DeferredRender>

      <DeferredRender minHeight={480}>
        <Suspense fallback={sectionFallback}>
          <OffersSection />
        </Suspense>
      </DeferredRender>

      {/* 3. Latest Articles Section */}
      <DeferredRender minHeight={480}>
        <Suspense fallback={sectionFallback}>
          <BlogSection limit={4} />
        </Suspense>
      </DeferredRender>

      {/* 4. Partners Section */}
      <DeferredRender minHeight={240}>
        <Suspense fallback={sectionFallback}>
          <PartnersSection />
        </Suspense>
      </DeferredRender>

      <DeferredRender minHeight={400}>
        <Suspense fallback={sectionFallback}>
          <FaqSection />
        </Suspense>
      </DeferredRender>

      <DeferredRender minHeight={420}>
        <Suspense fallback={sectionFallback}>
          <Testimonials />
        </Suspense>
      </DeferredRender>
    </div>
  );
};

export default Home;
