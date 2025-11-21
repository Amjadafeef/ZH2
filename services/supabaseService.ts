
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Feature, Testimonial, FAQItem, SiteContent, Article } from '../types';

// ==========================================
// 🔐 SECURITY CONFIGURATION
// ==========================================

// 1. Helper to get environment variables safely (works with Vite and CRA)
const getEnv = (key: string, viteKey: string): string => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

// 2. Load Keys from Environment Variables
// We check for both REACT_APP_ (Create React App) and VITE_ (Vite) prefixes
const ENV_SUPABASE_URL = getEnv('REACT_APP_SUPABASE_URL', 'VITE_SUPABASE_URL');
const ENV_SUPABASE_ANON_KEY = getEnv('REACT_APP_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// 3. TEMPORARY FALLBACKS (⚠️ DELETE THESE BEFORE PUSHING TO GITHUB)
// These allow the app to work in your current preview. 
// When deploying, ensure you set the environment variables and remove these lines.
const FALLBACK_URL = "https://llbdzkptyywblenauktz.supabase.co"; 
const FALLBACK_KEY = "sb_publishable_hzR7ulz9DYByaUuduyesIg_pg5fplZW";

const SUPABASE_URL = ENV_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_ANON_KEY = ENV_SUPABASE_ANON_KEY || FALLBACK_KEY;

// ==========================================
// 🛠️ COPY THIS SQL INTO SUPABASE SQL EDITOR
// ==========================================
export const SETUP_SQL = `
-- =================================================================
-- 1. PRODUCTS
-- =================================================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name_en text, name_ar text, 
  description_en text, description_ar text,
  price numeric, currency text default 'JOD', 
  volume_ml int, image_url text, 
  is_featured boolean default false, 
  in_stock boolean default true
);
alter table public.products enable row level security;
create policy "Public Read Products" on public.products for select using (true);

-- Insert data with specific IDs to avoid duplicates on re-runs
insert into public.products (id, name_en, name_ar, description_en, description_ar, price, volume_ml, image_url, is_featured) values 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Premium Extra Virgin Olive Oil', 'زيت زيتون بكر ممتاز فاخر', 'Cold pressed from the finest olives of Jerash.', 'معصور على البارد من أجود زيتون جرش.', 12.00, 500, 'https://images.unsplash.com/photo-1474979266404-7caddbed6465?q=80&w=800&auto=format&fit=crop', true),
('d290f1ee-6c54-4b01-90e6-d701748f0852', 'Family Reserve Tin', 'تنكة العائلة (اصدار خاص)', 'Large format tin for the whole family.', 'عبوة عائلية كبيرة تكفي الجميع.', 85.00, 16000, 'https://images.unsplash.com/photo-1620054828020-7300e6df75aa?q=80&w=800&auto=format&fit=crop', true)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 2. ARTICLES (BLOG)
-- =================================================================
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title_en text, title_ar text, 
  excerpt_en text, excerpt_ar text,
  content_en text, content_ar text,
  image_url text, thumbnail_url text, video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.articles enable row level security;
create policy "Public Read Articles" on public.articles for select using (true);

insert into public.articles (id, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, image_url, created_at) values 
(
  'a100f1ee-6c54-4b01-90e6-d701748f0901', 
  'The Harvest Season Begins', 
  'بداية موسم الحصاد', 
  'Our team is out in the fields gathering the first olives...', 
  'فريقنا في الحقول يجمع أول حبات الزيتون...', 
  'The 2024 harvest season has officially begun. We prioritize early harvest to ensure the highest polyphenol content.\n\nOur farmers wake up at dawn to hand-pick the olives, ensuring no fruit touches the ground. This traditional method preserves the integrity of the olive and results in lower acidity.\n\nStay tuned for the first batch of oil!', 
  'بدأ موسم الحصاد لعام 2024 رسمياً. نحن نعطي الأولوية للحصاد المبكر لضمان أعلى محتوى من البوليفينول.\n\nيستيقظ مزارعونا عند الفجر لقطف الزيتون يدوياً، لضمان عدم ملامسة الثمار للأرض. تحافظ هذه الطريقة التقليدية على سلامة الزيتون وتؤدي إلى حموضة أقل.\n\nترقبوا الدفعة الأولى من الزيت!', 
  'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=800&auto=format&fit=crop', 
  now()
),
(
  'a100f1ee-6c54-4b01-90e6-d701748f0902', 
  'Health Benefits of Olive Oil', 
  'الفوائد الصحية لزيت الزيتون', 
  'Discover why extra virgin olive oil is a superfood.', 
  'اكتشف لماذا يعتبر زيت الزيتون البكر الممتاز غذاءً خارقاً.', 
  'Olive oil is rich in healthy monounsaturated fats and antioxidants. Studies have shown that regular consumption can improve heart health and reduce inflammation.\n\nUnlike refined oils, Extra Virgin Olive Oil (EVOO) retains all the vitamins and nutrients from the olive fruit.', 
  'زيت الزيتون غني بالدهون الأحادية غير المشبعة الصحية ومضادات الأكسدة. أظهرت الدراسات أن الاستهلاك المنتظم يمكن أن يحسن صحة القلب ويقلل من الالتهابات.\n\nعلى عكس الزيوت المكررة، يحتفظ زيت الزيتون البكر الممتاز بجميع الفيتامينات والعناصر الغذائية من ثمرة الزيتون.', 
  'https://images.unsplash.com/photo-1474979266404-7caddbed6465?q=80&w=800&auto=format&fit=crop', 
  now()
)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 3. FEATURES
-- =================================================================
create table if not exists public.features (
  id uuid default gen_random_uuid() primary key,
  title_en text, title_ar text,
  desc_en text, desc_ar text,
  icon_key text,
  sort_order int default 0
);
alter table public.features enable row level security;
create policy "Public Read Features" on public.features for select using (true);

insert into public.features (id, title_en, title_ar, desc_en, desc_ar, icon_key, sort_order) values
('f300f1ee-6c54-4b01-90e6-d701748f0301', 'Award Winning', 'حائز على جوائز', 'Recognized internationally.', 'معترف به دولياً.', 'award', 1),
('f300f1ee-6c54-4b01-90e6-d701748f0302', 'Cold Pressed', 'عصر بارد', 'Extracted below 27°C.', 'يستخرج تحت 27 درجة مئوية.', 'droplet', 2),
('f300f1ee-6c54-4b01-90e6-d701748f0303', 'Fast Delivery', 'توصيل سريع', 'Farm to table.', 'من المزرعة للمائدة.', 'truck', 3),
('f300f1ee-6c54-4b01-90e6-d701748f0304', 'Lab Tested', 'مفحوص مخبرياً', 'Acidity below 0.8%.', 'حموضة أقل من 0.8٪.', 'check', 4)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 4. TESTIMONIALS
-- =================================================================
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  name_en text, name_ar text,
  text_en text, text_ar text,
  location_en text, location_ar text,
  sort_order int default 0
);
alter table public.testimonials enable row level security;
create policy "Public Read Testimonials" on public.testimonials for select using (true);

insert into public.testimonials (id, name_en, name_ar, text_en, text_ar, location_en, location_ar, sort_order) values
('t400f1ee-6c54-4b01-90e6-d701748f0401', 'Sarah J.', 'سارة ج.', 'Best olive oil ever. The taste is incredibly fresh.', 'أفضل زيت زيتون. الطعم طازج للغاية.', 'Amman', 'عمان', 1),
('t400f1ee-6c54-4b01-90e6-d701748f0402', 'Mike T.', 'مايك ت.', 'Great packaging and fast delivery to Dubai.', 'تغليف رائع وتوصيل سريع إلى دبي.', 'Dubai', 'دبي', 2)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 5. FAQs
-- =================================================================
create table if not exists public.faqs (
  id uuid default gen_random_uuid() primary key,
  question_en text, question_ar text,
  answer_en text, answer_ar text,
  sort_order int default 0
);
alter table public.faqs enable row level security;
create policy "Public Read FAQs" on public.faqs for select using (true);

insert into public.faqs (id, question_en, question_ar, answer_en, answer_ar, sort_order) values
('q500f1ee-6c54-4b01-90e6-d701748f0501', 'Is it cold pressed?', 'هل هو عصر بارد؟', 'Yes, absolutely. We ensure the temperature never exceeds 27°C during extraction to preserve nutrients.', 'نعم بالتأكيد. نحن نضمن ألا تتجاوز درجة الحرارة 27 درجة مئوية أثناء الاستخراج للحفاظ على العناصر الغذائية.', 1),
('q500f1ee-6c54-4b01-90e6-d701748f0502', 'Shipping areas?', 'مناطق الشحن؟', 'We currently ship to all locations in Jordan and major cities in the UAE.', 'نقوم حالياً بالشحن إلى جميع المناطق في الأردن والمدن الرئيسية في الإمارات.', 2)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- 6. SITE CONTENT
-- =================================================================
create table if not exists public.site_content (
  key text primary key,
  value_en text,
  value_ar text
);
alter table public.site_content enable row level security;
create policy "Public Read Content" on public.site_content for select using (true);

insert into public.site_content (key, value_en, value_ar) values
('hero_tagline', 'Authentic Jordanian Extra Virgin Olive Oil', 'زيت زيتون أردني بكر ممتاز أصلي'),
('hero_subtitle', 'From the heart of Jerash', 'من قلب جرش'),
('hero_cta', 'Shop Now', 'تسوق الآن'),
('story_title', 'Our Roots run Deep', 'جذورنا ضاربة في عمق التاريخ'),
('story_subtitle', 'Since 1985', 'منذ 1985'),
('brand_story', 'Founded in 1985, Zaytouna House continues the legacy of our ancestors. We believe in sustainable farming and quality over quantity.', 'تأسست زيتونة هاوس عام 1985 وتواصل إرث أجدادنا. نحن نؤمن بالزراعة المستدامة والجودة قبل الكمية.'),
('contact_phone', '+962 79 123 4567', '+962 79 123 4567'),
('contact_email', 'hello@zaytounahouse.com', 'hello@zaytounahouse.com'),
('contact_address', 'Jerash, Jordan', 'جرش، الأردن'),
('products_title', 'Our Collection', 'منتجاتنا'),
('products_subtitle', 'Pure & Organic', 'نقي وعضوي'),
('features_title', 'Why Choose Us', 'لماذا نحن'),
('features_subtitle', 'Quality First', 'الجودة أولاً'),
('testimonials_title', 'What People Say', 'قالوا عنا'),
('faq_title', 'Common Questions', 'أسئلة شائعة'),
('story_badge', '1985', '1985'),
('story_signature_name', 'Zaid Al-Zaytoun', 'زيد الزيتون'),
('story_signature_role', 'Founder', 'المؤسس'),
('social_instagram', '@zaytounahouse', '@zaytounahouse')
ON CONFLICT (key) DO NOTHING;
`;

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  if (SUPABASE_ANON_KEY.length > 20) {
     try {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     } catch (e) {
        console.error("Failed to initialize Supabase client", e);
     }
  } else {
      console.warn("Supabase Key looks invalid. Check services/supabaseService.ts");
  }
}

export const getSupabaseClient = () => supabase;

const fetchData = async <T>(table: string, orderBy?: string, limit?: number): Promise<T[]> => {
  if (!supabase) {
    console.warn(`Supabase client not initialized. Cannot fetch ${table}.`);
    return [];
  }
  
  let query = supabase.from(table).select('*');
  
  if (orderBy) {
    query = query.order(orderBy, { ascending: false }); // Defaulting to descending for dates/priority
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    // If table is missing (PGRST205), we log a helpful warning
    if (error.code === 'PGRST205') {
      console.warn(`⚠️ Table '${table}' missing in Supabase. Run the SETUP_SQL.`);
    } else {
      console.error(`Error fetching ${table}:`, JSON.stringify(error, null, 2));
    }
    return [];
  }
  return (data || []) as T[];
};

export const getProducts = async (): Promise<Product[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('is_featured', { ascending: false });

  if (error) {
    console.error('Error fetching products:', JSON.stringify(error, null, 2));
    return [];
  }
  return (data || []) as Product[];
};

export const getArticles = async (): Promise<Article[]> => {
  return fetchData<Article>('articles', 'created_at');
};

export const getFeatures = async (): Promise<Feature[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('features').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data as Feature[];
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data as Testimonial[];
};

export const getFAQs = async (): Promise<FAQItem[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data as FAQItem[];
};

export const getSiteContent = async (): Promise<SiteContent[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('site_content').select('*');
  if (error) return [];
  return data as SiteContent[];
};
