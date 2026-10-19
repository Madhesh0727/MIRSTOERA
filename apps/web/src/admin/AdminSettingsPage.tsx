import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminSettings } from '@momera/shared';
import { RoyalCrown } from '../components/common/RoyalCrown';
import { RoyalButton } from '../components/common/RoyalButton';
import { CheckCircle2, AlertCircle, Save, Instagram, Facebook, Youtube, Twitter, Globe } from 'lucide-react';
import { usePublicSettings } from '../context/SettingsContext';

export const AdminSettingsPage: React.FC = () => {
  const { refetchSettings } = usePublicSettings();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const data = await api.adminGetSettings();
      setSettings(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof AdminSettings, val: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: val,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.adminUpdateSettings({
        brand_name: settings.brand_name,
        tagline: settings.tagline,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        notification_recipient: settings.notification_recipient,
        email: settings.email,
        service_coverage: settings.service_coverage,
        business_hours: settings.business_hours,
        instagram_url: settings.instagram_url,
        facebook_url: settings.facebook_url,
        youtube_url: settings.youtube_url,
        twitter_url: settings.twitter_url,
      });
      await refetchSettings();
      setSuccessMsg('Operational settings and public channels saved successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-2">
        <RoyalCrown size={24} color="#C8A45D" className="animate-spin mx-auto" />
        <p className="text-xs text-[#292623]/70">Loading business configuration...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl text-left">
      <div className="border-b border-[#E3D8C4] pb-4">
        <span className="text-[10px] uppercase font-semibold tracking-widest text-[#9B7833] block">
          Platform Configuration
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#16283D]">
          Business & Contact Settings
        </h1>
        <p className="text-xs text-[#292623]/70 mt-1">
          Configure contact numbers, coverage area, and automated alert destinations.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-[#692D40] rounded-sm text-xs text-[#692D40] flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-[#FCF9F2] p-8 border border-[#E3D8C4] rounded-sm shadow-sm space-y-6 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Brand Name
            </label>
            <input
              type="text"
              value={settings.brand_name}
              onChange={(e) => handleChange('brand_name', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Customer Contact Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              WhatsApp Concierge Number
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Admin Alert Recipient Phone
            </label>
            <input
              type="text"
              value={settings.notification_recipient}
              onChange={(e) => handleChange('notification_recipient', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
            <span className="text-[10px] text-[#292623]/60 block mt-1">
              Receives SMS/WhatsApp alerts when new enquiries are received.
            </span>
          </div>

          <div>
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Concierge Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Service Coverage Area
            </label>
            <input
              type="text"
              value={settings.service_coverage}
              onChange={(e) => handleChange('service_coverage', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold uppercase text-[#16283D] mb-1">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.business_hours}
              onChange={(e) => handleChange('business_hours', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
            />
          </div>
        </div>

        {/* Social Media & Public Outpost Links */}
        <div className="pt-6 border-t border-[#E3D8C4] space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#16283D] flex items-center gap-2">
              <Globe size={16} className="text-[#9B7833]" />
              Official Social Profiles & Channel Links
            </h3>
            <p className="text-[11px] text-[#292623]/70">
              Configure your public social channels. These links will automatically be displayed across the landing page, footer, and contact desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-[#16283D] mb-1 flex items-center gap-1.5">
                <Instagram size={14} className="text-[#C8A45D]" /> Instagram Profile URL
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/mirstoera.in"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#16283D] mb-1 flex items-center gap-1.5">
                <Facebook size={14} className="text-[#C8A45D]" /> Facebook Page URL
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/mirstoera"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#16283D] mb-1 flex items-center gap-1.5">
                <Youtube size={14} className="text-[#C8A45D]" /> YouTube Channel URL
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/@mirstoera"
                value={settings.youtube_url || ''}
                onChange={(e) => handleChange('youtube_url', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-[#16283D] mb-1 flex items-center gap-1.5">
                <Twitter size={14} className="text-[#C8A45D]" /> X / Twitter Profile URL
              </label>
              <input
                type="url"
                placeholder="https://twitter.com/mirstoera"
                value={settings.twitter_url || ''}
                onChange={(e) => handleChange('twitter_url', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E3D8C4] rounded-sm focus:outline-none focus:border-[#C8A45D]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E3D8C4]">
          <RoyalButton
            type="submit"
            variant="primary-gold"
            size="md"
            isLoading={isSaving}
          >
            <Save size={14} className="mr-1.5 inline" /> Save Settings
          </RoyalButton>
        </div>
      </form>
    </div>
  );
};
