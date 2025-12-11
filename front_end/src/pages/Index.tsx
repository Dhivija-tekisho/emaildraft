import React, { useState, useEffect } from 'react';
import { Settings, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import EmailEditor from '@/components/email/EmailEditor';
import { useSettings } from '@/context/SettingsContext';
import { useEmailGenerator } from '@/hooks/useEmailGenerator';
import { EmailDraft, EmailInclusions, sampleMeetingSummary } from '@/types/meeting';
import { toast } from 'sonner';

const defaultInclusions: EmailInclusions = {
  meetingSummary: true,
  actionItems: true,
  userProfile: true,
  companyProfile: true,
  selectedServices: [],
};

const defaultDraft: EmailDraft = {
  to: sampleMeetingSummary.recipientEmail,
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  inclusions: defaultInclusions,
  selfieAttached: false,
};

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<EmailDraft>(defaultDraft);
  const { settings } = useSettings();
  const { generateEmail, isGenerating } = useEmailGenerator();

  // Auto-generate email on first load
  useEffect(() => {
    handleGenerateAll();
  }, []);

  const updateDraft = (updates: Partial<EmailDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const updateInclusions = (inclusions: EmailInclusions) => {
    setDraft((prev) => ({ ...prev, inclusions }));
  };

  const handleGenerateSubject = async () => {
    const result = await generateEmail(sampleMeetingSummary, settings, draft.inclusions, 'subject');
    if (result.subject) updateDraft({ subject: result.subject });
  };

  const handleGenerateBody = async () => {
    const result = await generateEmail(sampleMeetingSummary, settings, draft.inclusions, 'body');
    if (result.body) updateDraft({ body: result.body });
  };

  const handleGenerateAll = async () => {
    const result = await generateEmail(sampleMeetingSummary, settings, draft.inclusions, 'all');
    updateDraft({ subject: result.subject || draft.subject, body: result.body || draft.body });
  };

  const handleSaveDraft = () => {
    const timestamp = new Date().toISOString();
    // Save current draft snapshot
    localStorage.setItem('email-draft', JSON.stringify(draft));

    // Append to contact activity timeline
    try {
      const key = 'contact-activity';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: Date.now().toString(),
        meetingId: sampleMeetingSummary.id,
        action: 'saved',
        timestamp,
        draft,
      });
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to append contact activity', e);
    }

    toast.success('Draft saved successfully');
  };

  const handleSend = () => {
    // Open default mail client with prefilled mailto (basic fallback)
    try {
      const to = encodeURIComponent(draft.to || '');
      const cc = encodeURIComponent(draft.cc || '');
      const bcc = encodeURIComponent(draft.bcc || '');
      const subject = encodeURIComponent(draft.subject || '');
      const body = encodeURIComponent(draft.body || '');

      let mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      if (draft.cc) mailto += `&cc=${cc}`;
      if (draft.bcc) mailto += `&bcc=${bcc}`;

      // Save finalization metadata
      const timestamp = new Date().toISOString();
      const key = 'contact-activity';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: Date.now().toString(),
        meetingId: sampleMeetingSummary.id,
        action: 'sent',
        timestamp,
        draft,
      });
      localStorage.setItem(key, JSON.stringify(list));

      // If selfie is attached, ensure it's considered part of finalization (stored in metadata via draft.selfieUrl)

      // Open mail client
      window.location.href = mailto;
      toast.success('Opened mail app. If that did not open, please check your system settings.');
    } catch (e) {
      console.error('Send failed', e);
      toast.error('Failed to open mail app.');
    }
  };

  const handleOpenMailApp = () => {
    // Essentially same as handleSend but action is 'opened'
    try {
      const to = encodeURIComponent(draft.to || '');
      const cc = encodeURIComponent(draft.cc || '');
      const bcc = encodeURIComponent(draft.bcc || '');
      const subject = encodeURIComponent(draft.subject || '');
      const body = encodeURIComponent(draft.body || '');

      let mailto = `mailto:${to}?subject=${subject}&body=${body}`;
      if (draft.cc) mailto += `&cc=${cc}`;
      if (draft.bcc) mailto += `&bcc=${bcc}`;

      const timestamp = new Date().toISOString();
      const key = 'contact-activity';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        id: Date.now().toString(),
        meetingId: sampleMeetingSummary.id,
        action: 'opened',
        timestamp,
        draft,
      });
      localStorage.setItem(key, JSON.stringify(list));

      window.location.href = mailto;
    } catch (e) {
      console.error('Open mail app failed', e);
      toast.error('Failed to open mail app.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold">LeadQ Email Drafter</h1>
              <p className="text-xs text-muted-foreground">Professional follow-up emails</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <EmailEditor />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;
