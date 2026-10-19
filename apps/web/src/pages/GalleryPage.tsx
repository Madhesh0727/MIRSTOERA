import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { Sparkles, Eye, X, Flame, Gem } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  concept_tag: string;
  description: string;
  details: string;
  img: string;
}

export const GalleryPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const concepts: GalleryItem[] = [
    {
      id: 1,
      title: 'Wax-Sealed Royal Love Letter',
      category: 'Mini Movie Proposal',
      concept_tag: 'Calligraphy & Ambiance',
      description: 'Hand-lettered custom calligraphy on heavy vintage cotton paper, sealed with burgundy beeswax and a brass royal crest.',
      details: 'Crafted individually for every proposal. Delivered alongside long-stem Dutch red roses and subtle fairy lighting.',
      img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 2,
      title: 'Midnight Doorstep Gift Box',
      category: 'Secret Gift Delivery',
      concept_tag: 'Doorstep Reveal',
      description: 'Matte navy gift box tied with double-faced champagne gold satin ribbon, placed quietly on the doorstep at midnight.',
      details: 'Includes artisanal dark chocolates, personalized message card, and quiet doorstep delivery coordination.',
      img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Cinematic Balloon Backdrop',
      category: 'Cinematic Birthday Surprise',
      concept_tag: 'Event Styling',
      description: 'Organic garland arrangement using matte royal navy, ivory, and reflective chrome gold balloons with a warm fairy light curtain.',
      details: 'Assembled within 30 minutes in private living rooms, rooftop terraces, or intimate garden spaces across Coimbatore.',
      img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 4,
      title: 'Hero Entrance Walk & Flair',
      category: 'Cinematic Hero Entry',
      concept_tag: 'Cinematography',
      description: 'Slow-motion 4K entrance coordination with synchronized background music, sunglasses props, and celebratory entourage cues.',
      details: 'Shot by our mobile cinematographers with high dynamic range and edited into a shareable reel within 24 hours.',
      img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 5,
      title: 'Candlelit Rose Pathway',
      category: 'Mini Movie Proposal',
      concept_tag: 'Proposal Setup',
      description: 'A pathway of red rose petals illuminated with warm LED tea lights leading to an intimate romantic question.',
      details: 'Strictly flameless, safe, battery-powered amber lighting for complete safety in indoor and garden venues.',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 6,
      title: 'Gold-Embossed Birthday Scroll',
      category: 'Cinematic Birthday Surprise',
      concept_tag: 'Keepsake Paper',
      description: 'A personalized royal scroll highlighting memorable dates, inside jokes, and heartfelt wishes from loved ones.',
      details: 'Rolled and tied with vintage gold thread, serving as a permanent keepsake for years to come.',
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2 flex items-center justify-center gap-1.5">
            <Flame size={13} className="text-amber-500 temple-flame-anim" />
            Visual Inspiration & Sacred Vaults
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 drop-shadow-md">
            The MIRSTOERA Gallery
          </h1>
          <p className="text-sm text-stone-300 mt-3 font-light leading-relaxed">
            Illustrative concepts showcasing our bespoke paper artistry, lighting ambiance, and cinematic celebration design in Coimbatore.
          </p>
          <p className="text-[11px] text-stone-400 italic mt-1">
            (To protect our clients’ personal privacy, all gallery displays feature curated design concepts and authorized styling.)
          </p>
          <GoldDivider className="my-6 opacity-60" />
        </div>

        {/* Concept Cards Grid with HD Online Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {concepts.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer temple-stone-card rounded-lg overflow-hidden border border-stone-800 hover:border-amber-400 shadow-md hover:shadow-[0_0_25px_rgba(200,164,93,0.35)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Visual Header Box with Online Image */}
              <div className="h-52 w-full relative overflow-hidden bg-stone-900">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-[#14110f]/40 to-transparent" />

                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                  {item.category}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-amber-200 tracking-wider">
                    {item.concept_tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-stone-900/90 border border-amber-400/80 flex items-center justify-center text-amber-400 shadow">
                    <Eye size={14} />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-3 bg-[#171412]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light leading-relaxed mt-1 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                  <span>TAP TO INSPECT GLYPH</span>
                  <span className="text-amber-300 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Dialog for Inspected Artifact */}
        {selectedItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="temple-stone-monolith max-w-lg w-full p-6 sm:p-8 rounded-lg relative overflow-hidden shadow-[0_0_50px_rgba(200,164,93,0.5)] border-2 border-amber-400 text-left space-y-4">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-1 rounded bg-[#100e0c] text-stone-400 hover:text-amber-300 border border-stone-700"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>

              <div className="h-44 w-full rounded overflow-hidden relative">
                <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110f] via-transparent to-transparent" />
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                {selectedItem.category} • {selectedItem.concept_tag}
              </div>

              <h3 id="modal-title" className="font-serif text-2xl font-black text-amber-100">
                {selectedItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="p-4 bg-[#1b1714] border border-stone-800 rounded text-xs space-y-1">
                <p className="font-mono font-bold text-amber-300 uppercase">Execution Notes:</p>
                <p className="text-stone-300 font-light">{selectedItem.details}</p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Link to="/book">
                  <button
                    type="button"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 font-serif font-bold text-xs uppercase tracking-wider rounded border border-amber-200 shadow hover:scale-105 transition-all"
                  >
                    Request This Concept
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
