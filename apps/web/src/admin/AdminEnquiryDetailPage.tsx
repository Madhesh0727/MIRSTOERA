import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { EnquiryEntity, EnquiryStatus, VALID_STATUS_TRANSITIONS } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { RoyalButton } from '../components/common/RoyalButton';
import {
  Phone,
  MessageCircle,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';

export const AdminEnquiryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const enquiryId = parseInt(id || '0', 10);

  const [enquiry, setEnquiry] = useState<EnquiryEntity | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status mutation state
  const [newStatus, setNewStatus] = useState<string>('');
  const [quotedInr, setQuotedInr] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // Standalone note state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const loadEnquiry = async () => {
    try {
      const data = await api.adminGetEnquiryById(enquiryId);
      setEnquiry(data.enquiry);
      setNotes(data.notes);
      setWhatsappUrl(data.whatsapp_url);
      setNewStatus(data.enquiry.status);
      if (data.enquiry.quoted_price_inr) {
        setQuotedInr(String(data.enquiry.quoted_price_inr));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load enquiry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enquiryId) {
      loadEnquiry();
    }
  }, [enquiryId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry) return;
    setIsUpdatingStatus(true);
    setStatusSuccessMsg(null);
    setError(null);

    try {
      const parsedQuoted = quotedInr ? parseInt(quotedInr, 10) : undefined;
      const updated = await api.adminUpdateEnquiryStatus(enquiryId, {
        status: newStatus,
        quoted_price_inr: isNaN(parsedQuoted as any) ? undefined : parsedQuoted,
        note: statusNote || undefined,
      });
      setEnquiry(updated);
      setStatusNote('');
      setStatusSuccessMsg(`Status successfully transitioned to ${newStatus}`);
      await loadEnquiry();
    } catch (err: any) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsAddingNote(true);

    try {
      await api.adminAddEnquiryNote(enquiryId, newNoteText.trim());
      setNewNoteText('');
      await loadEnquiry();
    } catch (err: any) {
      setError(err.message || 'Failed to add internal note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RoyalCrown size={28} color="#C8A45D" className="animate-spin mx-auto" />
        <p className="text-xs uppercase font-semibold text-[#16283D]">Loading Enquiry Record...</p>
      </div>
    );
  }

  if (error && !enquiry) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-300 rounded-sm">
        <AlertCircle size={24} className="text-[#692D40] mx-auto mb-2" />
        <p className="text-xs text-[#692D40] font-semibold">{error}</p>
        <Link to="/admin/enquiries" className="mt-4 inline-block text-xs underline text-[#16283D]">
          ← Back to Enquiries Table
        </Link>
      </div>
    );
  }

  if (!enquiry) return null;

  const allowedTransitions = VALID_STATUS_TRANSITIONS[enquiry.status as EnquiryStatus] || [];

  return (
    <div className="space-y-8 max-w-5xl text-left">
      {/* Back link & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E3D8C4] pb-4">
        <div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-semibold text-[#9B7833] hover:underline flex items-center gap-1 mb-1"
          >
            <ArrowLeft size={13} /> Back to Enquiries
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
              {enquiry.reference_code}
            </h1>
            <span className="px-2.5 py-0.5 rounded-sm text-xs font-bold font-mono uppercase bg-[#16283D] text-[#C8A45D] border border-[#C8A45D]">
              {enquiry.status}
            </span>
          </div>
          <span className="text-[11px] text-[#292623]/60">
            Received: {new Date(enquiry.created_at).toLocaleString()}
          </span>
        </div>

        {/* Quick Customer Contact Actions */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#25D366] text-white rounded-sm text-xs font-semibold shadow-sm hover:bg-[#1EBE5B] transition-colors"
          >
            <MessageCircle size={15} />
            <span>Open WhatsApp Chat</span>
          </a>

          <a
            href={`tel:+${enquiry.customer_phone}`}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#16283D] text-[#F7F1E5] rounded-sm text-xs font-semibold hover:bg-[#253D5B] transition-colors"
          >
            <Phone size={14} />
            <span>Call Customer</span>
          </a>
        </div>
      </div>

      {statusSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{statusSuccessMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-[#692D40] rounded-sm text-xs text-[#692D40] flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (2/3): Submission Details & Narrative */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer & Event Details Card */}
          <div className="bg-[#FCF9F2] p-6 border border-[#E3D8C4] rounded-sm shadow-sm space-y-4">
            <h2 className="font-serif text-base font-bold text-[#16283D] border-b border-[#E3D8C4] pb-2 flex items-center gap-2">
              <User size={16} className="text-[#C8A45D]" /> Customer & Event Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#292623]/60 block">Customer Name</span>
                <span className="font-semibold text-sm text-[#16283D]">{enquiry.customer_name}</span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">WhatsApp Number</span>
                <span className="font-mono font-semibold text-sm text-[#16283D]">
                  +{enquiry.customer_phone}
                </span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Experience Selected</span>
                <span className="font-semibold text-[#16283D]">
                  {enquiry.service_title || 'Royal Experience'}
                </span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Recipient Relationship</span>
                <span className="font-semibold text-[#16283D]">
                  {enquiry.recipient_relationship}
                </span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Event Date & Time</span>
                <span className="font-semibold text-[#16283D]">
                  {enquiry.event_date} at {enquiry.event_time}
                </span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Coimbatore Area</span>
                <span className="font-semibold text-[#16283D]">{enquiry.event_area}</span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Customer Estimated Budget</span>
                <span className="font-semibold text-[#16283D]">
                  {enquiry.budget_inr ? `₹${enquiry.budget_inr.toLocaleString('en-IN')}` : 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-[#292623]/60 block">Confirmed / Quoted Price</span>
                <span className="font-serif font-bold text-sm text-[#9B7833]">
                  {enquiry.quoted_price_inr
                    ? `₹${enquiry.quoted_price_inr.toLocaleString('en-IN')}`
                    : 'Awaiting Quotation'}
                </span>
              </div>
            </div>
          </div>

          {/* Surprise Vision & Story Narrative */}
          <div className="bg-[#FCF9F2] p-6 border border-[#E3D8C4] rounded-sm shadow-sm space-y-3">
            <h2 className="font-serif text-base font-bold text-[#16283D] border-b border-[#E3D8C4] pb-2 flex items-center gap-2">
              <FileText size={16} className="text-[#C8A45D]" /> Surprise Vision & Customer Narrative
            </h2>
            <div className="p-4 bg-white border border-[#E3D8C4] rounded-sm text-xs sm:text-sm text-[#292623] leading-relaxed whitespace-pre-wrap font-serif italic">
              "{enquiry.description}"
            </div>
            {enquiry.additional_preferences && (
              <div className="text-xs text-[#292623]/80 pt-2">
                <span className="font-semibold text-[#16283D]">Additional Preferences: </span>
                <span>{enquiry.additional_preferences}</span>
              </div>
            )}
          </div>

          {/* Internal Notes & Follow-up Log */}
          <div className="bg-[#FCF9F2] p-6 border border-[#E3D8C4] rounded-sm shadow-sm space-y-4">
            <h2 className="font-serif text-base font-bold text-[#16283D] border-b border-[#E3D8C4] pb-2">
              Internal Concierge Notes ({notes.length})
            </h2>

            {notes.length === 0 ? (
              <p className="text-xs text-[#292623]/60 italic py-2">
                No internal notes recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-white border border-[#E3D8C4] rounded-sm text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#292623]/60">
                      <span className="font-semibold text-[#16283D]">
                        {note.admin_name || note.admin_email || 'Concierge Admin'}
                      </span>
                      <span>{new Date(note.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-[#292623] leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Append Note Form */}
            <form onSubmit={handleAddNote} className="pt-3 border-t border-[#E3D8C4] flex gap-2">
              <input
                type="text"
                placeholder="Log customer conversation or follow-up note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-grow px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
              />
              <RoyalButton
                type="submit"
                variant="royal-navy"
                size="sm"
                isLoading={isAddingNote}
                disabled={!newNoteText.trim()}
              >
                Add Note
              </RoyalButton>
            </form>
          </div>
        </div>

        {/* Right Column (1/3): Status Progression & Workflow */}
        <div className="space-y-6">
          <div className="bg-[#FCF9F2] p-6 border-2 border-[#C8A45D] rounded-sm shadow-royal space-y-4 text-left">
            <h2 className="font-serif text-base font-bold text-[#16283D] border-b border-[#E3D8C4] pb-2">
              Manage Status & Quotation
            </h2>

            <form onSubmit={handleStatusUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#16283D] mb-1">
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm font-semibold text-[#16283D] focus:outline-none focus:border-[#C8A45D]"
                >
                  <option value={enquiry.status}>Current: {enquiry.status}</option>
                  {allowedTransitions.map((st) => (
                    <option key={st} value={st}>
                      Transition to → {st}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#292623]/60 mt-1">
                  Allowed transitions: {allowedTransitions.join(', ') || 'Terminal state'}
                </p>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#16283D] mb-1">
                  Record Quotation (₹ INR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2499"
                  value={quotedInr}
                  onChange={(e) => setQuotedInr(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#16283D] mb-1">
                  Status Transition Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Spoke to customer; agreed on customized violin accompaniment..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm text-xs focus:outline-none focus:border-[#C8A45D]"
                />
              </div>

              <RoyalButton
                type="submit"
                variant="primary-gold"
                size="md"
                fullWidth
                isLoading={isUpdatingStatus}
                disabled={newStatus === enquiry.status && !quotedInr && !statusNote}
              >
                Apply Status & Quotation
              </RoyalButton>
            </form>
          </div>

          {/* Workflow Sequence Guide */}
          <div className="bg-[#FCF9F2] p-5 border border-[#E3D8C4] rounded-sm text-xs space-y-2.5">
            <h3 className="font-serif font-bold text-[#16283D]">Standard Royal Workflow</h3>
            <div className="space-y-1.5 text-[11px] text-[#292623]/70 font-mono">
              <p className={enquiry.status === 'NEW' ? 'font-bold text-blue-900' : ''}>1. NEW (Received)</p>
              <p className={enquiry.status === 'CONTACTED' ? 'font-bold text-amber-900' : ''}>2. CONTACTED (WhatsApp initiated)</p>
              <p className={enquiry.status === 'QUOTED' ? 'font-bold text-purple-900' : ''}>3. QUOTED (Price agreed)</p>
              <p className={enquiry.status === 'CONFIRMED' ? 'font-bold text-emerald-900' : ''}>4. CONFIRMED (Arrangements locked)</p>
              <p className={enquiry.status === 'COMPLETED' ? 'font-bold text-[#16283D]' : ''}>5. COMPLETED (Event executed)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
