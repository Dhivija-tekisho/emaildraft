import React, { useState, useEffect } from 'react';
import { Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import { useEmailGenerator } from '@/hooks/useEmailGenerator';
import { emailService } from '@/services/emailService';
import { EmailDraft, EmailInclusions, sampleMeetingSummary } from '@/types/meeting';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Import consolidated components
import { EmailInputs } from '@/components/email/EmailInputs';
import { Attachments } from '@/components/email/Attachments';
import { InclusionsPanel } from '@/components/email/InclusionsPanel';
import { ActionButtons } from '@/components/email/ActionButtons';
import { MeetingHeader } from '@/components/email/MeetingHeader';

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
  attachments: [],
};

export const EmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<EmailDraft>(defaultDraft);
  const { settings } = useSettings();
  const { generateEmail, isGenerating } = useEmailGenerator();

  useEffect(() => {
    handleGenerateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    localStorage.setItem('email-draft', JSON.stringify(draft));

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

  const handleOpenMailApp = async () => {
    try {
      const response = await emailService.getGmailComposeUrl({
        to: draft.to || undefined,
        cc: draft.cc || undefined,
        bcc: draft.bcc || undefined,
        subject: draft.subject || undefined,
        body: draft.body || undefined,
        attachments: draft.attachments || undefined,
      });

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

      if (response.url) {
        window.open(response.url, '_blank');
      } else {
        throw new Error('Invalid compose URL');
      }
    } catch (e) {
      console.error('Failed to open mail app', e);
      toast.error('Failed to open mail app. Make sure you have Gmail configured.');
    }
  };

  return (
    <div className="container-main">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Email Composer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage email drafts with AI assistance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings')}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Meeting Context */}
      <MeetingHeader meeting={sampleMeetingSummary} />

      {/* Main Editor Container */}
      <div className="editor-container">
        {/* Left Panel - Inputs & Controls */}
        <div className="editor-section">
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Email Inputs (Recipients, Subject, Body) */}
            <EmailInputs
              draft={draft}
              meeting={sampleMeetingSummary}
              onUpdate={updateDraft}
              isGenerating={isGenerating}
            />

            {/* Inclusions Panel */}
            <div className="border-t pt-4">
              <h2 className="section-subtitle font-semibold mb-3">Email Content</h2>
              <InclusionsPanel
                inclusions={draft.inclusions}
                onUpdate={updateInclusions}
              />
            </div>

            {/* Attachments */}
            <div className="border-t pt-4">
              <h2 className="section-subtitle font-semibold mb-3">Attachments</h2>
              <Attachments
                attachments={draft.attachments || []}
                selfieAttached={draft.selfieAttached}
                selfieUrl={draft.selfieUrl}
                onAttachmentsChange={(attachments) => updateDraft({ attachments })}
                onSelfieToggle={(attached) => updateDraft({ selfieAttached: attached })}
                onSelfieChange={(url) => updateDraft({ selfieUrl: url })}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Actions & Preview */}
        <div className="editor-section">
          <div className="flex flex-col gap-4 h-full">
            {/* Action Buttons */}
            <ActionButtons
              actions={{
                onGenerateSubject: handleGenerateSubject,
                onGenerateBody: handleGenerateBody,
                onGenerateAll: handleGenerateAll,
                onSaveDraft: handleSaveDraft,
                onOpenMailApp: handleOpenMailApp,
              }}
              isGenerating={isGenerating}
              emailBody={draft.body}
            />

            {/* Email Preview */}
            <div className="flex-1 flex flex-col space-y-2">
              <h3 className="font-medium text-sm">Preview</h3>
              <div className="editor-preview flex-1">
                {draft.subject && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Subject:</p>
                    <p className="font-semibold">{draft.subject}</p>
                  </div>
                )}
                {draft.body && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Body:</p>
                    <p className="whitespace-pre-wrap text-sm">{draft.body}</p>
                  </div>
                )}
                {!draft.subject && !draft.body && (
                  <p className="text-muted-foreground text-sm">Generate email to see preview...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
