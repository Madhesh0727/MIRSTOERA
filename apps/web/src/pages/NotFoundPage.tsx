import React from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { Flame, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 text-center text-stone-200">
      <div className="temple-stone-monolith max-w-md w-full p-8 sm:p-10 rounded-lg shadow-[0_0_35px_rgba(200,164,93,0.3)] space-y-6 relative overflow-hidden">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1b1714] mx-auto flex items-center justify-center border-2 border-[#C8A45D] shadow-[0_0_20px_rgba(200,164,93,0.4)] p-3">
          <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Emblem" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#100e0c] border border-amber-600/40 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          <Flame size={13} className="text-amber-500 temple-flame-anim" />
          <span>404 — Page Not Found</span>
        </div>

        <h1 className="font-serif text-3xl font-black text-amber-100">
          This Moment Is Elsewhere
        </h1>

        <p className="text-xs text-stone-300 font-light leading-relaxed">
          The royal invitation or page you are looking for does not exist or may have been relocated in the ancient temple ruins.
        </p>

        <GoldDivider className="my-4 opacity-60" withCrown={false} />

        <Link to="/">
          <button
            type="button"
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-[#C8A45D] hover:from-amber-400 hover:to-[#dfbf7a] text-stone-950 font-serif font-black text-xs uppercase tracking-wider rounded border border-amber-200 shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Compass size={16} /> Return to MIRSTOERA Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};
