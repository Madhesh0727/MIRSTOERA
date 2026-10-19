import React from 'react';
import { Link } from 'react-router-dom';
import { MomeraLogo } from '../components/common/MomeraLogo';
import { GoldDivider } from '../components/common/GoldDivider';
import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck, Flame, Compass, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { COIMBATORE_AREAS } from '@momera/shared';
import { usePublicSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings, formatWhatsAppUrl, formatTelUrl } = usePublicSettings();
  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#1b1714] mx-auto flex items-center justify-center border-2 border-[#C8A45D] mb-4 shadow-[0_0_25px_rgba(200,164,93,0.4)] p-3">
            <MomeraLogo variant="emblem" size={44} alt="MIRSTOERA Emblem" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-2 flex items-center justify-center gap-1.5">
            <Flame size={13} className="text-amber-500 temple-flame-anim" />
            Expedition Outpost & Dispatch Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 drop-shadow-md">
            Contact MIRSTOERA
          </h1>
          <p className="text-sm text-stone-300 mt-3 font-light leading-relaxed">
            We are here to assist with surprise concept planning, venue logistics, custom calligraphy requests, and quotation inquiries.
          </p>
          <GoldDivider className="my-6 opacity-60" />
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1: Direct Concierge Channels */}
          <div className="temple-stone-monolith p-8 rounded-lg space-y-6 shadow-lg relative overflow-hidden">
            <h2 className="font-serif text-xl font-bold text-amber-200 border-b border-[#C8A45D]/30 pb-3 flex items-center gap-2">
              <Compass size={18} className="text-amber-400" />
              Direct Concierge Desk
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-amber-300 block text-xs uppercase font-bold">Direct Telephone</span>
                  <a href={formatTelUrl()} className="text-stone-200 hover:text-amber-300 font-mono text-base font-bold">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-amber-300 block text-xs uppercase font-bold">WhatsApp Concierge (Fastest Response)</span>
                  <a
                    href={formatWhatsAppUrl("Hello MIRSTOERA Concierge, I would like to inquire about a surprise experience.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    Start WhatsApp Chat ({settings.whatsapp}) →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-amber-300 block text-xs uppercase font-bold">Email Concierge</span>
                  <a href={`mailto:${settings.email}`} className="text-stone-300 font-mono hover:text-amber-300">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-amber-300 block text-xs uppercase font-bold">Concierge Hours</span>
                  <span className="text-stone-300">{settings.business_hours}</span>
                </div>
              </div>
            </div>

            {/* Social Media Outpost */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 block">
                Official Social Profiles:
              </span>
              <div className="flex items-center gap-3">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded bg-[#1c1815] border border-amber-600/40 hover:border-amber-400 text-amber-300 hover:text-amber-100 flex items-center gap-1.5 text-xs font-mono shadow hover:scale-105 transition-all"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded bg-[#1c1815] border border-amber-600/40 hover:border-amber-400 text-amber-300 hover:text-amber-100 flex items-center gap-1.5 text-xs font-mono shadow hover:scale-105 transition-all"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded bg-[#1c1815] border border-amber-600/40 hover:border-amber-400 text-amber-300 hover:text-amber-100 flex items-center gap-1.5 text-xs font-mono shadow hover:scale-105 transition-all"
                  >
                    <Youtube size={14} /> YouTube
                  </a>
                )}
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded bg-[#1c1815] border border-amber-600/40 hover:border-amber-400 text-amber-300 hover:text-amber-100 flex items-center gap-1.5 text-xs font-mono shadow hover:scale-105 transition-all"
                  >
                    <Twitter size={14} /> X
                  </a>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <Link to="/book">
                <button
                  type="button"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-[#C8A45D] hover:from-amber-400 hover:to-[#dfbf7a] text-stone-950 font-serif font-black text-xs uppercase tracking-wider rounded border border-amber-200 shadow hover:scale-[1.01] transition-all"
                >
                  Submit a Royal Request Online
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Coverage Areas in Coimbatore */}
          <div className="temple-stone-card p-8 rounded-lg space-y-6 shadow-md border border-stone-800">
            <h2 className="font-serif text-xl font-bold text-amber-200 border-b border-[#C8A45D]/30 pb-3 flex items-center gap-2">
              <MapPin size={20} className="text-amber-400" />
              Coimbatore Service Coverage
            </h2>

            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Our surprise coordinators and delivery team cover all major residential, hospitality, and commercial localities in Coimbatore:
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {COIMBATORE_AREAS.map((area) => (
                <span
                  key={area}
                  className="px-2.5 py-1 bg-[#12100e] text-amber-200 border border-amber-600/40 rounded text-[11px] font-mono shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400 shrink-0" />
              <span>Full confidentiality and discreet coordination guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
