import React from 'react';
import { GoldDivider } from '../components/common/GoldDivider';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { Flame, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen py-12 sm:py-16 text-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#1b1714] border border-amber-500 mx-auto flex items-center justify-center mb-3 shadow">
            <Flame size={20} className="text-amber-500 temple-flame-anim" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-amber-100 drop-shadow-md">
            Booking Conditions & Terms of Service
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-mono">Version 1.0 • Applicable for Coimbatore Operations</p>
          <GoldDivider className="my-5 opacity-60" />
        </div>

        <div className="temple-stone-monolith p-8 sm:p-10 rounded-lg shadow-lg space-y-6 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 1. Nature of Website Enquiries
            </h2>
            <p>
              Submission of an enquiry through this website represents an initial booking request and expression of interest. It <strong>does not constitute a binding booking confirmation</strong> or guarantee slot reservation until reviewed by our concierge and confirmed with customized pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 2. Pricing & Quotations
            </h2>
            <p>
              All prices indicated on public catalog cards are starting prices for standard inclusions in central Coimbatore. Final quotations depend on customized letters, extra decorations, customized cakes/gifts, and extended delivery travel outside city limits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-400" />
              3. Venue Permissions & Safety Standards
            </h2>
            <p>
              The customer is responsible for ensuring that the surprise venue (café, private residence, restaurant, or private hall) permits surprise entries, background music, and smartphone filming.
            </p>
            <p className="font-mono text-amber-300 bg-[#161311] p-3 rounded border border-amber-600/40">
              MIRSTOERA enforces a strict safety policy: zero dangerous pyrotechnics, fireworks, or public road obstruction. Any request compromising personal safety or local laws will be declined.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 4. Respect for Recipient Comfort
            </h2>
            <p>
              Proposals and surprise reveals must respect the emotional comfort and privacy of the recipient. Our crew conducts all operations with discretion, politeness, and sensitivity.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-amber-200 flex items-center gap-2">
              <span className="text-amber-400">✦</span> 5. Rescheduling & Cancellation Policy
            </h2>
            <p>
              Notice of rescheduling must be provided at least 24 hours prior to the scheduled execution time. For cancellations, customized calligraphy or personalized items already handcrafted cannot be refunded.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
