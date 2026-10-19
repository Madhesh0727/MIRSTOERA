import React from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { Feather, ShieldCheck, Flame, Compass, Sparkles } from 'lucide-react';

const STORY_BG = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1b1714] mx-auto flex items-center justify-center border-2 border-[#C8A45D] mb-4 shadow-[0_0_25px_rgba(200,164,93,0.4)] p-3">
            <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Emblem" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2 flex items-center justify-center gap-1.5">
            <Flame size={13} className="text-amber-500 temple-flame-anim" />
            The Origin & Ancient Expedition Lore
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 drop-shadow-md">
            Our Story
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-amber-300 mt-2">
            "Every Moment Deserves a Crown."
          </p>
          <GoldDivider className="my-6 opacity-60" />
        </div>

        {/* Narrative Section 1: The Genesis as a Sacred Stone Monolith */}
        <section className="temple-stone-monolith p-8 sm:p-12 rounded-lg space-y-6 text-left leading-relaxed relative overflow-hidden shadow-lg">
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#C8A45D]/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#C8A45D]/60 pointer-events-none" />

          <h2 className="font-serif text-2xl font-bold text-amber-200 flex items-center gap-2">
            <Flame size={20} className="text-amber-500 temple-flame-anim" />
            Why MIRSTOERA Exists
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light">
            We live in a world where celebrations have increasingly become automated. A hurried delivery of a box, a forwarded WhatsApp graphic, or a generic gift voucher often replaces what human beings crave most: <em>to feel deeply cherished, valued, and honored</em>.
          </p>
          <p className="text-sm sm:text-base text-stone-300 font-light">
            MIRSTOERA was established in Coimbatore with a single conviction: celebration is a sacred art form. When you want to tell someone you love them, celebrate a parent’s milestone, or propose to the person you wish to spend your life with, the experience should feel like opening an exquisite royal letter sealed with gold foil and devotion.
          </p>
        </section>

        {/* Narrative Section 2: Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          <div className="temple-stone-card p-6 sm:p-8 rounded-lg space-y-3 border border-stone-800">
            <div className="w-10 h-10 rounded bg-[#100e0c] border border-amber-500/60 flex items-center justify-center text-amber-400 shadow">
              <Feather size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-amber-200">
              The Emotional Script
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Every MIRSTOERA surprise is written like an emotional film scene. We select the background music that defines your relationship, hand-pen your messages on textured royal paper, and coordinate the reveal so the emotional climax feels pure and heartfelt.
            </p>
          </div>

          <div className="temple-stone-card p-6 sm:p-8 rounded-lg space-y-3 border border-stone-800">
            <div className="w-10 h-10 rounded bg-[#100e0c] border border-amber-500/60 flex items-center justify-center text-amber-400 shadow">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-amber-200">
              Dignity, Discretion & Safety
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              We hold ourselves to the highest ethical and safety standards. No hazardous fireworks, no public nuisance, and no awkward stunts. We respect the recipient's comfort, privacy, and personal boundaries above everything else.
            </p>
          </div>
        </section>

        {/* Narrative Section 3: Coimbatore Roots */}
        <section className="temple-stone-monolith p-8 sm:p-12 rounded-lg text-center space-y-6 relative overflow-hidden shadow-[0_0_35px_rgba(200,164,93,0.3)]">
          <span className="text-xs font-mono uppercase font-bold text-amber-400 tracking-widest block">
            Rooted in Tamil Nadu
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-amber-100">
            Handcrafted in Coimbatore
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            From the quiet residential avenues of RS Puram and Race Course to celebrations in Peelamedu, Saibaba Colony, and Saravanampatti, our crew understands the warmth, hospitality, and cultural aesthetics of Coimbatore.
          </p>
          <div className="pt-2">
            <Link to="/book">
              <button
                type="button"
                className="px-8 py-3.5 bg-gradient-to-r from-[#C8A45D] via-[#f0d089] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-[#16283D] font-serif font-black text-sm uppercase tracking-wider rounded border border-amber-200 shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <Flame size={16} className="text-amber-950 temple-flame-anim" />
                Plan a Royal Surprise With Us
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
