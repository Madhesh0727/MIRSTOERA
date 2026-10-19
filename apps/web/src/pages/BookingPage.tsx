import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  enquirySubmissionSchema,
  EnquirySubmissionInput,
  OFFICIAL_SERVICES,
  ServiceDetailDefinition,
  ServiceEntity,
  RECIPIENT_RELATIONSHIPS,
  COIMBATORE_AREAS,
} from '@momera/shared';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { GoldDivider } from '../components/common/GoldDivider';
import { api } from '../services/api';
import { usePublicSettings } from '../context/SettingsContext';
import {
  Flame,
  Coins,
  Compass,
  Trophy,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Gem,
} from 'lucide-react';

// Online HD Unsplash Imagery for Temple Run Aesthetic
const TEMPLE_IMAGES = {
  background: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
  goldenRelic: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
  services: {
    'secret-gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    'mini-proposal': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    'birthday-surprise': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    'hero-entry': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  },
};

const SERVICE_RELIC_BADGES: Record<string, { rune: string; category: string; difficulty: string }> = {
  'secret-gift': { rune: '🎁', category: 'DOORSTEP TREASURE', difficulty: 'EASY QUEST' },
  'mini-proposal': { rune: '💍', category: 'SACRED TEMPLE VOW', difficulty: 'LEGENDARY QUEST' },
  'birthday-surprise': { rune: '👑', category: 'GRAND ROYAL RITUAL', difficulty: 'EPIC CELEBRATION' },
  'hero-entry': { rune: '⚡', category: 'CHAMPION HERO RUN', difficulty: 'CINEMATIC ACTION' },
};

export const BookingPage: React.FC = () => {
  const { formatWhatsAppUrl } = usePublicSettings();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference_code: string;
    customer_name: string;
    customer_phone: string;
  } | null>(null);

  // Generate idempotency key on mount
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const [activeServices, setActiveServices] = useState<(ServiceDetailDefinition | ServiceEntity)[]>(
    Object.values(OFFICIAL_SERVICES)
  );

  useEffect(() => {
    api.getServices()
      .then((dbServices) => {
        if (dbServices && dbServices.length > 0) {
          const merged = dbServices.map((dbs) => {
            const official = OFFICIAL_SERVICES[dbs.slug];
            return {
              ...official,
              ...dbs,
              inclusions: official?.inclusions || [
                'Personalized Royal Experience Curation',
                'Dedicated Coimbatore Event Concierge',
                'Surprise Reveal Coordination',
                'Custom Keepsake & Moment Capture',
              ],
            };
          });
          setActiveServices(merged);
        }
      })
      .catch(() => {});
  }, []);

  const serviceOptions = activeServices.map((s) => ({
    value: s.slug,
    label: `${s.title} (From ₹${s.starting_price_inr.toLocaleString('en-IN')})`,
  }));

  const areaOptions = COIMBATORE_AREAS.map((a) => ({
    value: a,
    label: a,
  }));

  const relationshipOptions = RECIPIENT_RELATIONSHIPS.map((r) => ({
    value: r,
    label: r,
  }));

  // Calculate default tomorrow date (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnquirySubmissionInput>({
    resolver: zodResolver(enquirySubmissionSchema),
    defaultValues: {
      idempotency_key: idempotencyKey,
      service_slug: (preselectedService || 'mini-proposal') as any,
      event_date: minDate,
      event_time: '18:30',
      event_area: 'Race Course',
      recipient_relationship: 'Partner/Spouse',
      privacy_consent: true,
    },
  });

  const currentServiceSlug = watch('service_slug') || preselectedService || 'mini-proposal';
  const selectedService =
    activeServices.find((s) => s.slug === currentServiceSlug) ||
    OFFICIAL_SERVICES[currentServiceSlug as keyof typeof OFFICIAL_SERVICES] ||
    activeServices[0];

  // Synchronize idempotency key
  useEffect(() => {
    if (idempotencyKey) {
      setValue('idempotency_key', idempotencyKey);
    }
  }, [idempotencyKey, setValue]);

  // Sync service from query param if changed
  useEffect(() => {
    if (preselectedService) {
      setValue('service_slug', preselectedService as any);
    }
  }, [preselectedService, setValue]);

  const handleSelectServiceCard = (slug: string) => {
    setValue('service_slug', slug as any, { shouldValidate: true });
  };

  const onSubmit = async (data: EnquirySubmissionInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await api.submitEnquiry(data);
      setSuccessData({
        reference_code: response.reference_code,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setServerError(err.message || 'The ancient temple gates refused entry. Please check your inputs and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0e0d0c] text-[#F7F1E5] overflow-hidden">
      {/* Background Atmosphere: Ancient Jungle Temple Ruins */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20 pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('${TEMPLE_IMAGES.background}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/95 via-[#14110e]/90 to-[#0c0a09]/95 pointer-events-none" />

      {/* Decorative Temple Torch Glow Flares */}
      <div className="absolute top-16 left-4 md:left-12 w-48 h-48 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-16 right-4 md:right-12 w-48 h-48 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* TEMPLE RUN GAME HUD BANNER */}
        <header className="temple-stone-card rounded-md p-3 sm:p-4 border-2 border-[#C8A45D]/60 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wider font-mono">
            <div className="flex items-center space-x-2 text-amber-400">
              <Flame size={16} className="text-amber-500 temple-flame-anim" />
              <span className="font-bold">MIRSTOERA EXPEDITION</span>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 text-stone-300">
              <span className="flex items-center gap-1.5">
                <Coins size={14} className="text-[#C8A45D]" />
                <span className="text-[#E8D49E] font-bold">STARTING ₹799+</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Compass size={14} className="text-amber-400" />
                <span>SECTOR: COIMBATORE</span>
              </span>
              <span className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 text-amber-300">
                <Trophy size={13} className="text-[#C8A45D]" />
                <span className="font-bold">ROYAL RUN</span>
              </span>
            </div>
          </div>
        </header>

        {/* SUCCESS CONFIRMATION VIEW — SACRED RELIC CLAIMED */}
        {successData ? (
          <section
            aria-labelledby="success-heading"
            className="temple-stone-monolith p-6 sm:p-12 md:p-16 rounded-lg text-center space-y-6 relative overflow-hidden"
          >
            {/* Ornamental Ancient Corner Runes */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C8A45D]" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C8A45D]" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C8A45D]" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C8A45D]" />

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#2a241e] to-[#12100e] mx-auto flex items-center justify-center border-2 border-[#C8A45D] shadow-[0_0_30px_rgba(200,164,93,0.5)] p-3">
              <MomeraLogo variant="emblem" size={60} alt="MIRSTOERA Royal Seal" priority />
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-xs font-semibold uppercase tracking-widest text-amber-300">
              <Trophy size={14} className="text-[#C8A45D]" />
              <span>Sacred Relic Claimed — Royal Request Logged</span>
            </div>

            <h1 id="success-heading" className="font-serif text-3xl sm:text-5xl font-black text-amber-100 drop-shadow-md">
              Your Royal Request Has Been Received!
            </h1>

            {/* Ancient Relic Reference Code Tablet */}
            <div className="inline-block bg-[#12100e] px-8 py-4 rounded border-2 border-[#C8A45D] my-3 shadow-[0_0_20px_rgba(200,164,93,0.3)]">
              <span className="text-[11px] uppercase tracking-widest text-[#C8A45D] block font-mono">
                Sacred Reference Glyph
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-amber-200 block mt-1">
                {successData.reference_code}
              </span>
            </div>

            {/* Transparent Notice */}
            <div className="max-w-xl mx-auto bg-[#1e1b17]/90 border border-amber-600/40 p-5 rounded text-xs text-stone-300 leading-relaxed text-left space-y-2">
              <p className="font-serif font-bold text-amber-300 text-sm flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                Please Note: Booking Is Not Yet Confirmed
              </p>
              <p>
                No payment has been charged. Our Coimbatore master concierge will review your date and venue logistics, then reach out directly on WhatsApp at{' '}
                <span className="font-bold text-amber-200">+{successData.customer_phone}</span> within a few hours to finalize your customized royal experience.
              </p>
            </div>

            <GoldDivider className="my-6 opacity-60" />

            {/* Direct WhatsApp Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={formatWhatsAppUrl(
                  `Hello MIRSTOERA Concierge! I just claimed royal expedition enquiry ${successData.reference_code} for ${successData.customer_name}. Looking forward to discussing details.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-serif font-bold rounded border border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                >
                  <MessageCircle size={18} /> Connect on WhatsApp Now
                </button>
              </a>
              <Link to="/" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#201c18] hover:bg-[#2b251f] text-[#C8A45D] font-serif font-bold rounded border border-[#C8A45D]/60 hover:border-[#C8A45D] shadow-md transition-all uppercase tracking-wider text-sm"
                >
                  Return to Home
                </button>
              </Link>
            </div>
          </section>
        ) : (
          /* TEMPLE RUN EXPEDITION INVITATION & FORM */
          <div className="space-y-12">
            {/* HERO TITLE & TEMPLE RUN GATEWAY */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1e1b17] border border-[#C8A45D]/60 text-xs font-mono uppercase tracking-widest text-[#E8D49E] shadow-sm">
                <Flame size={14} className="text-amber-500 temple-flame-anim" />
                <span>Temple Run Quest Dispatch • Coimbatore</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-amber-100 tracking-tight drop-shadow-lg">
                Book Your Royal Moment
              </h1>

              <p className="text-sm sm:text-base text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
                Step into the ancient vaults of surprise. Choose your sacred artifact below, enter your quest coordinates, and let our private concierge craft an unforgettable experience.
              </p>

              <GoldDivider className="my-6 opacity-70" />
            </div>

            {/* VISUAL ARTIFACT SELECTOR (4 Online HD Cards from Unsplash) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#C8A45D]/30 pb-2">
                <h2 className="font-serif text-base sm:text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Gem size={18} className="text-[#C8A45D]" />
                  Step 1: Choose Your Experience Relic
                </h2>
                <span className="text-[11px] font-mono text-amber-400">TAP TO EQUIP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeServices.map((srv) => {
                  const isSelected = currentServiceSlug === srv.slug;
                  const relicMeta = SERVICE_RELIC_BADGES[srv.slug] || {
                    rune: '✨',
                    category: 'ROYAL RELIC',
                    difficulty: 'CUSTOM QUEST',
                  };
                  const imgUrl =
                    (srv as any).cover_image_url ||
                    TEMPLE_IMAGES.services[srv.slug as keyof typeof TEMPLE_IMAGES.services] ||
                    TEMPLE_IMAGES.goldenRelic;

                  return (
                    <button
                      key={srv.slug}
                      type="button"
                      onClick={() => handleSelectServiceCard(srv.slug)}
                      className={`text-left rounded-md overflow-hidden transition-all duration-300 relative group flex flex-col justify-between ${
                        isSelected
                          ? 'temple-stone-monolith ring-2 ring-amber-400 temple-glow-gold scale-[1.02]'
                          : 'temple-stone-card hover:border-[#C8A45D] hover:scale-[1.01]'
                      }`}
                    >
                      {/* Card Image Banner */}
                      <div className="h-36 w-full relative overflow-hidden bg-stone-900">
                        <img
                          src={imgUrl}
                          alt={srv.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-[#181513]/40 to-transparent" />

                        {/* Top Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                          <span>{relicMeta.rune}</span>
                          <span>{relicMeta.category}</span>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-stone-950 text-[10px] font-bold uppercase tracking-wider shadow">
                            EQUIPPED
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-serif font-bold text-sm text-amber-100 group-hover:text-amber-300 transition-colors">
                            {srv.title}
                          </h3>
                          <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                            {srv.tagline}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs mt-2">
                          <span className="font-mono text-stone-400 text-[11px]">TICKET</span>
                          <span className="font-serif font-bold text-amber-400 text-sm">
                            ₹{srv.starting_price_inr.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SERVER ERROR ALERT */}
            {serverError && (
              <div className="p-4 bg-red-950/80 border border-red-500 rounded text-xs text-red-200 flex items-center gap-2">
                <AlertCircle size={18} className="shrink-0 text-red-400" />
                <span>{serverError}</span>
              </div>
            )}

            {/* ANCIENT STONE TABLET FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="temple-stone-monolith p-5 sm:p-8 md:p-12 rounded-lg space-y-8 relative overflow-hidden"
              noValidate
            >
              {/* Corner Ornamental Glyphs */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#C8A45D]/60 pointer-events-none" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#C8A45D]/60 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#C8A45D]/60 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#C8A45D]/60 pointer-events-none" />

              {/* STEP 1: CONTACT DETAILS */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2.5 border-b border-[#C8A45D]/30 pb-2">
                  <span className="w-7 h-7 rounded bg-gradient-to-br from-[#C8A45D] to-[#8c6c2e] text-[#16283D] text-xs flex items-center justify-center font-mono font-bold shadow">
                    1
                  </span>
                  <span>Your Contact Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="customer_name"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="customer_name"
                      required
                      placeholder="e.g. Aravind Swaminathan"
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 placeholder-stone-500 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.customer_name
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('customer_name')}
                    />
                    {errors.customer_name && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="customer_phone"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      WhatsApp Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="customer_phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210 (10-digit Indian Mobile)"
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 placeholder-stone-500 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.customer_phone
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('customer_phone')}
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      We coordinate surprise details primarily via WhatsApp.
                    </p>
                    {errors.customer_phone && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.customer_phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 2: EXPERIENCE & EVENT DETAILS */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2.5 border-b border-[#C8A45D]/30 pb-2">
                  <span className="w-7 h-7 rounded bg-gradient-to-br from-[#C8A45D] to-[#8c6c2e] text-[#16283D] text-xs flex items-center justify-center font-mono font-bold shadow">
                    2
                  </span>
                  <span>Experience & Event Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="service_slug"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Select Royal Experience <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="service_slug"
                      required
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.service_slug
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('service_slug')}
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1f1c19] text-amber-100">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.service_slug && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.service_slug.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="recipient_relationship"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Recipient Relationship <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="recipient_relationship"
                      required
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.recipient_relationship
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('recipient_relationship')}
                    >
                      {relationshipOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1f1c19] text-amber-100">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.recipient_relationship && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.recipient_relationship.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* DYNAMIC PACKAGE PREVIEW CARD */}
                {selectedService && (
                  <div className="temple-stone-card text-[#F7F1E5] p-4 rounded border-2 border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-[0_0_20px_rgba(200,164,93,0.2)]">
                    <div className="flex items-center space-x-3">
                      {(selectedService as any).cover_image_url ? (
                        <div className="w-12 h-12 rounded overflow-hidden border border-amber-500 shrink-0 shadow">
                          <img
                            src={(selectedService as any).cover_image_url}
                            alt={selectedService.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-[#100e0c] border border-amber-500 flex items-center justify-center shrink-0 p-1">
                          <MomeraLogo variant="emblem" size={24} alt="Package Crest" />
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-sm text-amber-200 block">
                          {selectedService.title}
                        </span>
                        <span className="text-[11px] text-stone-300 italic">
                          {selectedService.tagline}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <span className="px-3 py-1.5 bg-[#100e0c] text-amber-300 font-serif font-bold rounded border border-amber-500 text-xs shadow-inner">
                        Package from ₹{selectedService.starting_price_inr.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="event_date"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Event Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="event_date"
                      type="date"
                      required
                      min={minDate}
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.event_date
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('event_date')}
                    />
                    {errors.event_date && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.event_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="event_time"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Preferred Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="event_time"
                      type="time"
                      required
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.event_time
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('event_time')}
                    />
                    {errors.event_time && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.event_time.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="event_area"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Coimbatore Area / Landmark <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="event_area"
                      required
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.event_area
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('event_area')}
                    >
                      {areaOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#1f1c19] text-amber-100">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.event_area && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.event_area.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 3: SURPRISE NARRATIVE & PREFERENCES */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2.5 border-b border-[#C8A45D]/30 pb-2">
                  <span className="w-7 h-7 rounded bg-gradient-to-br from-[#C8A45D] to-[#8c6c2e] text-[#16283D] text-xs flex items-center justify-center font-mono font-bold shadow">
                    3
                  </span>
                  <span>Your Surprise Vision</span>
                </h2>

                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="description"
                    className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                  >
                    Describe Your Surprise Vision & Story <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    placeholder="Tell us about the celebrant, the mood you want to create, favorite songs, or any special moments you want included..."
                    className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 placeholder-stone-500 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                      errors.description
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                    }`}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="budget_inr"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Estimated Budget (₹ INR, Optional)
                    </label>
                    <input
                      id="budget_inr"
                      type="number"
                      placeholder="e.g. 2500"
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 placeholder-stone-500 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.budget_inr
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('budget_inr', {
                        setValueAs: (v) => (v === '' || Number.isNaN(Number(v)) ? null : Number(v)),
                      })}
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Helps us tailor extra decor or musicians if desired.
                    </p>
                    {errors.budget_inr && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.budget_inr.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label
                      htmlFor="additional_preferences"
                      className="block text-xs font-semibold tracking-wider uppercase text-amber-200"
                    >
                      Specific Preferences (Optional)
                    </label>
                    <input
                      id="additional_preferences"
                      placeholder="e.g. Favorite flower color, dietary restrictions, quiet setting"
                      className={`w-full px-3.5 py-2.5 bg-[#1f1c19] text-amber-100 placeholder-stone-500 border rounded text-sm transition-all focus:outline-none focus:ring-1 ${
                        errors.additional_preferences
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-stone-700 hover:border-amber-500/60 focus:border-amber-400 focus:ring-amber-400/40'
                      }`}
                      {...register('additional_preferences')}
                    />
                    {errors.additional_preferences && (
                      <p role="alert" className="text-xs text-red-400 font-medium mt-1">
                        {errors.additional_preferences.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* PRIVACY CONSENT CHECKBOX */}
              <div className="pt-4 border-t border-[#C8A45D]/30 space-y-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-amber-600/70 bg-[#1f1c19] text-amber-500 focus:ring-amber-400 focus:ring-offset-stone-900"
                    {...register('privacy_consent')}
                  />
                  <span className="text-xs text-stone-300 leading-relaxed">
                    I agree to MIRSTOERA’s{' '}
                    <Link to="/privacy" target="_blank" className="underline text-amber-300 font-semibold hover:text-amber-200">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link to="/terms" target="_blank" className="underline text-amber-300 font-semibold hover:text-amber-200">
                      Terms & Conditions
                    </Link>
                    . I understand that booking is confirmed only after concierge consultation and quotation agreement.
                  </span>
                </label>
                {errors.privacy_consent && (
                  <p role="alert" className="text-xs text-red-400 font-medium">
                    {errors.privacy_consent.message}
                  </p>
                )}
              </div>

              {/* TEMPLE RUN SUBMISSION BUTTON */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d9b66c] hover:to-[#be9644] text-[#16283D] font-serif font-black text-base sm:text-lg rounded border border-amber-200 shadow-[0_0_25px_rgba(200,164,93,0.5)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 tracking-wider uppercase"
                >
                  {isSubmitting ? (
                    <>
                      <RoyalCrown size={22} className="animate-spin text-[#16283D]" />
                      <span>Transmitting Sacred Glyph...</span>
                    </>
                  ) : (
                    <>
                      <Flame size={20} className="text-amber-900 temple-flame-anim" />
                      <span>Send My Royal Request</span>
                      <ChevronRight size={20} className="text-amber-900" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#C8A45D]" /> Your phone number is kept strictly confidential. Zero spam.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
