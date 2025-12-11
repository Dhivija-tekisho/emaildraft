import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, defaultSettings } from '@/types/settings';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateUserProfile: (profile: Partial<AppSettings['userProfile']>) => void;
  updateCompanyProfile: (profile: Partial<AppSettings['companyProfile']>) => void;
  updateEmailSettings: (emailSettings: Partial<AppSettings['emailSettings']>) => void;
  toggleService: (serviceId: string) => void;
  addService: (name: string, description: string) => void;
  removeService: (serviceId: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('leadq-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('leadq-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateUserProfile = (profile: Partial<AppSettings['userProfile']>) => {
    setSettings(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile },
    }));
  };

  const updateCompanyProfile = (profile: Partial<AppSettings['companyProfile']>) => {
    setSettings(prev => ({
      ...prev,
      companyProfile: { ...prev.companyProfile, ...profile },
    }));
  };

  const updateEmailSettings = (emailSettings: Partial<AppSettings['emailSettings']>) => {
    setSettings(prev => ({
      ...prev,
      emailSettings: { ...prev.emailSettings, ...emailSettings },
    }));
  };

  const toggleService = (serviceId: string) => {
    setSettings(prev => ({
      ...prev,
      services: prev.services.map(s =>
        s.id === serviceId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const addService = (name: string, description: string) => {
    const newService = {
      id: Date.now().toString(),
      name,
      description,
      enabled: true,
    };
    setSettings(prev => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const removeService = (serviceId: string) => {
    setSettings(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId),
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateUserProfile,
        updateCompanyProfile,
        updateEmailSettings,
        toggleService,
        addService,
        removeService,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
