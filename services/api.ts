import axios from 'axios';
import { Car, Service, BlogPost, Offer, Testimonial, PromoSlide, Translations, Faq, Review, Destination, TourPackage, Hotel, HotelRoom, Flight, CartItem } from '../types';
import { TRANSLATIONS } from '../constants'; // Fallback

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apiv2.rahilatialmasiya.com/public/api';
const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_BASE_URL || 'https://apiv2.rahilatialmasiya.com/public/';
const PUBLIC_CACHE_TTL = 5 * 60 * 1000;

type CachedRequest = {
  expiresAt: number;
  request: Promise<any>;
};

const publicRequestCache = new Map<string, CachedRequest>();

/**
 * Shares in-flight public GET requests and keeps their result briefly in
 * memory. Navigating between a listing and its details no longer downloads the
 * same large collection repeatedly.
 */
const cachedGet = (url: string, config?: any, ttl = PUBLIC_CACHE_TTL) => {
  const cacheKey = `${url}:${JSON.stringify(config?.params || {})}`;
  const now = Date.now();
  const cached = publicRequestCache.get(cacheKey);

  if (cached && cached.expiresAt > now) return cached.request;

  const request = axios.get(url, config).catch((error) => {
    publicRequestCache.delete(cacheKey);
    throw error;
  });

  publicRequestCache.set(cacheKey, { expiresAt: now + ttl, request });
  return request;
};

axios.interceptors.request.use((config) => {
  // localStorage can throw in some crawler/sandboxed rendering contexts (e.g. Googlebot);
  // letting that exception escape here would fail every axios request app-wide, including
  // unrelated public GETs that have nothing to do with auth.
  try {
    const token = localStorage.getItem('customer_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // no-op: proceed unauthenticated
  }
  return config;
});

// Helper to transform DB data to Frontend types
export const transformImage = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) {
    // Laravel's local dev server exposes files from public/ at the domain root.
    return path.replace(/^(https?:\/\/(?:localhost|127\.0\.0\.1):8000)\/public\//, '$1/');
  }
  const baseUrl = STORAGE_BASE_URL.endsWith('/') ? STORAGE_BASE_URL : `${STORAGE_BASE_URL}/`;
  return `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
};

const transformLocale = (item: any, key: string) => ({
  en: item[`${key}_en`] || '',
  ar: item[`${key}_ar`] || '',
});

const transformHotel = (item: any): Hotel => ({
  ...item,
  id: item.id.toString(),
  destination_id: item.destination_id ? item.destination_id.toString() : undefined,
  destination: item.destination ? {
    ...item.destination,
    id: item.destination.id.toString(),
    image: transformImage(item.destination.image),
    name: transformLocale(item.destination, 'name'),
    region: transformLocale(item.destination, 'region'),
    desc: transformLocale(item.destination, 'desc'),
  } : null,
  image: transformImage(item.image),
  name: transformLocale(item, 'name'),
  city: transformLocale(item, 'city'),
  desc: transformLocale(item, 'desc'),
  longDesc: transformLocale(item, 'long_desc'),
  gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
});

export const api = {
  getSettings: async (): Promise<Translations> => {
    try {
      const [settingsRes, transRes] = await Promise.all([
        cachedGet(`${API_BASE_URL}/settings`, undefined, 15 * 60 * 1000),
        cachedGet(`${API_BASE_URL}/translations/fetch`, undefined, 15 * 60 * 1000) // This should return { [key]: { en, ar } }
      ]);

      const translations: Translations = { ...TRANSLATIONS };

      // Merge Settings
      const settingsArr = settingsRes.data;
      if (Array.isArray(settingsArr)) {
        settingsArr.forEach((s: any) => {
          translations[s.key] = {
            en: s.value_en || '',
            ar: s.value_ar || ''
          };
        });
      }

      // Merge Dynamic Translations
      const dynamicTrans = transRes.data;
      Object.keys(dynamicTrans).forEach(key => {
        translations[key] = dynamicTrans[key];
      });

      return translations;
    } catch (error) {
      console.error("Failed to fetch settings/translations", error);
      return TRANSLATIONS;
    }
  },

  getServices: async (): Promise<Service[]> => {
    const response = await cachedGet(`${API_BASE_URL}/services?all=1`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image_url || item.image),
      price: item.price ? Number(item.price) : undefined,
      titleKey: '', // Handled dynamically in components or we map title directly?
      // The frontend uses titleKey to look up TRANSLATIONS. 
      // BUT now we have dynamic data. We should probably adjust the frontend types to accept direct strings OR use a hack.
      // Better approach: The component expects `titleKey`. If we provide a key that exists in fetched translations, it works.
      // But wait, the dynamic services don't have static keys in `constants.ts`. 
      // We should map the DB content TO the structure the frontend expects.
      // Actually, looking at `types.ts`, `name` in `Car` is `string | TranslationsCar`.
      // `Service` has `titleKey`.

      // CRITICAL: The frontend components rely heavily on `t(key)`. 
      // If I return `titleKey: 'service_1_title'`, I must ensure `service_1_title` exists in the translations I fetched.
      // BUT `Service` DB doesn't have a unique key for translation. It has raw English/Arabic text.

      // Strategy:
      // 1. We are fetching `getSettings` which populates the language context.
      // 2. For resource lists (services, cars), the DB has the text.
      // 3. We should modify the frontend components to handle Data objects that contain the text directly, OR we modify relevant components to check if `titleKey` is actually an object or string?
      // `Service` type says `titleKey: string`.

      // Let's modify the `Service` type in `types.ts` to allow `title: {en, ar}`?
      // Or easier: 
      // We return a "fake" key, and we inject the translation into the fetched translations.
      // OR better: The DB architecture seems to have moved away from keys to storing values `title_en`, `title_ar`.
      // The Frontend expects keys.
      // I should update `types.ts` to allow direct values, OR update the components.
      // Let's update `types.ts` to make `titleKey` optional and add `title?: {en: string, ar: string}`.
      // Then update components to use `title ? (lang === 'ar' ? title.ar : title.en) : t(titleKey)`.

      // For now, let's just return the raw data and handle type fixes next.
      // I will attach the raw en/ar values.
      title: transformLocale(item, 'title'),
      desc: transformLocale(item, 'desc'),
      features: item.features || [],
      gallery: (item.gallery || []).map(transformImage)
    }));
  },

  getServiceById: async (id: string): Promise<Service | undefined> => {
    const services = await api.getServices();
    return services.find(s => s.id === id || s.slug === id);
  },

  getFleet: async (category?: string): Promise<Car[]> => {
    const response = await cachedGet(`${API_BASE_URL}/cars?all=1`);
    let data = response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image),
      name: transformLocale(item, 'name'),
      description: transformLocale(item, 'description'),
      features: item.features || [],
      gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
      pricePerDay: item.price_per_day ? Number(item.price_per_day) : (item.price ? Number(item.price) : undefined),
      // Flatten category object to string if it matches the expected structure
      category: (item.category && typeof item.category === 'object') ? item.category.name_en : item.category,
      // specs mapping if needed
    }));

    if (category && category !== 'All') {
      data = data.filter((car: Car) => car.category === category);
    }
    return data;
  },

  getCarById: async (id: string): Promise<Car | undefined> => {
    const fleet = await api.getFleet();
    return fleet.find(c => c.id === id || c.slug === id);
  },

  getCarCategories: async (): Promise<any[]> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/car-categories`);
      return response.data;
    } catch { return []; }
  },

  getBlogCategories: async (): Promise<any[]> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/blog-categories`);
      return response.data;
    } catch { return []; }
  },

  getTestimonials: async (): Promise<Testimonial[]> => {
    const response = await cachedGet(`${API_BASE_URL}/testimonials?all=1`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image),
      comment: transformLocale(item, 'comment'),
    }));
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    const response = await cachedGet(`${API_BASE_URL}/posts?all=1`); // Assuming /posts from earlier reading of api.php
    return response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      title: transformLocale(item, 'title'),
      excerpt: transformLocale(item, 'excerpt'),
      image: transformImage(item.image),
      // Flatten category object to string if it matches the expected structure
      category: (item.category && typeof item.category === 'object') ? item.category.name_en : item.category,
      content: transformLocale(item, 'content'),
      // content handling is complex, for now returning as is?
    }));
  },

  getBlogPostById: async (id: string): Promise<BlogPost | undefined> => {
    const posts = await api.getBlogPosts();
    return posts.find(p => p.id === id);
  },

  getOffers: async (): Promise<Offer[]> => {
    const response = await cachedGet(`${API_BASE_URL}/offers?all=1`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image_url || item.image),
      title: transformLocale(item, 'title'),
      desc: transformLocale(item, 'desc'),
      fullDesc: transformLocale(item, 'full_desc'),
      validFrom: item.valid_from || item.start_date || item.from_date || '',
      validUntil: item.valid_until || item.end_date || item.to_date || '',
      gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
      price: item.price ? Number(item.price) : undefined,
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      is_active: Boolean(item.is_active),
    }));
  },

  getOfferById: async (id: string): Promise<Offer | undefined> => {
    const offers = await api.getOffers();
    return offers.find(o => o.id === id || o.slug === id);
  },

  getPromoSlides: async (): Promise<PromoSlide[]> => {
    const response = await cachedGet(`${API_BASE_URL}/promo-slides?all=1`);
    return response.data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image),
      title: transformLocale(item, 'title'),
      subtitle: transformLocale(item, 'subtitle'),
      ctaKey: item.cta_key
    }));
  },

  getTeam: async () => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/team-members?all=1`);
      return response.data.map((item: any) => ({
        ...item,
        image: transformImage(item.image)
      }));
    } catch (e) { return []; }
  },

  getStats: async () => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/company-stats`);
      return response.data;
    } catch (e) { return []; }
  },

  getPartners: async () => {
    const response = await cachedGet(`${API_BASE_URL}/partners?all=1`);
    return response.data.map((item: any) => ({
      ...item,
      logo: transformImage(item.logo)
    }));
  },

  getFaqs: async (): Promise<Faq[]> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/faqs?all=1`);
      return response.data.map((item: any) => ({
        id: item.id.toString(),
        question: transformLocale(item, 'question'),
        answer: transformLocale(item, 'answer'),
        order: item.order
      }));
    } catch { return []; }
  },

  createBooking: async (data: any) => {
    return await axios.post(`${API_BASE_URL}/bookings`, data);
  },

  getBookingReceipt: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/bookings/${id}/receipt`);
    return response.data;
  },

  getPaymentMethods: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-methods`);
      return response.data;
    } catch { return []; }
  },

  // Newsletter
  subscribeNewsletter: async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscribers`, { email });
      return response.data;
    } catch (error) {
      console.error("Newsletter Subscription failed", error);
      throw error;
    }
  },

  initiatePayment: async (bookingId: string, paymentMethodId?: number) => {
    const response = await axios.post(`${API_BASE_URL}/payments/initiate`, {
      booking_id: bookingId,
      payment_method_id: paymentMethodId
    });
    return response.data;
  },

  sendContactMessage: async (data: any) => {
    return await axios.post(`${API_BASE_URL}/contact`, data);
  },

  // Customer Auth
  registerCustomer: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/customer/register`, data);
    return response.data;
  },
  verifyEmail: async (data: { email: string, otp: string }) => {
    const response = await axios.post(`${API_BASE_URL}/customer/verify-email`, data);
    return response.data;
  },
  resendVerificationOtp: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/customer/resend-verification`, { email });
    return response.data;
  },
  loginCustomer: async (credentials: any) => {
    const response = await axios.post(`${API_BASE_URL}/customer/login`, credentials);
    return response.data;
  },
  logoutCustomer: async () => {
    const response = await axios.post(`${API_BASE_URL}/customer/logout`);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/customer/forgot-password`, { email });
    return response.data;
  },
  resetPassword: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/customer/reset-password`, data);
    return response.data;
  },
  getCustomerProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/customer/user`);
    const userData = response.data;
    if (userData.avatar) {
      userData.avatar = transformImage(userData.avatar);
    }
    return userData;
  },
  updateCustomerProfile: async (data: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/customer/profile`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const userData = response.data.user;
    if (userData.avatar) {
      userData.avatar = transformImage(userData.avatar);
    }
    return userData;
  },
  updateCustomerPassword: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/customer/password`, data);
    return response.data;
  },
  getCustomerBookings: async () => {
    const response = await axios.get(`${API_BASE_URL}/customer/my-bookings`);
    return response.data;
  },
  getCustomerOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/customer/my-orders`);
    return response.data;
  },
  cancelOrder: async (orderId: number) => {
    const response = await axios.post(`${API_BASE_URL}/customer/orders/${orderId}/cancel`);
    return response.data;
  },
  getCarReviews: async (carId: string, page = 1): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/cars/${carId}/reviews?page=${page}`);
    return response.data;
  },
  getReviewsFor: async (type: 'hotel' | 'tour_package', id: string, page = 1): Promise<any> => {
    const response = await axios.get(`${API_BASE_URL}/reviews/${type}/${id}?page=${page}`);
    return response.data;
  },
  submitReview: async (data: {
    car_id?: string; rating: number; comment: string; booking_id?: string;
    reviewable_type?: 'car' | 'hotel' | 'tour_package'; reviewable_id?: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/customer/reviews`, data);
    return response.data;
  },
  validatePromoCode: async (code: string) => {
    const response = await axios.post(`${API_BASE_URL}/promo-codes/validate`, { code });
    return response.data;
  },
  getPageBySlug: async (slug: string) => {
    const response = await axios.get(`${API_BASE_URL}/pages/${slug}`);
    return response.data;
  },

  getDestinations: async (): Promise<Destination[]> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/destinations?all=1`);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        image: transformImage(item.image),
        name: transformLocale(item, 'name'),
        region: transformLocale(item, 'region'),
        desc: transformLocale(item, 'desc'),
        longDesc: transformLocale(item, 'long_desc'),
        highlights: item.highlights || [],
        gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
        seo_title: item.meta_title_en || item.meta_title_ar ? (transformLocale(item, 'meta_title') as any) : undefined,
        seo_description: item.meta_description_en,
      }));
    } catch (error) {
      console.error('Failed to fetch destinations', error);
      return [];
    }
  },

  getDestinationById: async (id: string): Promise<Destination | undefined> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/destinations/${id}`);
      const item = response.data.data || response.data;
      return {
        ...item,
        id: item.id.toString(),
        image: transformImage(item.image),
        name: transformLocale(item, 'name'),
        region: transformLocale(item, 'region'),
        desc: transformLocale(item, 'desc'),
        longDesc: transformLocale(item, 'long_desc'),
        highlights: item.highlights || [],
        gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
      };
    } catch (error) {
      console.error('Failed to fetch destination', error);
      return undefined;
    }
  },

  getTourPackages: async (destinationId?: string): Promise<TourPackage[]> => {
    try {
      const url = destinationId
        ? `${API_BASE_URL}/tour-packages?all=1&destination_id=${destinationId}`
        : `${API_BASE_URL}/tour-packages?all=1`;
      const response = await cachedGet(url);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        destination_id: item.destination_id ? item.destination_id.toString() : undefined,
        destination: item.destination ? {
          ...item.destination,
          id: item.destination.id.toString(),
          image: transformImage(item.destination.image),
          name: transformLocale(item.destination, 'name'),
          region: transformLocale(item.destination, 'region'),
          desc: transformLocale(item.destination, 'desc'),
        } : null,
        image: transformImage(item.image),
        title: transformLocale(item, 'title'),
        desc: transformLocale(item, 'desc'),
        longDesc: transformLocale(item, 'long_desc'),
        price: item.price ? Number(item.price) : undefined,
        durationDays: item.duration_days ? Number(item.duration_days) : undefined,
        durationNights: item.duration_nights ? Number(item.duration_nights) : undefined,
        includes: item.includes || [],
        itinerary: item.itinerary || [],
        gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
      }));
    } catch (error) {
      console.error('Failed to fetch tour packages', error);
      return [];
    }
  },

  getTourPackageById: async (id: string): Promise<TourPackage | undefined> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/tour-packages/${id}`);
      const item = response.data.data || response.data;
      return {
        ...item,
        id: item.id.toString(),
        destination_id: item.destination_id ? item.destination_id.toString() : undefined,
        destination: item.destination ? {
          ...item.destination,
          id: item.destination.id.toString(),
          image: transformImage(item.destination.image),
          name: transformLocale(item.destination, 'name'),
          region: transformLocale(item.destination, 'region'),
          desc: transformLocale(item.destination, 'desc'),
        } : null,
        image: transformImage(item.image),
        title: transformLocale(item, 'title'),
        desc: transformLocale(item, 'desc'),
        longDesc: transformLocale(item, 'long_desc'),
        price: item.price ? Number(item.price) : undefined,
        durationDays: item.duration_days ? Number(item.duration_days) : undefined,
        durationNights: item.duration_nights ? Number(item.duration_nights) : undefined,
        includes: item.includes || [],
        itinerary: item.itinerary || [],
        gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
      };
    } catch (error) {
      console.error('Failed to fetch tour package', error);
      return undefined;
    }
  },

  getHotels: async (destinationId?: string): Promise<Hotel[]> => {
    try {
      const url = destinationId
        ? `${API_BASE_URL}/hotels?all=1&destination_id=${destinationId}`
        : `${API_BASE_URL}/hotels?all=1`;
      const response = await cachedGet(url);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      return data.map(transformHotel);
    } catch (error) {
      console.error('Failed to fetch hotels', error);
      return [];
    }
  },

  getHotelCategories: async (): Promise<Destination[]> => {
    const response = await cachedGet(`${API_BASE_URL}/hotel-categories`);
    const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
    return data.map((item: any) => ({
      ...item,
      id: item.id.toString(),
      image: transformImage(item.image),
      name: transformLocale(item, 'name'),
      region: transformLocale(item, 'region'),
      desc: transformLocale(item, 'desc'),
      hotels_count: Number(item.hotels_count || 0),
    }));
  },

  getHotelsByCategory: async (category: string): Promise<{ category: Destination; hotels: Hotel[] }> => {
    const response = await cachedGet(`${API_BASE_URL}/hotel-categories/${encodeURIComponent(category)}/hotels`, {
      params: { per_page: 100 },
    });
    const categoryItem = response.data.category;
    const hotelData = response.data.hotels?.data || response.data.hotels || [];
    return {
      category: {
        ...categoryItem,
        id: categoryItem.id.toString(),
        image: transformImage(categoryItem.image),
        name: transformLocale(categoryItem, 'name'),
        region: transformLocale(categoryItem, 'region'),
        desc: transformLocale(categoryItem, 'desc'),
      },
      hotels: hotelData.map(transformHotel),
    };
  },

  getHotelById: async (id: string): Promise<Hotel | undefined> => {
    try {
      const response = await cachedGet(`${API_BASE_URL}/hotels/${id}`);
      const item = response.data.data || response.data;
      return {
        ...item,
        id: item.id.toString(),
        destination_id: item.destination_id ? item.destination_id.toString() : undefined,
        destination: item.destination ? {
          ...item.destination,
          id: item.destination.id.toString(),
          image: transformImage(item.destination.image),
          name: transformLocale(item.destination, 'name'),
          region: transformLocale(item.destination, 'region'),
          desc: transformLocale(item.destination, 'desc'),
        } : null,
        image: transformImage(item.image),
        name: transformLocale(item, 'name'),
        city: transformLocale(item, 'city'),
        desc: transformLocale(item, 'desc'),
        longDesc: transformLocale(item, 'long_desc'),
        gallery: (item.gallery_urls || item.gallery || []).map(transformImage),
        rooms: (item.rooms || []).map((room: any) => ({
          ...room,
          id: room.id.toString(),
          hotel_id: room.hotel_id.toString(),
          name: transformLocale(room, 'name'),
          desc: transformLocale(room, 'desc'),
          capacityAdults: room.capacity_adults,
          capacityChildren: room.capacity_children,
          pricePerNight: Number(room.price_per_night),
          roomsCount: room.rooms_count,
          image: room.image_url || transformImage(room.image),
          gallery: (room.gallery_urls || room.gallery || []).map(transformImage),
        })),
      };
    } catch (error) {
      console.error('Failed to fetch hotel', error);
      return undefined;
    }
  },

  checkRoomAvailability: async (roomId: string, startDate: string, endDate: string) => {
    const response = await axios.get(`${API_BASE_URL}/hotel-rooms/${roomId}/availability`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data as { available: boolean; rooms_count: number; booked_count: number };
  },

  getRoomPriceQuote: async (roomId: string, startDate: string, endDate: string) => {
    const response = await axios.get(`${API_BASE_URL}/hotel-rooms/${roomId}/price-quote`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data as {
      nights: number; total_price: number; average_price_per_night: number;
      base_price_per_night: number; has_seasonal_pricing: boolean;
    };
  },

  // Cart / Orders (multi-item checkout)
  createOrder: async (data: {
    name: string; email: string; phone: string; notes?: string; promo_code?: string; payment_method?: string;
    payment_plan?: 'full' | 'deposit';
    items: CartItem[];
  }) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      notes: data.notes,
      promo_code: data.promo_code,
      payment_method: data.payment_method,
      payment_plan: data.payment_plan,
      items: data.items.map(item => ({
        type: item.type,
        id: Number(item.id),
        start_date: item.start_date,
        end_date: item.end_date,
        quantity: item.quantity,
        with_driver: item.with_driver,
        pickup_location: item.pickup_location,
        dropoff_location: item.dropoff_location,
        guests_count: item.guests_count,
        cabin_class: item.cabin_class,
      })),
    };
    const response = await axios.post(`${API_BASE_URL}/orders`, payload);
    return response.data;
  },

  getOrderReceipt: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}/receipt`);
    return response.data;
  },

  initiateOrderPayment: async (orderId: string, paymentMethodId?: number) => {
    const response = await axios.post(`${API_BASE_URL}/payments/initiate`, {
      order_id: orderId,
      payment_method_id: paymentMethodId
    });
    return response.data;
  },

  getFlights: async (filters?: { origin?: string; destination?: string; date?: string }): Promise<Flight[]> => {
    try {
      const params = new URLSearchParams({ all: '1' });
      if (filters?.origin) params.append('origin', filters.origin);
      if (filters?.destination) params.append('destination', filters.destination);
      if (filters?.date) params.append('date', filters.date);

      const response = await cachedGet(`${API_BASE_URL}/flights?${params.toString()}`);
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      return data.map((item: any) => ({
        id: item.id.toString(),
        airline: transformLocale(item, 'airline'),
        flightNumber: item.flight_number,
        origin: transformLocale(item, 'origin'),
        destination: transformLocale(item, 'destination'),
        departureAt: item.departure_at,
        arrivalAt: item.arrival_at,
        priceEconomy: Number(item.price_economy),
        priceBusiness: item.price_business ? Number(item.price_business) : undefined,
        seatsAvailable: item.seats_available,
        seatsRemaining: item.seats_remaining,
        image: item.image_url ? transformImage(item.image_url) : undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch flights', error);
      return [];
    }
  }
};
