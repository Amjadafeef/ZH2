
export type Language = 'en' | 'ar';

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  currency: string;
  volume_ml: number;
  image_url: string;
  is_featured: boolean;
  in_stock: boolean;
}

export interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string; // Short summary for card
  excerpt_ar: string;
  content_en: string; // Full content
  content_ar: string;
  image_url: string; // Main image
  thumbnail_url?: string; // Optional smaller image for grid
  video_url?: string; // Optional YouTube URL
  created_at: string;
  slug?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Feature {
  id: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  icon_key: string; // 'award', 'droplet', 'truck', 'check'
}

export interface Testimonial {
  id: string;
  name_en: string;
  name_ar: string;
  text_en: string;
  text_ar: string;
  location_en: string;
  location_ar: string;
  sort_order: number;
}

export interface FAQItem {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  sort_order: number;
}

export interface SiteContent {
  key: string;
  value_en: string;
  value_ar: string;
}

export interface Translation {
  nav: {
    story: string;
    shop: string;
    philosophy: string;
    journal: string;
    contact: string;
  };
  products: {
    title: string;
    subtitle: string;
    viewDetails: string;
    featured: string;
    soldOut: string;
    loading: string;
    viewShop: string;
    homeTitle: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readMore: string;
    viewAll: string;
    backToBlog: string;
    publishedOn: string;
    latest: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    viewAll: string;
  };
  faq: {
    title: string;
    viewAll: string;
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
  };
  contact: {
    title: string;
    name: string;
    email: string;
    message: string;
    send: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
    contactHeading: string;
  };
}
