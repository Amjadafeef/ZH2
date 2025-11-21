
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ShoppingBag, ChevronDown, 
  Facebook, Instagram, Mail, Phone, MapPin, 
  Award, Droplets, Truck, Check, ArrowRight, Star, Quote, ShieldCheck, Sprout,
  Trash2, Plus, Minus, Calendar, ArrowLeft, PlayCircle, Database, ExternalLink, Edit3
} from 'lucide-react';
import { translations } from './constants';
import { Product, Feature, Testimonial, FAQItem, Language, Translation, SiteContent, CartItem, Article, NewTestimonial } from './types';
import { getProducts, getFeatures, getTestimonials, getFAQs, getSiteContent, getArticles, addTestimonial, SETUP_SQL } from './services/supabaseService';

// --- Helper to resolve icons ---
const getIcon = (name: string) => {
  const props = { strokeWidth: 1.5, className: "w-8 h-8" };
  switch (name) {
    case 'award': return <Award key="award" {...props} />;
    case 'droplet': return <Droplets key="droplet" {...props} />;
    case 'truck': return <Truck key="truck" {...props} />;
    case 'check': return <Check key="check" {...props} />;
    case 'shield': return <ShieldCheck key="shield" {...props} />;
    case 'sprout': return <Sprout key="sprout" {...props} />;
    default: return <Check key="default" {...props} />;
  }
};

// --- Helper: Safe Text Retrieval ---
const getSafeTxt = (content: Record<string, SiteContent>, key: string, lang: Language) => {
  const item = content[key];
  if (!item) {
    return lang === 'en' ? `[${key}]` : `[${key}]`; 
  }
  return lang === 'en' ? (item.value_en || '') : (item.value_ar || '');
};

// --- Helper: Extract YouTube ID ---
const getYoutubeId = (url?: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- View State Type ---
type ViewState = 'home' | 'shop-index' | 'blog-index' | 'blog-post' | 'testimonials-index' | 'faq-index';

// --- Setup Modal Component ---
const SetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-olive-50">
          <div className="flex items-center gap-3">
            <Database className="text-terra-500" />
            <h3 className="font-bold text-lg text-olive-900">Database Setup Guide</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <p className="mb-4 text-gray-600">
            To fix the <strong>missing table errors</strong>, run the SQL code below in your Supabase SQL Editor.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 relative group">
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy SQL'}
            </button>
            <pre className="text-green-400 text-xs overflow-x-auto font-mono p-2">
              {SETUP_SQL}
            </pre>
          </div>
          <div className="mt-6 text-sm text-gray-500 border-t pt-4">
             <strong>Steps:</strong>
             <ol className="list-decimal list-inside mt-2 space-y-1">
               <li>Copy the SQL code above.</li>
               <li>Go to your Supabase Dashboard {'>'} SQL Editor.</li>
               <li>Paste the code and click "Run".</li>
               <li>Refresh this page.</li>
             </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Review Modal Component ---
const ReviewModal: React.FC<{ isOpen: boolean; onClose: () => void; t: Translation; lang: Language }> = ({ isOpen, onClose, t, lang }) => {
  const [formData, setFormData] = useState<NewTestimonial>({ name: '', location: '', text: '', rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addTestimonial(formData);
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', location: '', text: '', rating: 5 });
        onClose();
      }, 3000);
    } else {
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-olive-900 mb-2">{t.testimonials.successMessage}</h3>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-olive-50 flex justify-between items-center bg-olive-50">
              <h3 className={`font-bold text-lg text-olive-900 font-serif ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.testimonials.formTitle}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-olive-600 uppercase tracking-widest mb-2">{t.testimonials.nameLabel}</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-olive-200 rounded p-3 focus:outline-none focus:border-gold-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-olive-600 uppercase tracking-widest mb-2">{t.testimonials.locationLabel}</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-olive-200 rounded p-3 focus:outline-none focus:border-gold-500 text-sm" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-olive-600 uppercase tracking-widest mb-2">Rating</label>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button type="button" key={star} onClick={() => setFormData({...formData, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                       <Star size={24} className={star <= formData.rating ? "fill-gold-500 text-gold-500" : "text-gray-300"} />
                     </button>
                   ))}
                 </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-olive-600 uppercase tracking-widest mb-2">{t.testimonials.reviewLabel}</label>
                <textarea required rows={4} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full border border-olive-200 rounded p-3 focus:outline-none focus:border-gold-500 text-sm resize-none"></textarea>
              </div>
              <button disabled={isSubmitting} className="w-full bg-olive-900 text-white py-4 rounded font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50">
                {isSubmitting ? '...' : t.testimonials.submitButton}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// --- Components ---

// 1. Navigation
const Navbar: React.FC<{
  lang: Language;
  setLang: (l: Language) => void;
  t: Translation;
  content: Record<string, SiteContent>;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: ViewState) => void;
}> = ({ lang, setLang, t, content, cartCount, onOpenCart, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const getTxt = (key: string) => getSafeTxt(content, key, lang);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Mapping for special views
    if (targetId === '#shop') {
      onNavigate('shop-index');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (targetId === '#blog') {
      onNavigate('blog-index');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Home sections
    onNavigate('home');
    setTimeout(() => {
      if (targetId === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.querySelector(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const NavLink = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => (
    <a 
      href={href} 
      onClick={(e) => handleNavClick(e, href)}
      className={`
        block transition-all duration-300 font-medium tracking-wide cursor-pointer
        ${mobile 
          ? 'text-3xl py-4 text-olive-900 border-b border-olive-100 font-serif' 
          : scrolled ? 'text-olive-800 hover:text-terra-500' : 'text-white/90 hover:text-white'
        }
      `}
    >
      {label}
    </a>
  );

  return (
    <nav 
      className={`
        fixed w-full z-40 transition-all duration-500 ease-in-out
        ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 relative z-50">
            <a href="#top" onClick={(e) => handleNavClick(e, '#top')} className={`font-serif font-bold text-2xl tracking-[0.15em] uppercase ${scrolled ? 'text-olive-900' : 'text-white'} transition-colors`}>
              Zaytouna<span className="text-gold-500">.</span>
            </a>
          </div>

          {/* Desktop Menu - Updated Order: Story, Shop, Philosophy, Contact, Journal */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12 rtl:space-x-reverse">
            <NavLink href="#story" label={t.nav.story} />
            <NavLink href="#shop" label={t.nav.shop} />
            <NavLink href="#why-us" label={t.nav.philosophy} />
            <NavLink href="#contact" label={t.nav.contact} />
            <NavLink href="#blog" label={t.nav.journal} />
            
            <div className={`h-6 w-px ${scrolled ? 'bg-olive-200' : 'bg-white/30'}`}></div>

            <button 
              onClick={toggleLang}
              className={`
                text-xs font-bold uppercase tracking-widest hover:text-gold-500 transition-colors px-2 py-1 rounded border border-transparent
                ${scrolled ? 'text-olive-900 hover:border-olive-200' : 'text-white hover:border-white/30'}
              `}
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            
            <button 
              onClick={onOpenCart}
              className={`
                relative group
                ${scrolled ? 'text-olive-900' : 'text-white'}
              `}
            >
              <ShoppingBag size={22} strokeWidth={1.5} className="group-hover:text-gold-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-terra-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-5 relative z-50">
             <button 
                onClick={toggleLang}
                className={`text-xs font-bold uppercase tracking-widest ${scrolled || isOpen ? 'text-olive-900' : 'text-white'}`}
              >
                {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button 
              onClick={onOpenCart}
              className={`relative ${scrolled || isOpen ? 'text-olive-900' : 'text-white'}`}
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-terra-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled || isOpen ? 'text-olive-900' : 'text-white'} focus:outline-none transition-colors`}
            >
              {isOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 bg-cream z-40 flex flex-col justify-center px-8 transition-transform duration-500 ease-in-out md:hidden
        ${isOpen ? 'translate-x-0' : lang === 'ar' ? 'translate-x-full' : '-translate-x-full'}
      `}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-olive-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
        
        <div className="space-y-4 relative z-10">
          <NavLink href="#story" label={t.nav.story} mobile />
          <NavLink href="#shop" label={t.nav.shop} mobile />
          <NavLink href="#why-us" label={t.nav.philosophy} mobile />
          <NavLink href="#contact" label={t.nav.contact} mobile />
          <NavLink href="#blog" label={t.nav.journal} mobile />
        </div>
        <div className="mt-12 space-y-4 text-olive-600 relative z-10">
          <div className="flex items-center gap-3">
             <Phone size={18} className="text-terra-500" /> 
             <span dir="ltr">{getTxt('contact_phone')}</span>
          </div>
          <div className="flex items-center gap-3">
             <Instagram size={18} className="text-terra-500" /> 
             <span dir="ltr">{getTxt('social_instagram')}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

// 2. Cart Drawer
const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  t: Translation;
  lang: Language;
  content: Record<string, SiteContent>;
}> = ({ isOpen, onClose, cart, onRemove, onUpdateQty, t, lang, content }) => {
  const getTxt = (key: string) => getSafeTxt(content, key, lang);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const currency = cart.length > 0 ? cart[0].currency : 'JOD';

  const handleCheckout = () => {
    const phone = getTxt('contact_phone').replace(/[^0-9]/g, '');
    let message = lang === 'en' ? `Hello Zaytouna House, I would like to order:\n\n` : `مرحباً زيتونة هاوس، أرغب بطلب:\n\n`;
    cart.forEach(item => {
      const name = lang === 'en' ? item.name_en : item.name_ar;
      message += `- ${item.quantity}x ${name} (${item.volume_ml}ml)\n`;
    });
    message += lang === 'en' ? `\nTotal: ${subtotal.toFixed(2)} ${currency}` : `\nالمجموع: ${subtotal.toFixed(2)} ${currency}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 bottom-0 w-full max-w-md bg-cream z-50 shadow-2xl transition-transform duration-500 ease-in-out ${lang === 'ar' ? 'left-0' : 'right-0'} ${isOpen ? 'translate-x-0' : lang === 'ar' ? '-translate-x-full' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-olive-100 flex justify-between items-center bg-white">
            <h2 className={`text-2xl font-serif text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.cart.title}</h2>
            <button onClick={onClose} className="text-olive-500 hover:text-terra-500 transition-colors"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-olive-400 opacity-60"><ShoppingBag size={48} className="mb-4" strokeWidth={1} /><p className={lang === 'ar' ? 'font-arabic' : ''}>{t.cart.empty}</p></div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm border border-olive-50">
                  <div className="w-20 h-24 flex-shrink-0 bg-olive-50 rounded overflow-hidden"><img src={item.image_url} alt="" className="w-full h-full object-cover" /></div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div><h4 className={`text-olive-900 font-medium ${lang === 'ar' ? 'font-arabic' : 'font-serif'}`}>{lang === 'en' ? item.name_en : item.name_ar}</h4><p className="text-xs text-olive-400">{item.volume_ml}ml</p></div>
                    <div className="flex items-center justify-between mt-2"><div className="text-gold-600 font-bold">{item.price} {item.currency}</div><div className="flex items-center gap-3 bg-olive-50 rounded-full px-2 py-1"><button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow text-olive-600 transition-all"><Minus size={12} /></button><span className="text-sm font-bold text-olive-900 w-4 text-center">{item.quantity}</span><button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white hover:shadow text-olive-600 transition-all"><Plus size={12} /></button></div></div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-terra-500 self-start p-1 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-olive-100">
              <div className="flex justify-between items-center mb-6 text-xl font-bold text-olive-900"><span className={lang === 'ar' ? 'font-arabic' : 'font-serif'}>{t.cart.total}</span><span className="font-sans">{subtotal.toFixed(2)} {currency}</span></div>
              <button onClick={handleCheckout} className="w-full bg-olive-900 text-white py-4 rounded-lg uppercase tracking-widest font-bold hover:bg-gold-500 transition-all flex items-center justify-center gap-2"><span>{t.cart.checkout}</span><ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} /></button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// 3. Hero Section
const Hero: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent> }> = ({ t, lang, content }) => {
  const getTxt = (key: string) => getSafeTxt(content, key, lang);
  const bgImage = getTxt('hero_bg_image') || "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="relative h-[75vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 animate-[subtle-zoom_30s_infinite_alternate]" style={{ backgroundImage: `url("${bgImage}")` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-olive-900 via-olive-900/50 to-black/30 z-10"></div>
      <div className="relative z-20 px-6 max-w-5xl mx-auto text-white pt-16">
        <div className="overflow-hidden mb-4"><h2 className={`text-xs md:text-sm tracking-[0.3em] uppercase text-gold-400 font-bold animate-[fadeIn_1s_ease-out_0.5s_forwards] opacity-0`}>{getTxt('hero_subtitle') || 'Premium Extra Virgin'}</h2></div>
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] drop-shadow-lg ${lang === 'ar' ? 'font-arabic' : 'font-serif'} animate-[fadeIn_1s_ease-out_0.7s_forwards] opacity-0`}>Zaytouna House</h1>
        <p className="text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto text-white/90 leading-relaxed animate-[fadeIn_1s_ease-out_0.9s_forwards] opacity-0">{getTxt('hero_tagline')}</p>
        <div className="animate-[fadeIn_1s_ease-out_1.1s_forwards] opacity-0">
          <a href="#story" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,162,39,0.4)] hover:scale-105 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">{getTxt('hero_cta') || 'Explore'}<ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} /></span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </div>
      </div>
    </div>
  );
};

// 4. Story Section
const Story: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent> }> = ({ t, lang, content }) => {
  const getTxt = (key: string) => getSafeTxt(content, key, lang);
  const mainImage = getTxt('story_main_image') || "https://images.unsplash.com/photo-1609763951640-c0d7bd98b257?q=80&w=2344&auto=format&fit=crop";
  const signatureImage = getTxt('story_signature_image') || "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=100&auto=format&fit=crop";

  return (
    <section id="story" className="py-16 md:py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-olive-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl"><img src={mainImage} alt="Harvest" className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-[1.5s]" /></div>
            <div className={`absolute -top-6 -bottom-6 w-full border-2 border-gold-400/50 z-0 rounded-lg ${lang === 'ar' ? '-left-6' : '-right-6'}`}></div>
            <div className={`absolute bottom-8 bg-white p-5 shadow-xl max-w-[200px] rounded-sm z-20 ${lang === 'ar' ? '-right-6' : '-left-6'}`}><span className="block text-3xl font-serif text-terra-500 font-bold mb-1">{getTxt('story_badge')}</span><span className="text-[10px] text-olive-600 uppercase tracking-widest font-bold">{lang === 'en' ? 'Established' : 'تأسست'}</span></div>
          </div>
          <div className={`order-1 md:order-2 ${lang === 'ar' ? 'md:pr-4' : 'md:pl-4'}`}>
            <span className="flex items-center gap-4 text-terra-500 font-bold tracking-widest text-xs uppercase mb-4"><span className="w-8 h-px bg-terra-500"></span>{getTxt('story_subtitle')}</span>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-olive-900 mb-6 leading-tight ${lang === 'ar' ? 'font-arabic' : ''}`}>{getTxt('story_title')}</h2>
            <div className="prose prose-lg text-olive-700/80"><p className="mb-6 leading-relaxed font-light text-base md:text-lg">{getTxt('brand_story')}</p></div>
            <div className="mt-8 flex items-center gap-4"><img src={signatureImage} alt="Signature" className="h-10 opacity-60 grayscale" /><div><p className="font-serif text-olive-900 text-base">{getTxt('story_signature_name')}</p><p className="text-[10px] text-gold-600 uppercase tracking-widest font-bold">{getTxt('story_signature_role')}</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Helper Component: Product Card ---
const ProductCard: React.FC<{ product: Product, lang: Language, t: Translation, onAddToCart: (p: Product) => void }> = ({ product, lang, t, onAddToCart }) => (
  <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
    <div className="relative aspect-[4/5] overflow-hidden bg-olive-50">
      {product.is_featured && (
        <span className="absolute top-4 left-4 bg-terra-500 text-white text-[10px] font-bold px-3 py-1.5 z-20 uppercase tracking-widest rounded-full shadow-md">{t.products.featured}</span>
      )}
      <img src={product.image_url} alt={lang === 'en' ? product.name_en : product.name_ar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-8 text-center">
      <h3 className={`text-2xl font-serif text-olive-900 mb-2 group-hover:text-terra-500 transition-colors ${lang === 'ar' ? 'font-arabic' : ''}`}>{lang === 'en' ? product.name_en : product.name_ar}</h3>
      <p className="text-sm text-gray-500 mb-4 font-light">{product.volume_ml}ml</p>
      <div className="text-gold-600 font-bold text-xl mb-6 font-sans">{product.price.toFixed(2)} {product.currency}</div>
      <button 
        disabled={!product.in_stock}
        onClick={() => onAddToCart(product)}
        className={`w-full py-4 rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 ${product.in_stock ? 'bg-olive-900 text-white hover:bg-gold-500 hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        {product.in_stock ? t.products.viewDetails : t.products.soldOut}
      </button>
    </div>
  </div>
);

// 5. Home Product Section (Featured Preview)
const HomeProducts: React.FC<{ 
  t: Translation, 
  lang: Language, 
  content: Record<string, SiteContent>,
  onAddToCart: (p: Product) => void,
  onOpenSetup: () => void,
  onViewShop: () => void
}> = ({ t, lang, content, onAddToCart, onOpenSetup, onViewShop }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const getTxt = (key: string) => getSafeTxt(content, key, lang);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        // Filter featured for home page and take top 3
        const featured = data.filter(p => p.is_featured).slice(0, 3);
        // If no featured found (rare), just take top 3
        setProducts(featured.length > 0 ? featured : data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-4 block">{t.products.subtitle}</span>
          <h2 className={`text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-6 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.products.homeTitle}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-olive-300 to-olive-600 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            <p className="text-olive-500 animate-pulse">{t.products.loading}</p>
          </div>
        ) : products.length === 0 ? (
           <div className="text-center py-12 bg-olive-50 rounded-lg border border-olive-100 max-w-2xl mx-auto shadow-sm">
             <p className="text-olive-800 text-lg mb-2 font-semibold">{lang === 'ar' ? 'لا توجد منتجات حالياً' : 'No products found.'}</p>
             <p className="text-olive-500 text-sm mb-6">{lang === 'ar' ? 'يرجى التأكد من اتصال قاعدة البيانات.' : 'It looks like the database table is missing or empty.'}</p>
             <button onClick={onOpenSetup} className="inline-flex items-center gap-2 bg-terra-500 text-white px-6 py-3 rounded-lg hover:bg-terra-600 transition-colors font-bold text-sm uppercase tracking-widest"><Database size={16} /> Setup Database</button>
           </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} t={t} onAddToCart={onAddToCart} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <button onClick={onViewShop} className="inline-flex items-center gap-3 bg-transparent border-2 border-olive-900 text-olive-900 hover:bg-olive-900 hover:text-white px-10 py-4 rounded-lg uppercase tracking-widest text-sm font-bold transition-all duration-300">
                {t.products.viewShop}
                <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// 6. Full Shop Page
const ShopPage: React.FC<{ 
  t: Translation, 
  lang: Language, 
  content: Record<string, SiteContent>,
  onAddToCart: (p: Product) => void 
}> = ({ t, lang, content, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-3 block">{t.products.subtitle}</span>
          <h1 className={`text-4xl md:text-6xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.products.title}</h1>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {products.map(product => (
                <ProductCard key={product.id} product={product} lang={lang} t={t} onAddToCart={onAddToCart} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 7. Features (Philosophy)
const Features: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent> }> = ({ t, lang, content }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const getTxt = (key: string) => getSafeTxt(content, key, lang);

  useEffect(() => {
    getFeatures().then(setFeatures).finally(() => setLoading(false));
  }, []);

  return (
    <section id="why-us" className="py-24 bg-olive-50/50 relative overflow-hidden">
      <div className="absolute -left-20 top-20 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -right-20 bottom-20 w-96 h-96 bg-terra-200/20 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
           <span className="text-terra-500 font-bold tracking-widest text-xs uppercase mb-3 block">{getTxt('features_subtitle')}</span>
          <h2 className={`text-3xl md:text-4xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{getTxt('features_title')}</h2>
        </div>
        {loading ? (
           <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center text-olive-800 mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                  {getIcon(feature.icon_key)}
                </div>
                <h3 className={`text-lg font-bold mb-3 text-olive-900 ${lang === 'ar' ? 'font-arabic' : 'font-serif'}`}>{lang === 'en' ? feature.title_en : feature.title_ar}</h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-700">{lang === 'en' ? feature.desc_en : feature.desc_ar}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// 8. Article Components
const ArticleCard: React.FC<{ article: Article, lang: Language, t: Translation, onClick: () => void }> = ({ article, lang, t, onClick }) => {
  const title = lang === 'en' ? article.title_en : article.title_ar;
  const excerpt = lang === 'en' ? article.excerpt_en : article.excerpt_ar;
  const date = new Date(article.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-JO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div onClick={onClick} className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-olive-100 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img src={article.thumbnail_url || article.image_url} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {article.video_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"><PlayCircle className="w-12 h-12 text-white opacity-90" /></div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs text-gold-600 font-bold uppercase tracking-wider mb-3"><Calendar size={14} /><span>{date}</span></div>
        <h3 className={`text-xl font-serif font-bold text-olive-900 mb-3 line-clamp-2 group-hover:text-terra-500 transition-colors ${lang === 'ar' ? 'font-arabic' : ''}`}>{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">{excerpt}</p>
        <span className="inline-flex items-center gap-2 text-olive-900 font-bold text-sm border-b-2 border-transparent group-hover:border-gold-500 transition-all self-start">{t.blog.readMore} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} /></span>
      </div>
    </div>
  );
};

// Home Blog Section
const HomeBlog: React.FC<{ t: Translation, lang: Language, onViewAll: () => void, onSelect: (a: Article) => void }> = ({ t, lang, onViewAll, onSelect }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles().then(data => {
      setArticles(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-olive-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-2 block">{t.blog.subtitle}</span>
            <h2 className={`text-3xl md:text-4xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.blog.latest}</h2>
          </div>
          <button onClick={onViewAll} className="hidden md:flex items-center gap-2 text-olive-600 hover:text-terra-500 font-bold transition-colors">{t.blog.viewAll} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} /></button>
        </div>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} lang={lang} t={t} onClick={() => onSelect(article)} />
            ))}
          </div>
        )}
        <div className="mt-10 md:hidden text-center">
          <button onClick={onViewAll} className="inline-flex items-center gap-2 text-olive-600 hover:text-terra-500 font-bold transition-colors">{t.blog.viewAll} <ArrowRight size={16} className={lang === 'ar' ? 'rotate-180' : ''} /></button>
        </div>
      </div>
    </section>
  );
};

// Full Blog Page
const BlogIndex: React.FC<{ t: Translation, lang: Language, onSelect: (a: Article) => void }> = ({ t, lang, onSelect }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getArticles().then(data => { setArticles(data); setLoading(false); });
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-gold-600 font-bold tracking-widest text-xs uppercase mb-3 block">{t.blog.subtitle}</span>
          <h1 className={`text-4xl md:text-6xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.blog.title}</h1>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {articles.map(article => (
              <ArticleCard key={article.id} article={article} lang={lang} t={t} onClick={() => onSelect(article)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Single Blog Post
const BlogPost: React.FC<{ article: Article, t: Translation, lang: Language, onBack: () => void }> = ({ article, t, lang, onBack }) => {
  useEffect(() => { window.scrollTo(0, 0); }, [article]);
  const title = lang === 'en' ? article.title_en : article.title_ar;
  const content = lang === 'en' ? article.content_en : article.content_ar;
  const date = new Date(article.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-JO', { year: 'numeric', month: 'long', day: 'numeric' });
  const youtubeId = getYoutubeId(article.video_url);

  return (
    <article className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-olive-500 hover:text-olive-900 font-bold uppercase tracking-widest text-xs mb-8 transition-colors"><ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} /> {t.blog.backToBlog}</button>
        <h1 className={`text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-olive-900 mb-6 leading-tight ${lang === 'ar' ? 'font-arabic' : ''}`}>{title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm mb-10 border-b border-olive-50 pb-6"><span className="flex items-center gap-2"><Calendar size={16} className="text-gold-500" /> {date}</span><span className="w-1 h-1 bg-gray-300 rounded-full"></span><span className="text-gold-600 font-bold">Zaytouna House</span></div>
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg bg-olive-50">
          {youtubeId ? (
             <div className="relative pt-[56.25%]"><iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${youtubeId}`} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
          ) : (
            <img src={article.image_url} alt={title} className="w-full h-auto" />
          )}
        </div>
        <div className={`prose prose-lg prose-olive max-w-none ${lang === 'ar' ? 'font-arabic' : ''}`}>
           {content.split('\n').map((paragraph, idx) => (paragraph.trim() ? <p key={idx} className="mb-6 leading-loose text-gray-700">{paragraph}</p> : <br key={idx}/>))}
        </div>
      </div>
    </article>
  );
};

// 9. Testimonials (Preview)
const HomeTestimonials: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent>, onViewAll: () => void, onWriteReview: () => void }> = ({ t, lang, content, onViewAll, onWriteReview }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const getTxt = (key: string) => getSafeTxt(content, key, lang);
  const bgPattern = getTxt('testimonials_bg_pattern') || "https://www.transparenttextures.com/patterns/cubes.png";

  useEffect(() => {
    getTestimonials().then(data => { setTestimonials(data.slice(0, 3)); setLoading(false); });
  }, []);

  return (
    <section className="py-24 bg-olive-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("${bgPattern}")` }}></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-gold-500 text-gold-500" />)}</div>
          <h2 className={`text-3xl md:text-4xl font-serif font-bold ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.testimonials.title}</h2>
        </div>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-olive-800/50 p-8 rounded-xl border border-olive-700 relative hover:bg-olive-800 transition-colors">
                <Quote className="absolute top-8 right-8 text-gold-500/20 w-12 h-12" />
                <p className="text-olive-100 font-light italic leading-relaxed mb-6 relative z-10">"{lang === 'en' ? item.text_en : item.text_ar}"</p>
                <div>
                  <h4 className="text-gold-400 font-serif font-bold text-lg">{lang === 'en' ? item.name_en : item.name_ar}</h4>
                  <span className="text-xs text-olive-400 uppercase tracking-wider">{lang === 'en' ? item.location_en : item.location_ar}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-8">
          <button onClick={onViewAll} className="text-gold-400 hover:text-white font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2 transition-colors">
            {t.testimonials.viewAll} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
          <button onClick={onWriteReview} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
            <Edit3 size={14} /> {t.testimonials.writeReview}
          </button>
        </div>
      </div>
    </section>
  );
};

// Full Testimonials Page
const TestimonialsPage: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent>, onWriteReview: () => void }> = ({ t, lang, content, onWriteReview }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getTestimonials().then(data => { setTestimonials(data); setLoading(false); });
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-olive-900 text-white">
       <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <div className="text-center mb-16 animate-fade-in">
           <h1 className={`text-4xl md:text-6xl font-serif font-bold text-white mb-4 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.testimonials.title}</h1>
           <p className="text-olive-200 text-lg max-w-2xl mx-auto mb-8">{t.testimonials.subtitle}</p>
           <button onClick={onWriteReview} className="bg-gold-500 hover:bg-white hover:text-olive-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
             <Edit3 size={16} /> {t.testimonials.writeReview}
           </button>
         </div>
         {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-olive-800 p-8 rounded-xl border border-olive-700 relative hover:bg-olive-700 transition-colors">
                <Quote className="absolute top-8 right-8 text-gold-500/20 w-12 h-12" />
                <p className="text-olive-100 font-light italic leading-relaxed mb-6 relative z-10">"{lang === 'en' ? item.text_en : item.text_ar}"</p>
                <div>
                  <h4 className="text-gold-400 font-serif font-bold text-lg">{lang === 'en' ? item.name_en : item.name_ar}</h4>
                  <span className="text-xs text-olive-400 uppercase tracking-wider">{lang === 'en' ? item.location_en : item.location_ar}</span>
                </div>
              </div>
            ))}
          </div>
        )}
       </div>
    </div>
  );
};

// 10. FAQ (Preview)
const HomeFAQ: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent>, onViewAll: () => void }> = ({ t, lang, content, onViewAll }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const getTxt = (key: string) => getSafeTxt(content, key, lang);

  useEffect(() => {
    getFAQs().then(data => { setFaqs(data.slice(0, 3)); setLoading(false); });
  }, []);

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.faq.title}</h2>
        </div>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-olive-100 overflow-hidden transition-all hover:shadow-md">
                <button className={`w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group ${openIndex === idx ? 'bg-olive-50/50' : ''}`} onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                  <span className={`text-lg font-medium text-olive-900 group-hover:text-terra-500 transition-colors ${lang === 'ar' ? 'font-arabic text-right w-full' : ''}`}>{lang === 'en' ? item.question_en : item.question_ar}</span>
                  <span className={`text-gold-500 transition-transform duration-300 p-1 bg-gold-50 rounded-full ${openIndex === idx ? 'rotate-180 bg-gold-100' : ''}`}><ChevronDown size={20} /></span>
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed font-light border-t border-olive-50">{lang === 'en' ? item.answer_en : item.answer_ar}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <button onClick={onViewAll} className="text-olive-600 hover:text-terra-500 font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2 transition-colors">
            {t.faq.viewAll} <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </section>
  );
};

// Full FAQ Page
const FAQPage: React.FC<{ t: Translation, lang: Language }> = ({ t, lang }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    getFAQs().then(data => { setFaqs(data); setLoading(false); });
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className={`text-4xl md:text-6xl font-serif font-bold text-olive-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>{t.faq.title}</h1>
        </div>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-olive-500"></div></div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-olive-100 overflow-hidden transition-all hover:shadow-md">
                <button className={`w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group ${openIndex === idx ? 'bg-olive-50/50' : ''}`} onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                  <span className={`text-lg font-medium text-olive-900 group-hover:text-terra-500 transition-colors ${lang === 'ar' ? 'font-arabic text-right w-full' : ''}`}>{lang === 'en' ? item.question_en : item.question_ar}</span>
                  <span className={`text-gold-500 transition-transform duration-300 p-1 bg-gold-50 rounded-full ${openIndex === idx ? 'rotate-180 bg-gold-100' : ''}`}><ChevronDown size={20} /></span>
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed font-light border-t border-olive-50">{lang === 'en' ? item.answer_en : item.answer_ar}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 11. Footer
const Footer: React.FC<{ t: Translation, lang: Language, content: Record<string, SiteContent>, onNavigate: (view: ViewState) => void }> = ({ t, lang, content, onNavigate }) => {
  const getTxt = (key: string) => getSafeTxt(content, key, lang);

  return (
    <footer id="contact" className="bg-olive-900 text-white pt-24 pb-10 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-12 mb-20 border-b border-olive-800 pb-16">
          <div className="md:col-span-4">
            <h3 className="font-serif text-3xl font-bold text-white mb-6 tracking-wider">Zaytouna<span className="text-gold-500">.</span></h3>
            <p className="text-olive-200 mb-8 max-w-sm leading-relaxed font-light">{getTxt('hero_tagline')}</p>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <a href="#" className="w-10 h-10 rounded-full bg-olive-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-olive-800 flex items-center justify-center text-white hover:bg-gold-500 hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>
          <div className="md:col-span-4 md:pl-8 rtl:md:pr-8">
             <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-terra-400">{t.footer.contactHeading}</h4>
             <ul className="space-y-6 text-olive-100">
              <li className="flex items-start gap-4 group"><MapPin size={20} className="shrink-0 mt-1 text-gold-500 group-hover:text-white transition-colors" /> <span className="font-light group-hover:text-white transition-colors">{getTxt('contact_address') || 'Jordan'}</span></li>
              <li className="flex items-center gap-4 group"><Phone size={20} className="shrink-0 text-gold-500 group-hover:text-white transition-colors" /> <span dir="ltr" className="font-light group-hover:text-white transition-colors">{getTxt('contact_phone')}</span></li>
              <li className="flex items-center gap-4 group"><Mail size={20} className="shrink-0 text-gold-500 group-hover:text-white transition-colors" /> <span className="font-light group-hover:text-white transition-colors">{getTxt('contact_email')}</span></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-8 text-terra-400">{t.contact.title}</h4>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder={t.contact.name} className="w-full bg-olive-800/30 border border-olive-700 text-white py-3 px-4 rounded focus:outline-none focus:border-gold-500 placeholder-olive-500 transition-colors text-sm" />
                <input type="email" placeholder={t.contact.email} className="w-full bg-olive-800/30 border border-olive-700 text-white py-3 px-4 rounded focus:outline-none focus:border-gold-500 placeholder-olive-500 transition-colors text-sm" />
              </div>
              <textarea placeholder={t.contact.message} rows={3} className="w-full bg-olive-800/30 border border-olive-700 text-white py-3 px-4 rounded focus:outline-none focus:border-gold-500 placeholder-olive-500 transition-colors text-sm resize-none"></textarea>
              <button className="w-full bg-gold-500 hover:bg-white hover:text-olive-900 text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">{t.contact.send}</button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-olive-400 font-light">
          <p>&copy; {new Date().getFullYear()} {t.footer.rights}</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<ViewState>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    getSiteContent().then((data) => {
      const contentMap = data.reduce((acc, item) => { acc[item.key] = item; return acc; }, {} as Record<string, SiteContent>);
      setSiteContent(contentMap);
    }).catch(err => console.error("Failed to load content map", err));
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const handleSelectArticle = (article: Article) => { setSelectedArticle(article); setView('blog-post'); };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${lang === 'ar' ? 'font-arabic' : ''}`}>
      <Navbar lang={lang} setLang={setLang} t={t} content={siteContent} cartCount={totalItems} onOpenCart={() => setIsCartOpen(true)} onNavigate={setView} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onRemove={removeFromCart} onUpdateQty={updateQuantity} t={t} lang={lang} content={siteContent} />
      <SetupModal isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} t={t} lang={lang} />

      {view === 'home' && (
        <>
          <Hero t={t} lang={lang} content={siteContent} />
          <Story t={t} lang={lang} content={siteContent} />
          <HomeProducts t={t} lang={lang} content={siteContent} onAddToCart={addToCart} onOpenSetup={() => setIsSetupOpen(true)} onViewShop={() => setView('shop-index')} />
          <Features t={t} lang={lang} content={siteContent} />
          <HomeBlog t={t} lang={lang} onViewAll={() => setView('blog-index')} onSelect={handleSelectArticle} />
          <HomeTestimonials t={t} lang={lang} content={siteContent} onViewAll={() => setView('testimonials-index')} onWriteReview={() => setIsReviewModalOpen(true)} />
          <HomeFAQ t={t} lang={lang} content={siteContent} onViewAll={() => setView('faq-index')} />
        </>
      )}

      {view === 'shop-index' && <ShopPage t={t} lang={lang} content={siteContent} onAddToCart={addToCart} />}
      {view === 'blog-index' && <BlogIndex t={t} lang={lang} onSelect={handleSelectArticle} />}
      {view === 'blog-post' && selectedArticle && <BlogPost article={selectedArticle} t={t} lang={lang} onBack={() => setView('blog-index')} />}
      {view === 'testimonials-index' && <TestimonialsPage t={t} lang={lang} content={siteContent} onWriteReview={() => setIsReviewModalOpen(true)} />}
      {view === 'faq-index' && <FAQPage t={t} lang={lang} />}

      <Footer t={t} lang={lang} content={siteContent} onNavigate={setView} />
    </div>
  );
};

export default App;
