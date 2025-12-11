import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/context/SettingsContext';
import { FileText, Eye } from 'lucide-react';

export const SignatureTab: React.FC = () => {
  const { settings, updateEmailSettings } = useSettings();
  const { emailSettings, userProfile, companyProfile } = settings;

  const renderPreview = () => {
    let html = emailSettings.signatureTemplate;
    html = html.replace(/{{name}}/g, userProfile.name);
    html = html.replace(/{{jobTitle}}/g, userProfile.jobTitle);
    html = html.replace(/{{phone}}/g, userProfile.phone);
    html = html.replace(/{{email}}/g, userProfile.email);
    html = html.replace(/{{companyName}}/g, companyProfile.companyName);
    html = html.replace(/{{website}}/g, companyProfile.website);
    return html;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Signature Template</h3>
          <p className="text-sm text-muted-foreground">HTML template for your email signature</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Available Variables</Label>
        <div className="flex flex-wrap gap-2">
          {['{{name}}', '{{jobTitle}}', '{{phone}}', '{{email}}', '{{companyName}}', '{{website}}'].map((v) => (
            <code key={v} className="px-2 py-1 rounded bg-muted text-xs font-mono">
              {v}
            </code>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signatureTemplate">HTML Template</Label>
        <Textarea
          id="signatureTemplate"
          value={emailSettings.signatureTemplate}
          onChange={(e) => updateEmailSettings({ signatureTemplate: e.target.value })}
          rows={10}
          className="font-mono text-xs"
          placeholder="Enter HTML signature template..."
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Label>
        <div
          className="p-4 rounded-lg border border-border bg-card"
          dangerouslySetInnerHTML={{ __html: renderPreview() }}
        />
      </div>
    </div>
  );
};
