import React from 'react';
import { GoldDivider } from '../components/common/GoldDivider';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { Flame, ShieldCheck } from 'lucide-react';
import { usePublicSettings } from '../context/SettingsContext';

export const PrivacyPage: React.FC = () => {
  const { settings } = usePublicSettings();
  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#1b1714] border border-amber-500 mx-auto flex items-center justify-center mb-3 shadow">
            <Flame size={20} className="text-amber-500 temple-flame-anim" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-amber-100 drop-shadow-md">
            Privacy Policy & Data Notice
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-mono">Last Updated: October 2026 • MIRSTOERA Experiences</p>
          <GoldDivider className="my-5 opacity-60" />
        </div>

        <div className="temple-stone-monolith p-8 sm:p-10 rounded-lg shadow-lg space-y-6 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 1. Information We Collect
            </h2>
            <p>
              When you submit a surprise enquiry on MIRSTOERA, we collect your name, WhatsApp phone number, event date, preferred time, event locality in Coimbatore, recipient relationship, and surprise narrative details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 2. How We Use Your Data
            </h2>
            <p>
              Your information is used exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Communicate with you on WhatsApp regarding quotation, feasibility, and customization.</li>
              <li>Coordinate doorstep delivery and on-site surprise reveals in Coimbatore.</li>
              <li>Maintain internal booking records and customer service quality.</li>
            </ul>
            <p>
              We <strong>never sell, rent, or trade</strong> your personal contact information to third-party advertisers or data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400" />
              3. Client Photography & Video Privacy
            </h2>
            <p>
              All memory reels, videos, and photos captured during surprise reveals belong to the client. MIRSTOERA will <strong>never publish customer photos or videos online without explicit, prior written consent</strong> from both the customer and the recipient.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 4. Data Retention & Deletion
            </h2>
            <p>
              Enquiry data is retained for administrative and accounting verification. If you wish to have your contact details or previous enquiry records permanently removed from our database, contact our concierge at <a href={`mailto:${settings.email}`} className="font-mono font-bold text-amber-300 hover:underline">{settings.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
