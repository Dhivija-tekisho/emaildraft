import { useEffect, useState } from 'react';
import { leadService } from '@/services/leadService';

export interface UserProfileData {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  job_title: string;
  website?: string;
  address?: string;
  contact_emails?: string[];
  contact_phones?: string[];
  notes?: string;
  capture_method?: string;
  intake_status?: string;
}

export const useUserProfile = (userId?: string) => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        
        const lead = await leadService.getLeadById(userId);
        setProfileData(lead);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
        console.error('Error loading user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  return {
    profileData,
    loading,
    error,
  };
};
