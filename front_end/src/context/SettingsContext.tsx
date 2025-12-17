import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, defaultSettings } from '@/types/settings';
import { leadService } from '@/services/leadService';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateUserProfile: (profile: Partial<AppSettings['userProfile']>) => void;
  updateCompanyProfile: (profile: Partial<AppSettings['companyProfile']>) => void;
  updateEmailSettings: (emailSettings: Partial<AppSettings['emailSettings']>) => void;
  toggleService: (serviceId: string) => void;
  addService: (name: string, description: string) => void;
  removeService: (serviceId: string) => void;
  loadUserFromDatabase: (userId: string) => Promise<void>;
  searchAndLoadUser: (searchTerm: string) => Promise<void>;
  isLoadingProfile: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('leadq-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem('leadq-settings', JSON.stringify(settings));
  }, [settings]);

  const loadUserFromDatabase = async (userId: string) => {
    try {
      setIsLoadingProfile(true);
      const lead = await leadService.getLeadById(userId);
      
      if (!lead) {
        console.error('Lead not found');
        return;
      }
      
      // Update user profile from database
      // Combine first_name and last_name into Full Name
      updateUserProfile({
        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        jobTitle: lead.job_title || '',
        email: lead.email || '',
        phone: lead.phone_number || '',
        location: lead.location || '',
      });
      
      // Company profile data removed - will connect to separate endpoint/table
    } catch (error) {
      console.error('Error loading user from database:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const searchAndLoadUser = async (searchTerm: string) => {
    try {
      setIsLoadingProfile(true);
      
      // First try to load by ID (fastest)
      let lead = await leadService.getLeadById(searchTerm);
      
      // If not found by ID, search by name
      if (!lead) {
        const allLeads = await leadService.getAllLeads();
        lead = allLeads.find(l => 
          (l.first_name && l.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (l.last_name && l.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (l.first_name && l.last_name && `${l.first_name} ${l.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || null;
      }
      
      if (!lead) {
        alert('User not found. Try searching by first/last name or user ID');
        return;
      }
      
      // Update user profile from database - Combine first_name + last_name
      updateUserProfile({
        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
        jobTitle: lead.job_title || '',
        email: lead.email || '',
        phone: lead.phone_number || '',
        location: lead.location || '',
      });
      
      // Company profile data removed - will connect to separate endpoint/table
    } catch (error) {
      console.error('Error searching and loading user:', error);
      alert('Error loading user. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

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
        loadUserFromDatabase,
        searchAndLoadUser,
        isLoadingProfile,
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
