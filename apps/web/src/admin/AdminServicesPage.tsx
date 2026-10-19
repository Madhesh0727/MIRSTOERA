import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ServiceEntity } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import {
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
  X,
  Plus,
  Flame,
  Coins,
  Sparkles,
  Trophy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

// Top 15 Curated Online Cover Images (High-Resolution Unsplash Sources)
export const TOP_15_COVER_IMAGES = [
  {
    id: 1,
    title: 'Secret Luxury Gift Box',
    category: 'Gifting',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Candlelit Proposal Scene',
    category: 'Romance',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Grand Birthday Sparklers',
    category: 'Celebration',
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Hero Dramatic Spotlight Entry',
    category: 'Heroic',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Rooftop Starlight Dinner',
    category: 'Dinner',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Acoustic Violin Serenade',
    category: 'Music',
    url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Ancient Temple & Torchlight',
    category: 'Adventure',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Luxury Champagne Toast',
    category: 'Luxury',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Royal Floral Banquet',
    category: 'Banquet',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Fairytale Fairy Light Canopy',
    category: 'Ambiance',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 11,
    title: 'Gourmet Chocolates & Hamper',
    category: 'Gifting',
    url: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 12,
    title: 'Vintage Wax-Sealed Scroll',
    category: 'Keepsake',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 13,
    title: 'Night Fireworks Sky Spectacle',
    category: 'Grand Entry',
    url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 14,
    title: 'Car Boot Balloon & Floral Reveal',
    category: 'Doorstep',
    url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 15,
    title: 'Private Cinema Screening',
    category: 'Cinema',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
  },
];

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceEntity[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editTagline, setEditTagline] = useState<string>('');
  const [editPriceInr, setEditPriceInr] = useState<number>(0);
  const [editCoverImageUrl, setEditCoverImageUrl] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editDisplayOrder, setEditDisplayOrder] = useState<number>(0);

  // Add New Event Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newPriceInr, setNewPriceInr] = useState<number>(1499);
  const [newCoverImageUrl, setNewCoverImageUrl] = useState<string>(TOP_15_COVER_IMAGES[0].url);
  const [newDescription, setNewDescription] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState<number>(5);
  const [newIsActive, setNewIsActive] = useState<boolean>(true);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      const data = await api.adminGetServices();
      setServices(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const startEdit = (srv: ServiceEntity) => {
    setEditingId(srv.id);
    setEditTitle(srv.title);
    setEditTagline(srv.tagline || '');
    setEditPriceInr(srv.starting_price_inr);
    setEditCoverImageUrl(srv.cover_image_url || '');
    setEditDescription(srv.description);
    setEditIsActive(srv.is_active);
    setEditDisplayOrder(srv.display_order);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: number) => {
    try {
      await api.adminUpdateService(id, {
        title: editTitle,
        tagline: editTagline,
        starting_price_inr: editPriceInr,
        cover_image_url: editCoverImageUrl.trim() || null,
        description: editDescription,
        is_active: editIsActive,
        display_order: editDisplayOrder,
      });
      setSuccessMsg('Experience details updated successfully in the royal catalog.');
      setEditingId(null);
      await fetchServices();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update experience.');
    }
  };

  // Helper to slugify title
  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setNewSlug(generatedSlug);
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim() || !newDescription.trim() || newPriceInr <= 0) {
      setErrorMsg('Please complete all required fields with valid values.');
      return;
    }

    setIsSubmittingNew(true);
    setErrorMsg(null);

    try {
      await api.adminCreateService({
        title: newTitle.trim(),
        slug: newSlug.trim(),
        tagline: newTagline.trim(),
        description: newDescription.trim(),
        starting_price_inr: newPriceInr,
        cover_image_url: newCoverImageUrl.trim() || null,
        is_active: newIsActive,
        display_order: newDisplayOrder,
      });

      setSuccessMsg(`New event "${newTitle}" added to the royal catalog successfully!`);
      setIsAddModalOpen(false);

      // Reset form
      setNewTitle('');
      setNewSlug('');
      setNewTagline('');
      setNewPriceInr(1499);
      setNewCoverImageUrl(TOP_15_COVER_IMAGES[0].url);
      setNewDescription('');
      setNewDisplayOrder(services.length + 1);
      setNewIsActive(true);

      await fetchServices();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create new experience.');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl text-left">
      {/* Header with Add New Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
            <Flame size={12} className="text-amber-500 temple-flame-anim" />
            Royal Catalog Chamber
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-amber-100">
            Experiences, Events & Relic Pricing
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure all public experiences, custom cover images (top 15 online sources included), and introduce new celebratory events.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setSuccessMsg(null);
            setNewDisplayOrder(services.length + 1);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded bg-gradient-to-r from-[#C8A45D] via-[#e2c27c] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-stone-950 font-serif font-black text-xs uppercase tracking-wider border border-amber-200 shadow-[0_0_15px_rgba(200,164,93,0.3)] transition-all hover:scale-[1.02] self-start sm:self-auto cursor-pointer"
        >
          <Plus size={15} className="text-stone-950 stroke-[3]" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/60 rounded text-xs text-emerald-200 flex items-center gap-2.5 shadow-md">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3.5 bg-red-950/80 border border-red-500/60 rounded text-xs text-red-200 flex items-center gap-2.5 shadow-md">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="py-20 text-center space-y-3 temple-stone-monolith p-8 rounded-lg border border-stone-800">
          <RoyalCrown size={28} color="#C8A45D" className="animate-spin mx-auto text-amber-400" />
          <p className="text-xs font-mono text-stone-400 tracking-wider">
            Accessing Coimbatore Royal Catalog Vault...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {services.map((srv) => {
            const isEditing = editingId === srv.id;
            const currentImg = isEditing ? editCoverImageUrl : srv.cover_image_url;

            return (
              <div
                key={srv.id}
                className={`p-6 rounded-lg transition-all border ${
                  isEditing
                    ? 'temple-stone-card border-amber-500 shadow-[0_0_20px_rgba(200,164,93,0.25)]'
                    : 'temple-stone-card border-stone-800 hover:border-amber-600/50 shadow-sm'
                } space-y-4 text-left`}
              >
                {/* Card Top Banner with Cover Image Preview & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
                  <div className="flex items-center space-x-4">
                    {/* Cover Image Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border border-amber-500/60 bg-stone-900 shrink-0 shadow">
                      {currentImg ? (
                        <img
                          src={currentImg}
                          alt={srv.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-amber-400/50 bg-[#161311]">
                          <ImageIcon size={20} />
                          <span className="text-[9px] font-mono mt-1">Preset</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {!isEditing ? (
                        <div>
                          <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
                            {srv.title}
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 border border-stone-700 text-stone-300">
                              /{srv.slug}
                            </span>
                            {!srv.is_active && (
                              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 flex items-center gap-1">
                                <EyeOff size={10} /> Hidden
                              </span>
                            )}
                          </h2>
                          {srv.tagline && (
                            <p className="font-serif italic text-xs text-amber-300/80 mt-0.5">
                              "{srv.tagline}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                            Editing Relic #{srv.id}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editTitle}
                              placeholder="Title"
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="px-2.5 py-1 bg-black/60 border border-stone-700 text-amber-100 rounded text-xs focus:border-amber-400 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={editTagline}
                              placeholder="Tagline"
                              onChange={(e) => setEditTagline(e.target.value)}
                              className="px-2.5 py-1 bg-black/60 border border-stone-700 text-amber-100 rounded text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => startEdit(srv)}
                      className="inline-flex items-center space-x-1.5 text-xs font-serif font-bold px-3 py-1.5 bg-stone-900 text-amber-300 rounded border border-amber-600/40 hover:border-amber-400 hover:bg-stone-800 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit Experience</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleSave(srv.id)}
                        className="inline-flex items-center space-x-1.5 text-xs font-serif font-bold px-3 py-1.5 bg-gradient-to-r from-amber-500 to-[#C8A45D] text-stone-950 rounded border border-amber-200 hover:scale-[1.02] transition-transform cursor-pointer shadow"
                      >
                        <Save size={12} />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex items-center space-x-1.5 text-xs font-serif font-bold px-3 py-1.5 bg-stone-800 text-stone-300 rounded hover:bg-stone-700 transition-colors cursor-pointer"
                      >
                        <X size={12} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Details View vs Edit Mode */}
                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block uppercase text-[10px] font-mono font-bold flex items-center gap-1">
                        <Coins size={11} className="text-amber-400" /> Starting Price
                      </span>
                      <span className="font-serif font-extrabold text-xl text-amber-200">
                        ₹{srv.starting_price_inr.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        ({srv.starting_price_paise} paise)
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase text-[10px] font-mono font-bold">
                        Display Order
                      </span>
                      <span className="font-mono text-sm text-stone-200 font-bold">
                        #{srv.display_order}
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        {srv.is_active ? 'Active on Public Site' : 'Hidden from Public'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-stone-400 block uppercase text-[10px] font-mono font-bold mb-1">
                        Public Description
                      </span>
                      <p className="text-stone-300 leading-relaxed font-light text-xs">
                        {srv.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                          Starting Price (₹ INR)
                        </label>
                        <input
                          type="number"
                          value={editPriceInr}
                          onChange={(e) => setEditPriceInr(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-amber-200 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={editDisplayOrder}
                          onChange={(e) => setEditDisplayOrder(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-stone-200 font-mono text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                          Catalog Visibility
                        </label>
                        <label className="flex items-center space-x-2 mt-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editIsActive}
                            onChange={(e) => setEditIsActive(e.target.checked)}
                            className="rounded border-stone-700 accent-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-stone-300 text-xs">Show on Public Website</span>
                        </label>
                      </div>
                    </div>

                    {/* Cover Image Selector in Edit Mode */}
                    <div className="space-y-2 bg-black/40 p-3 rounded border border-stone-800">
                      <div className="flex items-center justify-between">
                        <label className="block font-mono font-bold uppercase text-[10px] text-amber-300">
                          Cover Image URL (Pick from Top 15 Online Sources or Enter Custom)
                        </label>
                        <span className="text-[10px] text-amber-400/80 font-mono">15 ONLINE PRESETS AVAILABLE</span>
                      </div>

                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={editCoverImageUrl}
                        onChange={(e) => setEditCoverImageUrl(e.target.value)}
                        className="w-full px-3 py-1.5 bg-black/60 border border-stone-700 rounded text-amber-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                      />

                      {/* Top 15 Quick Picker */}
                      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-8 gap-2 pt-2">
                        {TOP_15_COVER_IMAGES.map((img) => (
                          <button
                            key={img.id}
                            type="button"
                            onClick={() => setEditCoverImageUrl(img.url)}
                            className={`relative h-12 rounded overflow-hidden border transition-all ${
                              editCoverImageUrl === img.url
                                ? 'border-amber-400 ring-2 ring-amber-400 scale-105'
                                : 'border-stone-700 hover:border-amber-500 opacity-70 hover:opacity-100'
                            }`}
                            title={img.title}
                          >
                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                            {editCoverImageUrl === img.url && (
                              <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                                <Check size={14} className="text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                        Description (Public Invitation Lore)
                      </label>
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-stone-200 text-xs focus:outline-none focus:border-amber-400 font-light leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Event / Experience Modal with Top 15 Online Cover Image Picker */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl temple-stone-monolith p-6 sm:p-8 rounded-lg border-2 border-[#C8A45D] shadow-[0_0_40px_rgba(0,0,0,0.9)] space-y-5 text-left max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 flex items-center gap-1.5">
                  <Flame size={12} className="text-amber-500 temple-flame-anim" />
                  Expedition Dispatch
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-black text-amber-100">
                  Introduce New Royal Event
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNew} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                    Event / Experience Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starlight Terrace Proposal"
                    value={newTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-amber-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. starlight-terrace-proposal"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-amber-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                  Poetic Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. An intimate evening beneath the celestial Coimbatore sky."
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-amber-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* COVER IMAGE SELECTION: TOP 15 ONLINE HD IMAGES */}
              <div className="space-y-2 bg-[#191512] p-4 rounded-lg border border-amber-500/40">
                <div className="flex items-center justify-between">
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-amber-400" />
                    Cover Image Selection (Top 15 Online Sources) *
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">1-CLICK TO EQUIP</span>
                </div>

                {/* Selected Image Preview */}
                <div className="flex items-center gap-3 bg-black/50 p-2.5 rounded border border-stone-700">
                  <div className="w-16 h-12 rounded overflow-hidden border border-amber-400 shrink-0 bg-stone-900 shadow">
                    {newCoverImageUrl ? (
                      <img src={newCoverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500 text-[10px]">
                        No Image
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Custom Image URL or select from below"
                    value={newCoverImageUrl}
                    onChange={(e) => setNewCoverImageUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-black/60 border border-stone-700 rounded text-amber-100 text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Top 15 Online Image Grid */}
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block mb-1.5">
                    Click any curated online image to equip:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-1 bg-black/30 rounded border border-stone-800">
                    {TOP_15_COVER_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setNewCoverImageUrl(img.url)}
                        className={`group relative h-16 rounded overflow-hidden border transition-all text-left ${
                          newCoverImageUrl === img.url
                            ? 'border-amber-400 ring-2 ring-amber-400 scale-[1.03] shadow-[0_0_10px_rgba(200,164,93,0.5)]'
                            : 'border-stone-800 hover:border-amber-400/70 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[9px] font-mono text-amber-200 line-clamp-1 drop-shadow">
                            {img.title}
                          </span>
                        </div>
                        {newCoverImageUrl === img.url && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-[9px] shadow">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                    Starting Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPriceInr}
                    onChange={(e) => setNewPriceInr(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-amber-200 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newDisplayOrder}
                    onChange={(e) => setNewDisplayOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-stone-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                    Publish Status
                  </label>
                  <label className="flex items-center space-x-2 mt-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsActive}
                      onChange={(e) => setNewIsActive(e.target.checked)}
                      className="rounded border-stone-700 accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-stone-300 text-xs">Active on Site</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-[10px] text-amber-300 mb-1">
                  Public Experience Description * (min 10 characters)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the magical flow of this royal moment, bespoke inclusions, emotional reveal, and ambiance..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-stone-700 rounded text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-xs font-light leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-serif font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2 bg-gradient-to-r from-[#C8A45D] via-[#e2c27c] to-[#a88235] hover:from-[#d8b568] hover:to-[#be9644] text-stone-950 font-serif font-black text-xs uppercase tracking-wider rounded border border-amber-200 shadow-[0_0_15px_rgba(200,164,93,0.3)] transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingNew ? 'Inscribing Relic...' : 'Create Royal Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
