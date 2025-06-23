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

interface Settings {
  projectName: string;
  configs: Record<string, IframeConfig>;
}

interface SettingsContextType {
  settings: Settings;
  configs: Record<string, IframeConfig>;
  getConfig: (id: string) => IframeConfig | undefined;
  updateConfig: (id: string, newConfig: Partial<IframeConfig>) => void;
  createConfig: (config: IframeConfig) => void;
  deleteConfig: (id: string) => void;
  updateProjectName: (name: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    projectName: 'Picito',
    configs: defaultConfigs
  });

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('picito-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    localStorage.setItem('picito-settings', JSON.stringify(newSettings));
  };

  const updateProjectName = (name: string) => {
    setSettings(prev => {
      const updated = { ...prev, projectName: name };
      saveSettings(updated);
      return updated;
    });
  };

  const getConfig = (id: string) => settings.configs[id];

  const updateConfig = (id: string, newConfig: Partial<IframeConfig>) => {
    setSettings(prev => {
      if (!prev.configs[id]) return prev;
      const updated = {
        ...prev,
        configs: {
          ...prev.configs,
          [id]: { ...prev.configs[id], ...newConfig }
        }
      };
      saveSettings(updated);
      return updated;
    });
  };

  const createConfig = (config: IframeConfig) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        configs: { ...prev.configs, [config.id]: config }
      };
      saveSettings(updated);
      return updated;
    });
  };

  const deleteConfig = (id: string) => {
    setSettings(prev => {
      const { [id]: _, ...rest } = prev.configs;
      const updated = { ...prev, configs: rest };
      saveSettings(updated);
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      configs: settings.configs,
      getConfig,
      updateConfig,
      createConfig,
      deleteConfig,
      updateProjectName
    }}>
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
