import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { OFFICIAL_SERVICES, ServiceDetailDefinition } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { GoldDivider } from '../components/common/GoldDivider';
import {
  Check,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Flame,
  Coins,
  Trophy,
  Compass,
} from 'lucide-react';

const SERVICE_HERO_IMAGES: Record<string, string> = {
  'secret-gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1920&auto=format&fit=crop',
  'mini-proposal': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1920&auto=format&fit=crop',
  'birthday-surprise': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1920&auto=format&fit=crop',
  'hero-entry': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
};

export const ExperienceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !OFFICIAL_SERVICES[slug]) {
    return <Navigate to="/experiences" replace />;
  }

  const service: ServiceDetailDefinition = OFFICIAL_SERVICES[slug];
  const allServices = Object.values(OFFICIAL_SERVICES).filter((s) => s.slug !== slug);
  const heroImage = SERVICE_HERO_IMAGES[slug] || SERVICE_HERO_IMAGES['secret-gift'];

  const faqs = [
    {
      q: 'How far in advance should I book this experience?',
      a: 'We recommend booking at least 48 to 72 hours in advance to guarantee coordination, custom calligraphy, and preferred time slots across Coimbatore.',
    },
    {
      q: 'Can the background music or letter be customized?',
      a: 'Yes, completely! Once your enquiry is received, our concierge contacts you on WhatsApp to collect your exact letter text, favorite songs, and customized timings.',
    },
    {
      q: 'Do you take advance payment on this website?',
      a: 'No advance payment is collected online. We first confirm your venue feasibility, timing, and customizations, and provide a final transparent quotation before confirming.',
    },
  ];

  return (
    <div className="pb-24 text-stone-200">
      {/* 1. HERO SECTION WITH HD ONLINE BACKGROUND */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#C8A45D]/40 text-center overflow-hidden">
        {/* Ancient Temple Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 pointer-events-none scale-105"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#15120f]/85 to-[#0e0d0c] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1e1b17] border border-amber-500/60 text-xs font-mono uppercase tracking-widest text-amber-300 shadow">
            <Flame size={14} className="text-amber-500 temple-flame-anim" />
            <span>{service.tagline}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-amber-100 drop-shadow-md">
            {service.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
            {service.description}
          </p>

          {/* Pricing Pill & CTA */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-5 temple-stone-card text-stone-200 p-4 sm:px-8 sm:py-4 rounded-lg border-2 border-amber-500/70 shadow-[0_0_30px_rgba(200,164,93,0.3)]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block">
                Starting Package
              </span>
              <span className="font-serif font-black text-2xl sm:text-3xl text-amber-300">
                ₹{service.starting_price_inr.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-10 w-[1px] bg-stone-700 hidden sm:block" />
            <Link to={`/book?service=${service.slug}`}>
              <button
                type="button"
                className="px-8 py-3 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-xs sm:text-sm uppercase tracking-wider rounded border border-amber-200 shadow-md transition-all hover:scale-105 flex items-center gap-2"
              >
                Book This Experience <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT BODY */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-14">
        {/* Package Inclusions Checklist */}
        <section className="temple-stone-monolith p-8 sm:p-12 rounded-lg relative overflow-hidden shadow-lg">
          <h2 className="font-serif text-2xl font-bold text-amber-200 mb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" />
            What’s Included in The Royal Package
          </h2>
          <p className="text-xs text-stone-400 font-light mb-6">
            Every element is carefully prepared by our team in Coimbatore to ensure flawless delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.inclusions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3.5 bg-[#1b1714]/80 border border-stone-800 rounded"
              >
                <Check size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-200">{item}</span>
              </div>
            ))}
          </div>

          {service.exclusions && service.exclusions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-stone-800 text-xs text-stone-400">
              <span className="font-semibold text-amber-300">Note on Exclusions: </span>
              {service.exclusions.join(' ')}
            </div>
          )}
        </section>

        {/* Safety & Conditions Guidelines */}
        {(service.conditions || service.safety_guidelines) && (
          <section className="temple-stone-card p-6 sm:p-8 rounded-lg text-left border border-amber-600/40">
            <h3 className="font-serif text-lg font-bold text-amber-200 mb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-400" />
              Conditions & Safety Standards
            </h3>
            <ul className="space-y-2 text-xs text-stone-300 font-light list-disc pl-5 leading-relaxed">
              {service.conditions?.map((c, idx) => (
                <li key={`c-${idx}`}>{c}</li>
              ))}
              {service.safety_guidelines?.map((s, idx) => (
                <li key={`s-${idx}`}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Frequently Asked Questions */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="font-serif text-2xl font-bold text-amber-100">
              Frequently Asked Questions
            </h3>
            <GoldDivider className="my-3 opacity-60" withCrown={false} />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="temple-stone-card p-5 rounded-lg text-left border border-stone-800">
                <h4 className="font-serif text-sm font-bold text-amber-200 flex items-center gap-2 mb-1.5">
                  <HelpCircle size={15} className="text-amber-400" />
                  {faq.q}
                </h4>
                <p className="text-xs text-stone-300 font-light pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Floating / Sticky Booking CTA Section */}
        <section className="text-center temple-stone-monolith p-8 sm:p-12 rounded-lg relative overflow-hidden shadow-[0_0_35px_rgba(200,164,93,0.3)]">
          <h3 className="font-serif text-2xl sm:text-3xl font-black text-amber-100 mb-2">
            Reserve Your {service.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg mx-auto mb-6">
            Submit your event date and Coimbatore location. Our concierge will reach out via WhatsApp to tailor the details.
          </p>
          <Link to={`/book?service=${service.slug}`}>
            <button
              type="button"
              className="px-8 py-3.5 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-sm uppercase tracking-wider rounded border border-amber-200 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 mx-auto"
            >
              <Flame size={16} className="text-amber-950 temple-flame-anim" />
              Proceed to Booking Form <ArrowRight size={16} />
            </button>
          </Link>
        </section>

        {/* Related Experiences */}
        <section className="pt-8 border-t border-stone-800">
          <h3 className="font-serif text-xl font-bold text-amber-100 mb-6 text-center">
            Other Signature Experiences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {allServices.slice(0, 3).map((s) => (
              <div
                key={s.slug}
                className="temple-stone-card p-5 rounded-lg flex flex-col justify-between border border-stone-800 hover:border-amber-400 transition-all"
              >
                <div>
                  <h4 className="font-serif text-base font-bold text-amber-200 mb-1">{s.title}</h4>
                  <p className="text-xs text-amber-400 font-mono font-bold mb-2">
                    From ₹{s.starting_price_inr.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-stone-400 font-light line-clamp-2">{s.description}</p>
                </div>
                <Link
                  to={`/experiences/${s.slug}`}
                  className="mt-4 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  View Experience →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
