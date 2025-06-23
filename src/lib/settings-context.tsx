"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { IframeConfig } from './types';

const defaultConfigs: Record<string, IframeConfig> = {
  asroma: {
    id: 'asroma',
    name: 'AS Roma',
    contentUrl: 'https://api.seyu.hu/backend/backend/slideshow?event-id=1769&slideshow-id=2192&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjE5Mn0.GpxJfbgRUdkuI-NdT3e6qCQ7KNhdmq-MTvShHC5e-CU',
    originalWidth: 1400,
    originalHeight: 1244,
    aspectRatioX: 9,
    aspectRatioY: 8,
    backgroundColor: '#FF0000',
    backgroundImageUrl: '',
    horizontalAlignment: 'center',
    verticalAlignment: 'middle',
  },
};

interface SettingsContextType {
  configs: Record<string, IframeConfig>;
  getConfig: (id: string) => IframeConfig | undefined;
  updateConfig: (id: string, newConfig: Partial<IframeConfig>) => void;
  createConfig: (config: IframeConfig) => void;
  deleteConfig: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, IframeConfig>>(defaultConfigs);

  useEffect(() => {
    // Load configs from localStorage on mount
    const savedConfigs = localStorage.getItem('picito-configs');
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs));
    }
  }, []);

  const saveConfigs = (newConfigs: Record<string, IframeConfig>) => {
    localStorage.setItem('picito-configs', JSON.stringify(newConfigs));
  };

  const getConfig = (id: string) => configs[id];

  const updateConfig = (id: string, newConfig: Partial<IframeConfig>) => {
    setConfigs(prev => {
      if (!prev[id]) return prev;
      const updated = {
        ...prev,
        [id]: { ...prev[id], ...newConfig }
      };
      saveConfigs(updated);
      return updated;
    });
  };

  const createConfig = (config: IframeConfig) => {
    setConfigs(prev => {
      const updated = { ...prev, [config.id]: config };
      saveConfigs(updated);
      return updated;
    });
  };

  const deleteConfig = (id: string) => {
    setConfigs(prev => {
      const { [id]: _, ...rest } = prev;
      saveConfigs(rest);
      return rest;
    });
  };

  return (
    <SettingsContext.Provider value={{ configs, getConfig, updateConfig, createConfig, deleteConfig }}>
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
