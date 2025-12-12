import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/context/SettingsContext';
import { Building2, Globe, MapPin, Quote, FileText, Mail } from 'lucide-react';

export const CompanyProfileTab: React.FC = () => {
  const { settings, updateCompanyProfile } = useSettings();
  const { companyProfile } = settings;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Company Profile</h3>
          <p className="text-sm text-muted-foreground">Your company details for email branding</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              Company Name *
            </Label>
            <Input
              id="companyName"
              value={companyProfile.companyName}
              onChange={(e) => updateCompanyProfile({ companyName: e.target.value })}
              placeholder="TechVentures Inc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              Website *
            </Label>
            <Input
              id="website"
              value={companyProfile.website}
              onChange={(e) => updateCompanyProfile({ website: e.target.value })}
              placeholder="www.techventures.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline" className="flex items-center gap-2">
            <Quote className="h-3.5 w-3.5 text-muted-foreground" />
            Tagline *
          </Label>
          <Input
            id="tagline"
            value={companyProfile.tagline}
            onChange={(e) => updateCompanyProfile({ tagline: e.target.value })}
            placeholder="Transforming Ideas into Digital Reality"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Address *
          </Label>
          <Textarea
            id="address"
            value={companyProfile.address}
            onChange={(e) => updateCompanyProfile({ address: e.target.value })}
            placeholder="123 Innovation Drive, Suite 400, New York, NY 10001"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl" className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Logo URL (optional)
          </Label>
          <Input
            id="logoUrl"
            value={companyProfile.logoUrl || ''}
            onChange={(e) => updateCompanyProfile({ logoUrl: e.target.value })}
            placeholder="/Tekisho-Logo.jpg or https://example.com/logo.jpg"
          />
          <p className="text-xs text-muted-foreground">
            Path to logo image (e.g., /Tekisho-Logo.jpg for public folder, or full URL)
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legalName" className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Legal Name (optional)
            </Label>
            <Input
              id="legalName"
              value={companyProfile.legalName || ''}
              onChange={(e) => updateCompanyProfile({ legalName: e.target.value })}
              placeholder="TechVentures International Inc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supportEmail" className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Support Email (optional)
            </Label>
            <Input
              id="supportEmail"
              type="email"
              value={companyProfile.supportEmail || ''}
              onChange={(e) => updateCompanyProfile({ supportEmail: e.target.value })}
              placeholder="support@techventures.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
