import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/SettingsContext';
import { User, Briefcase, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export const UserProfileTab: React.FC = () => {
  const { settings, updateUserProfile } = useSettings();
  const { userProfile } = settings;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">User Profile</h3>
          <p className="text-sm text-muted-foreground">Your personal information for email signatures</p>
        </div>
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
