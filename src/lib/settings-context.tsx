"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type HorizontalAlignment = 'left' | 'center' | 'right';
type VerticalAlignment = 'top' | 'middle' | 'bottom';

interface Settings {
  contentUrl: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatioX: number;
  aspectRatioY: number;
  backgroundColor: string;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
}

const defaultSettings: Settings = {
  contentUrl: 'https://api.seyu.hu/backend/backend/slideshow?event-id=1769&slideshow-id=2192&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjE5Mn0.GpxJfbgRUdkuI-NdT3e6qCQ7KNhdmq-MTvShHC5e-CU',
  originalWidth: 1400,
  originalHeight: 1244,
  aspectRatioX: 9,
  aspectRatioY: 8,
  backgroundColor: '#FF0000',
  horizontalAlignment: 'center',
  verticalAlignment: 'middle',
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('picflip-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Save to localStorage
      localStorage.setItem('picflip-settings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
