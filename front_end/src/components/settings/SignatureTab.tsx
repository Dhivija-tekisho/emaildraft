import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/context/SettingsContext';
import { FileText, Eye, Palette } from 'lucide-react';
import { EmailBodyTemplate } from '@/types/settings';
import { generateEmailBodyWithTemplate } from '@/lib/emailTemplates';
import { sampleMeetingSummary } from '@/types/meeting';

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

  // Generate email body preview with selected template
  const emailBodyPreview = useMemo(() => {
    const greeting = emailSettings.tone === 'professional' 
      ? `Dear ${sampleMeetingSummary.recipientName},` 
      : `Hi ${sampleMeetingSummary.recipientName},`;

    const intro = emailSettings.tone === 'professional'
      ? `Thank you for taking the time to meet with me on ${sampleMeetingSummary.meetingDate} at ${sampleMeetingSummary.meetingTime}. It was a pleasure discussing with you.`
      : `Great catching up with you on ${sampleMeetingSummary.meetingDate}! Really enjoyed our conversation.`;

    const ctaMessages = {
      schedule_call: "Would you be available for a follow-up call this week? Let me know your preferred time.",
      request_confirmation: "Could you please confirm receipt of this email and let me know your thoughts?",
      share_brochure: "I'd be happy to share our detailed brochure. Would you like me to send it over?",
      send_proposal: "I'll prepare a detailed proposal based on our discussion. Expect it within the next few days."
    };

    const closing = emailSettings.tone === 'professional' 
      ? 'Best regards,' 
      : 'Looking forward to hearing from you!';

    const defaultInclusions = {
      meetingSummary: true,
      actionItems: true,
      userProfile: false,
      companyProfile: true,
      selectedServices: [],
    };

    return generateEmailBodyWithTemplate(
      emailSettings.emailBodyTemplate,
      {
        meeting: sampleMeetingSummary,
        settings,
        inclusions: defaultInclusions,
        greeting,
        intro,
        ctaMessage: ctaMessages[emailSettings.ctaStyle],
        closing,
      }
    );
  }, [emailSettings.emailBodyTemplate, emailSettings.tone, emailSettings.ctaStyle, settings]);

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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emailBodyTemplate" className="flex items-center gap-2">
            <Palette className="h-3.5 w-3.5 text-muted-foreground" />
            Email Body Template
          </Label>
          <Select
            value={emailSettings.emailBodyTemplate}
            onValueChange={(value: EmailBodyTemplate) => updateEmailSettings({ emailBodyTemplate: value })}
          >
            <SelectTrigger id="emailBodyTemplate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic - Traditional business style</SelectItem>
              <SelectItem value="modern">Modern - Clean contemporary design</SelectItem>
              <SelectItem value="minimal">Minimal - Simple with lots of white space</SelectItem>
              <SelectItem value="colorful">Colorful - Vibrant colors and modern design</SelectItem>
              <SelectItem value="elegant">Elegant - Sophisticated premium look</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the visual style for your email body template
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5" />
            Email Body Template Preview
          </Label>
          <div className="p-4 rounded-lg border border-border bg-gray-50 overflow-auto max-h-[500px]">
            <iframe
              srcDoc={emailBodyPreview}
              className="w-full border-0"
              style={{ minHeight: '400px', backgroundColor: '#f7fafc' }}
              title="Email Template Preview"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Preview of how your email will look with the selected template. Scroll to see more.
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Auto-append to email body</Label>
            <p className="text-xs text-muted-foreground">
              Automatically add signature HTML to the end of generated emails
            </p>
          </div>
          <Switch
            checked={emailSettings.autoAppendSignature}
            onCheckedChange={(checked) => updateEmailSettings({ autoAppendSignature: checked })}
          />
        </div>
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
