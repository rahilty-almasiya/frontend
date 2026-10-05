
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface CarSpecs {
  engine: string;
  transmission: string;
  fuel: string;
  speed: string; // 0-100 km/h or Max Speed
}
export type TranslationsCar = {
  en: string;
  ar: string;
};
export interface CarCategory {
  id: number;
  name_en: string;
  name_ar: string;
  icon?: string;
}

export interface RoutePrice {
  id: string;
  from_en: string;
  from_ar: string;
  to_en: string;
  to_ar: string;
  price: number;
}

export interface Review {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

export interface Car {
  id: string;
  slug?: string;
  name: string | TranslationsCar;
  category: string | CarCategory | null;
  image: string;
  passengers: number;
  luggage: number;
  pricePerDay?: number;
  driver_price?: number;
  features: string[];
  gallery?: string[];
  descriptionKey?: string;
  specs?: CarSpecs;
  seo_title?: string;
  seo_description?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
  route_prices?: RoutePrice[];
  reviews?: Review[];
  average_rating?: number;
}

export interface Service {
  id: string;
  slug?: string;
  image: string;
  titleKey: string;
  descKey: string;
  price?: number;
  title?: { en: string; ar: string };
  desc?: { en: string; ar: string };
  longDescKey?: string;
  features?: string[];
  gallery?: string[];
  faqs?: { question: string; answer: string }[];
  seo_title?: string;
  seo_description?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
  is_active?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  commentKey: string;
  comment?: { en: string; ar: string };
  rating: number;
  image: string;
}

export interface ContentBlock {
  type: 'paragraph' | 'h2' | 'quote' | 'list' | 'image';
  valueKey?: string; // For text
  value?: { en: string; ar: string }; // For dynamic text
  itemsKeys?: string[]; // For lists
  items?: { en: string; ar: string }[];
  src?: string; // For images
  altKey?: string;
}

export interface BlogCategory {
  id: number;
  name_en: string;
  name_ar: string;
}

export interface BlogPost {
  id: string;
  titleKey: string;
  title?: { en: string; ar: string };
  excerptKey: string;
  excerpt?: { en: string; ar: string };
  date: string;
  image: string;
  category: string | BlogCategory | null;
  author: string;
  readTime: string;
  content?: ContentBlock[] | { en: string; ar: string };
  seo_title?: string;
  seo_description?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
}

export interface Offer {
  id: string;
  slug?: string;
  titleKey: string;
  title?: { en: string; ar: string };
  descKey: string;
  desc?: { en: string; ar: string };
  fullDescKey?: string;
  fullDesc?: { en: string; ar: string };
  discount: string;
  image: string;
  validFrom?: string;
  validUntil: string;
  price?: number;
  originalPrice?: number;
  inclusions?: string[];
  terms?: string[];
  gallery?: string[];
  category?: string;
  seo_title?: string;
  seo_description?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
}

export interface PromoSlide {
  id: string;
  titleKey: string;
  title?: { en: string; ar: string };
  subtitleKey: string;
  subtitle?: { en: string; ar: string };
  image: string;
  ctaKey: string;
}

export interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export interface CompanyStat {
  id: string;
  value: string;
  labelKey: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Faq {
  id: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
  order: number;
}

export interface PaymentMethod {
  PaymentMethodId: number;
  PaymentMethodEn: string;
  PaymentMethodAr: string;
  ImageUrl: string;
}

export interface Destination {
  id: string;
  slug?: string;
  sort_order?: number;
  image: string;
  name: { en: string; ar: string };
  region: { en: string; ar: string };
  desc: { en: string; ar: string };
  longDesc?: { en: string; ar: string };
  highlights?: string[];
  gallery?: string[];
  seo_title?: string;
  seo_description?: string;
  hotels_count?: number;
}

export interface TourPackage {
  id: string;
  destination_id?: string;
  destination?: Destination | null;
  slug?: string;
  sort_order?: number;
  image: string;
  title: { en: string; ar: string };
  price?: number;
  durationDays?: number;
  durationNights?: number;
  desc: { en: string; ar: string };
  longDesc?: { en: string; ar: string };
  includes?: string[];
  itinerary?: { day?: number; title?: string; description?: string }[];
  gallery?: string[];
  seo_title?: string;
  seo_description?: string;
}

export interface Hotel {
  id: string;
  destination_id?: string;
  destination?: Destination | null;
  slug?: string;
  sort_order?: number;
  image: string;
  name: { en: string; ar: string };
  city: { en: string; ar: string };
  address?: string;
  star_rating?: number;
  desc: { en: string; ar: string };
  longDesc?: { en: string; ar: string };
  gallery?: string[];
  rooms?: HotelRoom[];
}

export interface HotelRoom {
  id: string;
  hotel_id: string;
  hotel?: Hotel | null;
  name: { en: string; ar: string };
  desc: { en: string; ar: string };
  capacityAdults?: number;
  capacityChildren?: number;
  pricePerNight: number;
  roomsCount?: number;
  image?: string;
  gallery?: string[];
}

export type CartItemType = 'car' | 'hotel_room' | 'tour_package' | 'flight';

export interface Flight {
  id: string;
  airline: { en: string; ar: string };
  flightNumber: string;
  origin: { en: string; ar: string };
  destination: { en: string; ar: string };
  departureAt: string;
  arrivalAt: string;
  priceEconomy: number;
  priceBusiness?: number;
  seatsAvailable: number;
  seatsRemaining?: number;
  image?: string;
}

export interface CartItem {
  cartId: string;
  type: CartItemType;
  id: string;
  name: string;
  image?: string;
  start_date?: string;
  end_date?: string;
  quantity?: number;
  with_driver?: boolean;
  pickup_location?: string;
  dropoff_location?: string;
  guests_count?: number;
  cabin_class?: 'economy' | 'business';
  unitPrice: number;
  estimatedTotal: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  wallet_balance: number;
  loyalty_points: number;
}
