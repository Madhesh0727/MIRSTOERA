import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicSettings, BRAND_CONSTANTS } from '@momera/shared';
import { api } from '../services/api';

export interface SettingsContextType {
  settings: PublicSettings;
  loading: boolean;
  formatWhatsAppUrl: (message: string) => string;
  formatTelUrl: () => string;
  refetchSettings: () => Promise<void>;
}

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  brand_name: BRAND_CONSTANTS.NAME,
  tagline: BRAND_CONSTANTS.TAGLINE,
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: BRAND_CONSTANTS.DEFAULT_EMAIL,
  service_coverage: BRAND_CONSTANTS.LOCATION,
  business_hours: BRAND_CONSTANTS.DEFAULT_BUSINESS_HOURS,
  instagram_url: BRAND_CONSTANTS.DEFAULT_INSTAGRAM,
  facebook_url: BRAND_CONSTANTS.DEFAULT_FACEBOOK,
  youtube_url: BRAND_CONSTANTS.DEFAULT_YOUTUBE,
  twitter_url: BRAND_CONSTANTS.DEFAULT_TWITTER,
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_PUBLIC_SETTINGS,
  loading: false,
  formatWhatsAppUrl: (msg: string) => `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`,
  formatTelUrl: () => `tel:+919876543210`,
  refetchSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_PUBLIC_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getPublicSettings();
      if (data) {
        setSettings({
          ...DEFAULT_PUBLIC_SETTINGS,
          ...data,
        });
      }
    } catch {
      // Fallback silently to DEFAULT_PUBLIC_SETTINGS
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatWhatsAppUrl = (message: string) => {
    let digits = (settings.whatsapp || BRAND_CONSTANTS.DEFAULT_WHATSAPP).replace(/\D/g, '');
    if (digits.length === 10) {
      digits = `91${digits}`;
    }
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  };

  const formatTelUrl = () => {
    const raw = settings.phone || BRAND_CONSTANTS.DEFAULT_PHONE;
    return `tel:${raw.replace(/\s+/g, '')}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        formatWhatsAppUrl,
        formatTelUrl,
        refetchSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const usePublicSettings = () => useContext(SettingsContext);
