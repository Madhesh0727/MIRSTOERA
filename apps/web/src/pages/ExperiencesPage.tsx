import React, { useState, useEffect } from 'react';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { ExperienceCard } from '../components/experience/ExperienceCard';
import { OFFICIAL_SERVICES, ServiceDetailDefinition, ServiceEntity } from '@momera/shared';
import { api } from '../services/api';
import { Flame, Compass, MessageCircle, Sparkles } from 'lucide-react';
import { usePublicSettings } from '../context/SettingsContext';

export const ExperiencesPage: React.FC = () => {
  const { formatWhatsAppUrl } = usePublicSettings();
  const [filter, setFilter] = useState<'all' | 'gifting' | 'romance' | 'celebration'>('all');
  const [servicesList, setServicesList] = useState<(ServiceDetailDefinition | ServiceEntity)[]>(
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
          setServicesList(merged);
        }
      })
      .catch(() => {
        // Fallback to initial OFFICIAL_SERVICES
      });
  }, []);

  const filteredServices = servicesList.filter((service) => {
    if (filter === 'all') return true;
    if (filter === 'gifting') return service.slug.includes('gift') || service.slug === 'secret-gift';
    if (filter === 'romance') return service.slug.includes('proposal') || service.slug.includes('candlelight') || service.slug === 'mini-proposal';
    if (filter === 'celebration')
      return (
        service.slug.includes('birthday') ||
        service.slug.includes('entry') ||
        service.slug.includes('anniversary') ||
        service.slug === 'birthday-surprise' ||
        service.slug === 'hero-entry'
      );
    return true;
  });

  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      {/* Ancient Temple Backdrop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1b1714] mx-auto flex items-center justify-center border-2 border-[#C8A45D] mb-4 shadow-[0_0_25px_rgba(200,164,93,0.4)] p-3">
            <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Emblem" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2 flex items-center justify-center gap-1.5">
            <Flame size={13} className="text-amber-500 temple-flame-anim" />
            The MIRSTOERA Expedition Vault
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 drop-shadow-md">
            Royal Moments Experiences
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mt-3 font-light leading-relaxed">
            Explore our handcrafted surprise services in Coimbatore. Each experience is designed to evoke authentic emotion, cinematic beauty, and unforgettable memories.
          </p>
          <GoldDivider className="my-6 opacity-60" />

          {/* Filter Pills Styled as Ancient Stone Runes */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-bold shadow-[0_0_15px_rgba(200,164,93,0.5)] border border-amber-200 scale-105'
                  : 'bg-[#1b1714] text-stone-300 border border-stone-700/80 hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              All Experiences ({servicesList.length})
            </button>
            <button
              onClick={() => setFilter('romance')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                filter === 'romance'
                  ? 'bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-bold shadow-[0_0_15px_rgba(200,164,93,0.5)] border border-amber-200 scale-105'
                  : 'bg-[#1b1714] text-stone-300 border border-stone-700/80 hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              Romantic Proposals
            </button>
            <button
              onClick={() => setFilter('celebration')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                filter === 'celebration'
                  ? 'bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-bold shadow-[0_0_15px_rgba(200,164,93,0.5)] border border-amber-200 scale-105'
                  : 'bg-[#1b1714] text-stone-300 border border-stone-700/80 hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              Birthdays & Entries
            </button>
            <button
              onClick={() => setFilter('gifting')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                filter === 'gifting'
                  ? 'bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-bold shadow-[0_0_15px_rgba(200,164,93,0.5)] border border-amber-200 scale-105'
                  : 'bg-[#1b1714] text-stone-300 border border-stone-700/80 hover:border-amber-400 hover:text-amber-300'
              }`}
            >
              Secret Doorstep Gifting
            </button>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredServices.map((service) => (
            <ExperienceCard
              key={service.slug}
              service={service}
              featured={service.slug === 'birthday-surprise'}
            />
          ))}
        </div>

        {/* Custom Experience Banner Styled as Sacred Monolith */}
        <div className="temple-stone-monolith p-8 sm:p-10 rounded-lg text-center max-w-3xl mx-auto border-2 border-[#C8A45D]/60 shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
            <Compass size={14} className="text-[#C8A45D]" />
            <span>Coimbatore Custom Experience Planning</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-amber-100">
            Have a Completely Unique Vision in Mind?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl mx-auto">
            From intimate anniversary rooftop dinners to grand stage hero entries across Coimbatore, our private concierge will bring your exact fairytale scenario to life.
          </p>
          <div className="pt-2">
            <a
              href={formatWhatsAppUrl("Hello MIRSTOERA! I have a custom surprise concept I would love to plan in Coimbatore.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-[#C8A45D] via-[#e2c27c] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-stone-950 font-serif font-black text-xs uppercase tracking-wider rounded border border-amber-200 shadow-[0_0_20px_rgba(200,164,93,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} /> Consult Our Concierge on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
