import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { User, Briefcase, Phone, Mail, MessageCircle, MapPin, Loader, Search } from 'lucide-react';

export const UserProfileTab: React.FC = () => {
  const { settings, updateUserProfile, loadUserFromDatabase, searchAndLoadUser, isLoadingProfile } = useSettings();
  const { userProfile } = settings;
  const [searchInput, setSearchInput] = useState('');

  // Load user data from database on component mount
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('logged_in_user_id');
    if (loggedInUserId) {
      loadUserFromDatabase(loggedInUserId);
    }
  }, [loadUserFromDatabase]);

  const handleSearch = async () => {
    if (searchInput.trim()) {
      await searchAndLoadUser(searchInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">User Profile</h3>
          <p className="text-sm text-muted-foreground">Your personal information for email signatures</p>
        </div>
        {isLoadingProfile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}
      </div>

      {/* Search/Auto-fill Section */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <Label className="flex items-center gap-2 mb-3 text-sm font-semibold text-blue-900 dark:text-blue-100">
          <Search className="h-4 w-4" />
          Auto-fill from Database
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter user ID (1) or first name (Michael)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoadingProfile}
          />
          <Button 
            onClick={handleSearch} 
            disabled={isLoadingProfile}
            className="whitespace-nowrap"
          >
            {isLoadingProfile ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
          Sample: ID "1" or name "Michael" will auto-fill all details
        </p>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name *
            </Label>
            <Input
              id="name"
              value={userProfile.name}
              onChange={(e) => updateUserProfile({ name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              Job Title *
            </Label>
            <Input
              id="jobTitle"
              value={userProfile.jobTitle}
              onChange={(e) => updateUserProfile({ jobTitle: e.target.value })}
              placeholder="Business Development Manager"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone *
            </Label>
            <Input
              id="phone"
              value={userProfile.phone}
              onChange={(e) => updateUserProfile({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              onChange={(e) => updateUserProfile({ email: e.target.value })}
              placeholder="john.doe@company.com"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
              WhatsApp (optional)
            </Label>
            <Input
              id="whatsapp"
              value={userProfile.whatsapp || ''}
              onChange={(e) => updateUserProfile({ whatsapp: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              Location (optional)
            </Label>
            <Input
              id="location"
              value={userProfile.location || ''}
              onChange={(e) => updateUserProfile({ location: e.target.value })}
              placeholder="New York, NY"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
