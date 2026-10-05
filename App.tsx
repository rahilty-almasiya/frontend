
import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Loader from './components/Loader';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage'));
const FleetPage = React.lazy(() => import('./pages/FleetPage'));
const CarDetailPage = React.lazy(() => import('./pages/CarDetailPage'));
const DestinationsPage = React.lazy(() => import('./pages/DestinationsPage'));
const DestinationDetailPage = React.lazy(() => import('./pages/DestinationDetailPage'));
const ToursPage = React.lazy(() => import('./pages/ToursPage'));
const TourDetailPage = React.lazy(() => import('./pages/TourDetailPage'));
const HotelsPage = React.lazy(() => import('./pages/HotelsPage'));
const HotelDetailPage = React.lazy(() => import('./pages/HotelDetailPage'));
const FlightsPage = React.lazy(() => import('./pages/FlightsPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OffersPage = React.lazy(() => import('./pages/OffersPage'));
const OfferDetailPage = React.lazy(() => import('./pages/OfferDetailPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = React.lazy(() => import('./pages/BlogDetailPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess'));
const PaymentError = React.lazy(() => import('./pages/PaymentError'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsConditionsPage = React.lazy(() => import('./pages/TermsConditionsPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const CmsPage = React.lazy(() => import('./pages/CmsPage'));

const AppContent: React.FC = () => {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  const basename = firstSegment === 'ar' || firstSegment === 'en' ? `/${firstSegment}` : undefined;
  return (
    <Router basename={basename}>
      <Layout>
        <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><Loader /></div>}>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />

              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />

              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/fleet/:id" element={<CarDetailPage />} />

              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/destinations/:id" element={<DestinationDetailPage />} />

              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tours/:id" element={<TourDetailPage />} />

              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/hotels/category/:category" element={<HotelsPage />} />
              <Route path="/hotels/:id" element={<HotelDetailPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/offers" element={<OffersPage />} />
              <Route path="/offers/:id" element={<OfferDetailPage />} />

              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />

              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-error" element={<PaymentError />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-conditions" element={<TermsConditionsPage />} />
              <Route path="/:slug" element={<CmsPage />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
