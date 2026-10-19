import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoyalNavbar } from './RoyalNavbar';
import { RoyalFooter } from './RoyalFooter';

const TEMPLE_ATMOSPHERE_BG = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop';

export const RoyalLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0d0c] text-[#F7F1E5] relative selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden">
      {/* Global Ambient Temple Jungle Backdrop */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed opacity-15 pointer-events-none scale-105"
        style={{ backgroundImage: `url('${TEMPLE_ATMOSPHERE_BG}')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0908]/90 via-[#120f0c]/90 to-[#0a0908]/95 pointer-events-none" />

      {/* Global Ambient Torch Flares */}
      <div className="fixed top-20 left-4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-20 right-4 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <RoyalNavbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <RoyalFooter />
    </div>
  );
};
