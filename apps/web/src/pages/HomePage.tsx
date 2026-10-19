import React from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { GoldDivider } from '../components/common/GoldDivider';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { OFFICIAL_SERVICES } from '@momera/shared';
import {
  Sparkles,
  ShieldCheck,
  Video,
  Gift,
  ArrowRight,
  MessageCircle,
  Flame,
  Coins,
  Compass,
  Trophy,
  Gem,
  Phone,
  Mail,
} from 'lucide-react';
import { usePublicSettings } from '../context/SettingsContext';

const HERO_BG = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop';

const GALLERY_PREVIEWS = [
  {
    title: 'Candlelit Letters',
    desc: 'Vintage calligraphy & wax seal',
    category: 'ATMOSPHERE',
    img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Midnight Gift Boxes',
    desc: 'Hand-wrapped royal ribbon',
    category: 'DOORSTEP',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Balloon Backdrops',
    desc: 'Matte navy & champagne clusters',
    category: 'CELEBRATION',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Slow-Motion Walk',
    desc: 'Edited vertical 4K reels',
    category: 'CINEMATOGRAPHY',
    img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
  },
];

export const HomePage: React.FC = () => {
  const { settings, formatWhatsAppUrl, formatTelUrl } = usePublicSettings();
  const servicesList = Object.values(OFFICIAL_SERVICES);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 text-stone-200">
      {/* 1. TEMPLE RUN CINEMATIC HERO */}
      <section className="relative pt-20 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Background Jungle Temple Atmosphere */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-25 scale-105 pointer-events-none"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#14110e]/85 to-[#0e0d0c] pointer-events-none" />

        {/* Ambient Torch Flares */}
        <div className="absolute top-1/4 left-8 md:left-24 w-64 h-64 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-8 md:right-24 w-64 h-64 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          {/* Royal Seal Crest & Temple HUD Badge */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-[#1b1714] flex items-center justify-center border-2 border-[#C8A45D] shadow-[0_0_35px_rgba(200,164,93,0.5)] p-4 mb-4 hover:scale-105 transition-transform duration-300">
              <MomeraLogo variant="emblem" size={68} alt="MIRSTOERA Royal Crest" priority />
            </div>
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1e1b17] border border-amber-500/50 text-xs font-mono uppercase tracking-widest text-amber-300 shadow">
              <Flame size={14} className="text-amber-500 temple-flame-anim" />
              <span>Temple Run Expedition • Coimbatore Vault</span>
            </div>
          </div>

          {/* Master Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-amber-100 leading-tight sm:leading-none drop-shadow-md">
            Your Story Deserves a <span className="gold-gradient-text">Royal Moment.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
            We turn ordinary celebrations into extraordinary memories through beautifully crafted surprise experiences in Coimbatore.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
            <Link to="/experiences" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-sm uppercase tracking-wider rounded border border-amber-200 shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Compass size={16} /> Explore Experiences
              </button>
            </Link>
            <Link to="/book" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1e1b17] hover:bg-[#2b251f] text-amber-200 font-serif font-bold text-sm uppercase tracking-wider rounded border border-[#C8A45D]/70 hover:border-amber-400 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Flame size={16} className="text-amber-500 temple-flame-anim" /> Plan My Surprise
              </button>
            </Link>
          </div>

          {/* Quick Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5 bg-[#171412] px-3 py-1 rounded border border-stone-800">
              <ShieldCheck size={15} className="text-amber-400" /> 100% Punctual & Discreet
            </span>
            <span className="flex items-center gap-1.5 bg-[#171412] px-3 py-1 rounded border border-stone-800">
              <Video size={15} className="text-amber-400" /> Cinematic Smartphone Reels
            </span>
            <span className="flex items-center gap-1.5 bg-[#171412] px-3 py-1 rounded border border-stone-800">
              <Coins size={15} className="text-[#C8A45D]" /> Starting from ₹799
            </span>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & SACRED STONE TABLET */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="temple-stone-monolith p-8 sm:p-14 rounded-lg relative overflow-hidden">
          {/* Corner Runes */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#C8A45D]/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#C8A45D]/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#C8A45D]/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#C8A45D]/60 pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-[#1b1714] mx-auto -mt-16 sm:-mt-22 border-2 border-[#C8A45D] flex items-center justify-center shadow-[0_0_20px_rgba(200,164,93,0.4)] p-2">
            <MomeraLogo variant="emblem" size={40} alt="MIRSTOERA Crest" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mt-4 mb-2">
            The Royal Standard
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-amber-100 mb-4">
            Why Everyday Moments Deserve a Crown
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            In our busy lives, special moments often get reduced to quick text messages and rushed greetings. MIRSTOERA was born in Coimbatore to bring back heartfelt sentiment, cinema-inspired romance, and regal elegance. Whether it’s an unexpected gift at midnight or a movie-style hero entry, every detail is treated with dignity, artistry, and personal care.
          </p>

          <GoldDivider className="my-8 opacity-60" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="border-l-2 border-amber-500/70 pl-4 py-1">
              <h3 className="font-serif text-base font-bold text-amber-200 mb-1 flex items-center gap-1.5">
                <Flame size={14} className="text-amber-500" />
                Authentic Emotion
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Tailored letters on luxury textured paper, favorite music tracks, and heartfelt storytelling.
              </p>
            </div>
            <div className="border-l-2 border-amber-500/70 pl-4 py-1">
              <h3 className="font-serif text-base font-bold text-amber-200 mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-500" />
                Zero Stunts or Risks
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                No dangerous pyrotechnics or road obstruction. Clean, tasteful, respectful coordination.
              </p>
            </div>
            <div className="border-l-2 border-amber-500/70 pl-4 py-1">
              <h3 className="font-serif text-base font-bold text-amber-200 mb-1 flex items-center gap-1.5">
                <Coins size={14} className="text-amber-500" />
                Tailored Pricing
              </h3>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Transparent starting prices with individual concierge quotations to fit your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR FEATURED EXPERIENCES WITH HD ONLINE IMAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Curated Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-amber-100">
            Craft Your Royal Moment
          </h2>
          <p className="text-sm text-stone-300 mt-3 font-light">
            Select one of our four signature celebration packages, each handcrafted for unforgettable emotional impact.
          </p>
          <GoldDivider className="my-6 opacity-60" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {servicesList.map((service, idx) => (
            <ExperienceCard
              key={service.slug}
              service={service}
              featured={idx === 1} // Feature proposal
            />
          ))}
        </div>
      </section>

      {/* 4. HOW MIRSTOERA WORKS — ANCIENT QUEST STAGES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Seamless Coordination
          </span>
          <h2 className="font-serif text-3xl font-black text-amber-100">
            How MIRSTOERA Works
          </h2>
          <GoldDivider className="my-5 opacity-60" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="temple-stone-card p-8 rounded-lg relative text-left">
            <span className="font-serif text-3xl font-black text-amber-500/30 absolute top-4 right-4">
              01
            </span>
            <div className="w-12 h-12 rounded bg-[#100e0c] border border-amber-500/60 flex items-center justify-center mb-4 shadow">
              <Gift size={22} className="text-amber-400" />
            </div>
            <h3 className="font-serif text-lg font-bold text-amber-200 mb-2">
              Share Your Vision
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Choose an experience and submit your surprise request online. Tell us about the recipient, date, and preferred Coimbatore area.
            </p>
          </div>

          {/* Step 2 */}
          <div className="temple-stone-card p-8 rounded-lg relative text-left border-2 border-amber-500/70 temple-glow-gold">
            <span className="font-serif text-3xl font-black text-amber-400/50 absolute top-4 right-4">
              02
            </span>
            <div className="w-12 h-12 rounded bg-[#100e0c] border border-amber-500 flex items-center justify-center mb-4 shadow">
              <MessageCircle size={22} className="text-amber-400" />
            </div>
            <h3 className="font-serif text-lg font-bold text-amber-200 mb-2">
              Bespoke Consultation
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Our concierge team contacts you directly on WhatsApp to customize every detail: song choices, love letters, timing, and tailored quotation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="temple-stone-card p-8 rounded-lg relative text-left">
            <span className="font-serif text-3xl font-black text-amber-500/30 absolute top-4 right-4">
              03
            </span>
            <div className="w-12 h-12 rounded bg-[#100e0c] border border-amber-500/60 flex items-center justify-center mb-4 shadow">
              <Flame size={22} className="text-amber-400 temple-flame-anim" />
            </div>
            <h3 className="font-serif text-lg font-bold text-amber-200 mb-2">
              Flawless Surprise Reveal
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Our crew arrives quietly, prepares the setup, cues the music, coordinates the reveal, and films a cinematic keepsake memory reel.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VISUAL GALLERY TEASER (ONLINE HD IMAGES) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2">
            Memories in the Making
          </span>
          <h2 className="font-serif text-3xl font-black text-amber-100">
            The MIRSTOERA Aesthetic
          </h2>
          <GoldDivider className="my-4 opacity-60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {GALLERY_PREVIEWS.map((item, idx) => (
            <div
              key={idx}
              className="temple-stone-card rounded-lg overflow-hidden group relative flex flex-col justify-end h-56 border border-stone-700/80 hover:border-amber-400 transition-all shadow-md"
            >
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c] via-[#0e0d0c]/50 to-transparent" />

              <div className="relative z-10 p-5">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-widest block mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-base font-bold text-amber-100">{item.title}</h3>
                <p className="text-[11px] text-stone-300 font-light mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to="/gallery">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#1b1714] hover:bg-[#26201b] text-amber-300 font-serif font-bold text-xs uppercase tracking-wider rounded border border-amber-500/50 hover:border-amber-400 transition-all shadow"
            >
              View Gallery Concepts <ArrowRight size={14} className="ml-1.5 inline" />
            </button>
          </Link>
        </div>
      </section>

      {/* 6. FINAL BOOKING CTA BANNER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="temple-stone-monolith p-10 sm:p-14 rounded-lg relative overflow-hidden shadow-[0_0_35px_rgba(200,164,93,0.3)]">
          <div className="w-16 h-16 rounded-full bg-[#1b1714] border-2 border-[#C8A45D] flex items-center justify-center mx-auto mb-4 p-2 shadow">
            <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Crest" />
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-amber-100 tracking-tight mb-3">
            Ready to Create an Unforgettable Royal Moment?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed font-light mb-8">
            Tell us about the person you cherish. Our Coimbatore concierge will help you plan every detail with complete discretion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/book" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-sm uppercase tracking-wider rounded border border-amber-200 shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all hover:scale-105"
              >
                Start My Royal Booking
              </button>
            </Link>
            <a
              href={formatWhatsAppUrl("Hello MIRSTOERA Concierge, I would like to plan a surprise experience.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#1b1714] hover:bg-[#26201b] text-amber-300 font-serif font-bold text-sm uppercase tracking-wider rounded border border-amber-500/60 hover:border-amber-400 shadow transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </button>
            </a>
          </div>

          {/* Dynamic Concierge Contact Snippet */}
          <div className="pt-6 mt-6 border-t border-stone-800 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300 font-mono">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-amber-400" />
              Direct Phone: <a href={formatTelUrl()} className="text-amber-300 hover:underline">{settings.phone}</a>
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <MessageCircle size={14} className="text-emerald-400" />
              WhatsApp: <span className="text-emerald-400">{settings.whatsapp}</span>
            </span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-amber-400" />
              Email: <a href={`mailto:${settings.email}`} className="text-amber-300 hover:underline">{settings.email}</a>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
