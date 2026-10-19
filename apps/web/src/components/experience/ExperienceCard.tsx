import React from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../common/MomeraLogo';
import { ServiceDetailDefinition, ServiceEntity } from '@momera/shared';
import { Check, Sparkles, Flame, Coins, Trophy } from 'lucide-react';

interface ExperienceCardProps {
  service: ServiceDetailDefinition | ServiceEntity;
  featured?: boolean;
}

const SERVICE_IMAGES: Record<string, string> = {
  'secret-gift': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
  'mini-proposal': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
  'birthday-surprise': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
  'hero-entry': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
};

const SERVICE_RUNES: Record<string, { rune: string; badge: string }> = {
  'secret-gift': { rune: '🎁', badge: 'DOORSTEP TREASURE' },
  'mini-proposal': { rune: '💍', badge: 'SACRED TEMPLE VOW' },
  'birthday-surprise': { rune: '👑', badge: 'GRAND SPOTLIGHT' },
  'hero-entry': { rune: '⚡', badge: 'HERO EXPEDITION' },
};

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  service,
  featured = false,
}) => {
  const imageUrl =
    (service as any).cover_image_url ||
    SERVICE_IMAGES[service.slug] ||
    SERVICE_IMAGES['secret-gift'];
  const runeInfo = SERVICE_RUNES[service.slug] || { rune: '✨', badge: 'ROYAL EXPEDITION' };
  const inclusions =
    (service as any).inclusions || [
      'Personalized Royal Experience Curation',
      'Dedicated Coimbatore Event Concierge',
      'Surprise Reveal Coordination',
      'Custom Keepsake & Moment Capture',
    ];

  return (
    <article
      className={`group relative flex flex-col temple-stone-card border transition-all duration-300 rounded-lg overflow-hidden text-left ${
        featured
          ? 'border-[#C8A45D] temple-glow-gold scale-[1.01]'
          : 'border-stone-700/70 hover:border-[#C8A45D]/80 hover:shadow-[0_0_25px_rgba(200,164,93,0.3)]'
      } hover:-translate-y-1.5`}
    >
      {/* Top Banner with Online HD Imagery */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-900">
        <img
          src={imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />

        {/* Quest Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow">
          <span>{runeInfo.rune}</span>
          <span>{runeInfo.badge}</span>
        </div>

        {/* Starting Price Pill */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-bold px-3 py-1 rounded shadow-md flex items-center space-x-1.5 border border-amber-200">
          <Coins size={12} className="text-stone-950" />
          <span className="text-[10px] uppercase tracking-wider">From</span>
          <span className="font-serif font-extrabold text-sm">₹{service.starting_price_inr.toLocaleString('en-IN')}</span>
        </div>

        {/* Center Crest on Hover */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-stone-900/90 border border-amber-400 flex items-center justify-center p-1 shadow">
              <MomeraLogo variant="emblem" size={20} alt="MIRSTOERA Experience Crest" />
            </div>
            <span className="text-xs font-serif italic text-amber-200 drop-shadow line-clamp-1">
              {service.tagline}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-grow flex flex-col justify-between space-y-5 bg-[#171412]">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1.5 font-mono">
            <Flame size={13} className="text-amber-500 temple-flame-anim" />
            <span>Coimbatore Temple Expedition</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 mb-2 group-hover:text-amber-300 transition-colors">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light mb-4">
            {service.description}
          </p>

          {/* Inclusions Highlights */}
          <div className="space-y-2 border-t border-stone-800 pt-3">
            <p className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-400/90 flex items-center gap-1.5">
              <Trophy size={12} className="text-[#C8A45D]" />
              Sacred Package Inclusions:
            </p>
            <ul className="space-y-1.5">
              {inclusions.slice(0, 4).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start text-xs text-stone-300 space-x-2">
                  <Check size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
              {inclusions.length > 4 && (
                <li className="text-[11px] italic text-amber-400 pl-5">
                  + {inclusions.length - 4} more bespoke inclusions
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-800 flex items-center gap-3">
          <Link
            to={`/experiences/${service.slug}`}
            className="flex-1"
          >
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-[#231f1b] hover:bg-[#2e2924] text-amber-300 font-serif font-bold text-xs uppercase tracking-wider rounded border border-amber-600/40 hover:border-amber-400 transition-all text-center shadow"
            >
              Details
            </button>
          </Link>
          <Link
            to={`/book?service=${service.slug}`}
            className="flex-1"
          >
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#C8A45D] via-[#e2c27c] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-xs uppercase tracking-wider rounded border border-amber-200 transition-all text-center shadow-[0_0_15px_rgba(200,164,93,0.3)] hover:scale-[1.02]"
            >
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
};
