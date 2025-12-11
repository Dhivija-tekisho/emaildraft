import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '@/context/SettingsContext';
import { EmailInclusions } from '@/types/meeting';
import { FileText, CheckSquare, User, Building2, Briefcase } from 'lucide-react';

interface InclusionsPanelProps {
  inclusions: EmailInclusions;
  onUpdate: (inclusions: EmailInclusions) => void;
}

export const InclusionsPanel: React.FC<InclusionsPanelProps> = ({ inclusions, onUpdate }) => {
  const { settings } = useSettings();
  const enabledServices = settings.services.filter((s) => s.enabled);

  const toggleInclusion = (key: keyof Omit<EmailInclusions, 'selectedServices'>) => {
    onUpdate({ ...inclusions, [key]: !inclusions[key] });
  };

  const toggleService = (serviceId: string) => {
    const currentServices = inclusions.selectedServices;
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter((id) => id !== serviceId)
      : [...currentServices, serviceId];
    onUpdate({ ...inclusions, selectedServices: newServices });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <h3 className="font-semibold mb-4">Include in Email</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="inc-summary" className="flex items-center gap-2 cursor-pointer">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Meeting Summary
          </Label>
          <Switch
            id="inc-summary"
            checked={inclusions.meetingSummary}
            onCheckedChange={() => toggleInclusion('meetingSummary')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="inc-actions" className="flex items-center gap-2 cursor-pointer">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            Action Items / Next Steps
          </Label>
          <Switch
            id="inc-actions"
            checked={inclusions.actionItems}
            onCheckedChange={() => toggleInclusion('actionItems')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="inc-user" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            User Profile Block
          </Label>
          <Switch
            id="inc-user"
            checked={inclusions.userProfile}
            onCheckedChange={() => toggleInclusion('userProfile')}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="inc-company" className="flex items-center gap-2 cursor-pointer">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Company Profile Block
          </Label>
          <Switch
            id="inc-company"
            checked={inclusions.companyProfile}
            onCheckedChange={() => toggleInclusion('companyProfile')}
          />
        </div>

        {enabledServices.length > 0 && (
          <div className="pt-3 border-t border-border">
            <Label className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Services / Solutions
            </Label>
            <div className="space-y-2 pl-6">
              {enabledServices.map((service) => (
                <div key={service.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={inclusions.selectedServices.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <Label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
