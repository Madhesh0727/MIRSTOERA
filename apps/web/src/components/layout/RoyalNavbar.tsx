import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MomeraLogo } from '../common/MomeraLogo';
import { Menu, X, Flame, Sparkles } from 'lucide-react';

export const RoyalNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Experiences', href: '/experiences' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#13110f]/95 backdrop-blur-md border-b border-[#C8A45D]/40 shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Crown */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-[#C8A45D] rounded-sm p-1"
            aria-label="MIRSTOERA Homepage"
          >
            <div className="h-11 w-11 rounded-full bg-[#1b1714] flex items-center justify-center border-2 border-[#C8A45D] shadow-[0_0_15px_rgba(200,164,93,0.4)] p-1.5 group-hover:scale-105 transition-transform duration-200">
              <MomeraLogo variant="emblem" size={32} alt="MIRSTOERA Royal Crest" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-widest text-amber-100 leading-none group-hover:text-amber-300 transition-colors">
                MIRSTOERA
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#C8A45D] font-mono mt-0.5 flex items-center gap-1">
                <Flame size={10} className="text-amber-500 temple-flame-anim" />
                Royal Moments
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-150 py-1 relative ${
                    active
                      ? 'text-amber-300 font-extrabold'
                      : 'text-stone-300 hover:text-amber-400'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-[#C8A45D] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center justify-center text-xs font-mono font-bold uppercase tracking-wider px-5 py-2.5 rounded bg-gradient-to-r from-[#C8A45D] via-[#e2c27c] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-stone-950 border border-amber-200 shadow-[0_0_15px_rgba(200,164,93,0.35)] hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
            >
              <Flame size={14} className="mr-1.5 text-amber-900 temple-flame-anim" />
              Plan My Surprise
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-amber-200 hover:text-amber-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#C8A45D]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#C8A45D]/40 bg-[#161311] px-4 pt-4 pb-6 space-y-3 shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-xs font-mono uppercase tracking-wider rounded ${
                  isActive(link.href)
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 block w-full text-center px-4 py-3 rounded bg-gradient-to-r from-[#C8A45D] to-[#9B7833] text-stone-950 font-bold text-xs font-mono tracking-wider uppercase shadow"
            >
              Plan My Surprise
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
