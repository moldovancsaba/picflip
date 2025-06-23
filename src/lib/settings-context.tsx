"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { IframeConfig } from './types';

const defaultConfigs: Record<string, IframeConfig> = {};

interface Settings {
  configs: Record<string, IframeConfig>;
}

interface SettingsContextType {
  settings: Settings;
  configs: Record<string, IframeConfig>;
  getConfig: (id: string) => IframeConfig | undefined;
  updateConfig: (id: string, newConfig: Partial<IframeConfig>) => void;
  createConfig: (config: IframeConfig) => void;
  deleteConfig: (id: string) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    configs: defaultConfigs
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from API on mount
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          configs: data.configs || defaultConfigs
        });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load settings:', error);
        setIsLoading(false);
      });
  }, []);

  const saveSettings = async (newSettings: Settings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) throw new Error('Failed to save settings');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
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
      isLoading
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
