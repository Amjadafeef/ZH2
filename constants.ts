
import { Translation } from './types';

export const translations: Record<'en' | 'ar', Translation> = {
  en: {
    nav: {
      story: 'Story',
      shop: 'Shop',
      philosophy: 'Philosophy',
      journal: 'Journal',
      contact: 'Contact',
    },
    products: {
      title: 'Shop All Products',
      subtitle: 'Pure & Organic',
      homeTitle: 'Featured Collection',
      viewDetails: 'Add to Bag',
      featured: 'Featured',
      soldOut: 'Sold Out',
      loading: 'Loading our finest oils...',
      viewShop: 'Go to Our Shop',
    },
    blog: {
      title: 'The Olive Grove Journal',
      subtitle: 'Stories, recipes, and news from our farm.',
      readMore: 'Read Story',
      viewAll: 'See More Articles',
      backToBlog: 'Back to Journal',
      publishedOn: 'Published on',
      latest: 'Latest from the Grove'
    },
    testimonials: {
      title: 'What People Say',
      subtitle: 'Kind words from our community',
      viewAll: 'Read All Reviews',
      writeReview: 'Write a Review',
      formTitle: 'Share Your Experience',
      nameLabel: 'Your Name',
      locationLabel: 'Location (City)',
      reviewLabel: 'Your Review',
      submitButton: 'Submit Review',
      successMessage: 'Thank you! Your review has been submitted for approval.'
    },
    faq: {
      title: 'Common Questions',
      viewAll: 'View All Questions',
    },
    cart: {
      title: 'Your Selection',
      empty: 'Your bag is currently empty.',
      total: 'Total',
      checkout: 'Order via WhatsApp',
      remove: 'Remove',
    },
    contact: {
      title: 'Get in Touch',
      name: 'Your Name',
      email: 'Email Address',
      message: 'Message',
      send: 'Send Message',
    },
    footer: {
      rights: 'Zaytouna House. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contactHeading: 'Contact',
    }
  },
  ar: {
    nav: {
      story: 'قصتنا',
      shop: 'المتجر',
      philosophy: 'فلسفتنا',
      journal: 'المدونة',
      contact: 'تواصل معنا',
    },
    products: {
      title: 'جميع المنتجات',
      subtitle: 'نقي وعضوي',
      homeTitle: 'مختاراتنا المميزة',
      viewDetails: 'أضف للسلة',
      featured: 'متميز',
      soldOut: 'نفد من المخزون',
      loading: 'جاري تحميل أجود زيوتنا...',
      viewShop: 'اذهب إلى المتجر',
    },
    blog: {
      title: 'مدونة كرم الزيتون',
      subtitle: 'قصص، وصفات، وأخبار من مزرعتنا.',
      readMore: 'اقرأ المزيد',
      viewAll: 'شاهد المزيد من المقالات',
      backToBlog: 'عودة للمدونة',
      publishedOn: 'نشر بتاريخ',
      latest: 'أحدث القصص'
    },
    testimonials: {
      title: 'قالوا عنا',
      subtitle: 'كلمات طيبة من مجتمعنا',
      viewAll: 'اقرأ جميع الآراء',
      writeReview: 'أضف تقييمك',
      formTitle: 'شاركنا تجربتك',
      nameLabel: 'الاسم',
      locationLabel: 'الموقع (المدينة)',
      reviewLabel: 'تقييمك',
      submitButton: 'إرسال التقييم',
      successMessage: 'شكراً لك! تم إرسال تقييمك للمراجعة.'
    },
    faq: {
      title: 'أسئلة شائعة',
      viewAll: 'عرض كل الأسئلة',
    },
    cart: {
      title: 'سلة المشتريات',
      empty: 'سلة المشتريات فارغة حالياً.',
      total: 'المجموع',
      checkout: 'اطلب عبر واتساب',
      remove: 'إزالة',
    },
    contact: {
      title: 'تواصل معنا',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      message: 'الرسالة',
      send: 'إرسال',
    },
    footer: {
      rights: 'زيتونة هاوس. جميع الحقوق محفوظة.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      contactHeading: 'معلومات الاتصال',
    }
  },
};
