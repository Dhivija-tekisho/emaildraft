import React, { useState, useRef, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '@/context/SettingsContext';
import { useEmailGenerator } from '@/hooks/useEmailGenerator';
import { EmailDraft, EmailInclusions, sampleMeetingSummary } from '@/types/meeting';
import { toast } from 'sonner';

// Consolidated email editor with fields, body, inclusions, selfie and actions.
export const EmailEditor: React.FC = () => {
  const { settings } = useSettings();
  const { generateEmail, isGenerating } = useEmailGenerator();

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

  const [draft, setDraft] = useState<EmailDraft>(defaultDraft);

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

  // Mailto builder for open-in-mail behavior
  const normalizeRecipients = (raw = '') =>
    raw.replace(/;/g, ',').split(',').map((s) => s.trim()).filter(Boolean).join(',');

  const buildMailto = (d: EmailDraft) => {
    const to = normalizeRecipients(d.to || '');
    const cc = normalizeRecipients(d.cc || '');
    const bcc = normalizeRecipients(d.bcc || '');
    let body = (d.body || '').replace(/\r?\n/g, '\r\n');
    if (d.selfieAttached && d.selfieUrl) {
      body += '\r\n\r\n[Selfie attached separately — please attach the selfie image to this message before sending.]';
    }
    const params = new URLSearchParams();
    if (d.subject) params.set('subject', d.subject);
    if (body) params.set('body', body);
    if (cc) params.set('cc', cc);
    if (bcc) params.set('bcc', bcc);
    const paramString = params.toString();
    const encodedTo = to ? encodeURIComponent(to) : '';
    return paramString ? `mailto:${encodedTo}?${paramString}` : `mailto:${encodedTo}`;
  };

  const handleOpenMailApp = () => {
    try {
      const mailto = buildMailto(draft);
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
      const opened = window.open(mailto, '_blank');
      if (!opened) window.location.href = mailto;
      else { try { opened.focus(); } catch (e) {} }
      toast.success('Opened your mail app (compose).');
    } catch (e) {
      console.error('Open mail app failed', e);
      toast.error('Failed to open mail app.');
    }
  };

  const handleSend = async () => {
    // Server-backed send via POST /api/send
    try {
      const payload = {
        meetingId: sampleMeetingSummary.id,
        draft,
        sender: {
          email: settings.userProfile?.email || undefined,
          name: settings.userProfile?.name || undefined,
        },
      };
      // Use absolute localhost URL (development). In production, use appropriate base URL or proxy.
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Try to extract a helpful error message from the response
        let text = await res.text();
        try {
          const j = JSON.parse(text);
          text = j.error || j.message || JSON.stringify(j);
        } catch (_) {}
        console.error('Send API error', text);
        toast.error(`Failed to send email via server: ${text}`);
        return;
      }

      const data = await res.json();

      // Log 'sent' action to contact-activity
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
        serverMessageId: data.messageId,
      });
      localStorage.setItem(key, JSON.stringify(list));

      toast.success('Email sent successfully (server).');
    } catch (e) {
      console.error('Send failed', e);
      toast.error('Failed to send email.');
    }
  };

  // Subcomponents in-file (simplified copies)
  const MeetingHeader: React.FC = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{sampleMeetingSummary.recipientName}</h2>
      <p className="text-sm text-muted-foreground">{sampleMeetingSummary.meetingDate} · {sampleMeetingSummary.meetingTime}</p>
    </div>
  );

  const EmailFieldsBlock: React.FC = () => {
    const [showCcBcc, setShowCcBcc] = useState(false);
    const allEmails = [sampleMeetingSummary.recipientEmail, ...(sampleMeetingSummary.additionalEmails || [])];
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input id="to" list="recipient-list" value={draft.to} onChange={(e) => updateDraft({ to: e.target.value })} placeholder="Enter or select recipient" />
          <datalist id="recipient-list">{allEmails.map((e) => <option key={e} value={e} />)}</datalist>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowCcBcc(!showCcBcc)} className="text-muted-foreground -ml-2">{showCcBcc ? 'Hide' : 'Show'} CC/BCC</Button>
        {showCcBcc && (
          <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="space-y-2"><Label htmlFor="cc">CC</Label><Input id="cc" value={draft.cc} onChange={(e) => updateDraft({ cc: e.target.value })} placeholder="cc@example.com" /></div>
            <div className="space-y-2"><Label htmlFor="bcc">BCC</Label><Input id="bcc" value={draft.bcc} onChange={(e) => updateDraft({ bcc: e.target.value })} placeholder="bcc@example.com" /></div>
          </div>
        )}
        <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" value={draft.subject} onChange={(e) => updateDraft({ subject: e.target.value })} placeholder="Email subject..." className="font-medium" /></div>
      </div>
    );
  };

  const EmailBodyEditorBlock: React.FC = () => (
    <div className="space-y-2 flex-1 flex flex-col">
      <Label htmlFor="body">Email Body</Label>
      <div className="relative flex-1">
        <Textarea id="body" value={draft.body} onChange={(e) => updateDraft({ body: e.target.value })} placeholder="Your email content will appear here..." className="min-h-[300px] h-full resize-none" disabled={isGenerating} />
        {isGenerating && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="ml-2 text-sm font-medium">Generating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const InclusionsPanelBlock: React.FC = () => {
    const enabledServices = settings.services.filter((s) => s.enabled);
    const toggleInclusion = (key: keyof Omit<EmailInclusions, 'selectedServices'>) => updateInclusions({ ...draft.inclusions, [key]: !draft.inclusions[key] });
    const toggleService = (serviceId: string) => {
      const current = draft.inclusions.selectedServices;
      const next = current.includes(serviceId) ? current.filter((id) => id !== serviceId) : [...current, serviceId];
      updateInclusions({ ...draft.inclusions, selectedServices: next });
    };
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
        <h3 className="font-semibold mb-4">Include in Email</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between"><Label className="flex items-center gap-2 cursor-pointer">Meeting Summary</Label><Switch checked={draft.inclusions.meetingSummary} onCheckedChange={() => toggleInclusion('meetingSummary')} /></div>
          <div className="flex items-center justify-between"><Label className="flex items-center gap-2 cursor-pointer">Action Items / Next Steps</Label><Switch checked={draft.inclusions.actionItems} onCheckedChange={() => toggleInclusion('actionItems')} /></div>
          <div className="flex items-center justify-between"><Label className="flex items-center gap-2 cursor-pointer">User Profile Block</Label><Switch checked={draft.inclusions.userProfile} onCheckedChange={() => toggleInclusion('userProfile')} /></div>
          <div className="flex items-center justify-between"><Label className="flex items-center gap-2 cursor-pointer">Company Profile Block</Label><Switch checked={draft.inclusions.companyProfile} onCheckedChange={() => toggleInclusion('companyProfile')} /></div>
          {enabledServices.length > 0 && (<div className="pt-3 border-t border-border"><Label className="flex items-center gap-2 mb-3">Services / Solutions</Label><div className="space-y-2 pl-6">{enabledServices.map((service) => (<div key={service.id} className="flex items-center gap-2"><Checkbox id={`service-${service.id}`} checked={draft.inclusions.selectedServices.includes(service.id)} onCheckedChange={() => toggleService(service.id)} /><Label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">{service.name}</Label></div>))}</div></div>)}
        </div>
      </div>
    );
  };

  const SelfieAttachmentBlock: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { updateDraft({ selfieUrl: event.target?.result as string, selfieAttached: true }); };
        reader.readAsDataURL(file);
      }
    };
    const handleRemove = () => updateDraft({ selfieUrl: undefined, selfieAttached: false });
    const handleDownload = () => {
      if (!draft.selfieUrl) return;
      const a = document.createElement('a');
      a.href = draft.selfieUrl;
      a.download = 'selfie.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4"><h3 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4"/> Selfie Attachment</h3><Switch checked={draft.selfieAttached} onCheckedChange={(v: boolean) => updateDraft({ selfieAttached: v })} /></div>
        {draft.selfieAttached && (
          <div className="space-y-3 animate-fade-in">
            <input aria-label="Upload selfie" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            {draft.selfieUrl ? (
              <div className="relative">
                <img src={draft.selfieUrl} alt="Selfie preview" className="w-full h-40 object-cover rounded-lg border border-border" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={handleRemove}><span>X</span></Button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"><span>Image</span><p className="text-sm text-muted-foreground">Click to upload selfie</p></div>
            )}
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">Upload from Device</Button>
            {draft.selfieUrl && <Button variant="ghost" onClick={handleDownload}>Download Selfie</Button>}
          </div>
        )}
      </div>
    );
  };

  const ActionButtonsBlock: React.FC = () => {
    const handleCopy = () => {
      navigator.clipboard.writeText(draft.body);
      toast.success('Email copied to clipboard');
      try {
        const key = 'contact-activity';
        const raw = localStorage.getItem(key);
        const list = raw ? JSON.parse(raw) : [];
        list.push({ id: Date.now().toString(), meetingId: sampleMeetingSummary.id, action: 'copied', timestamp: new Date().toISOString(), draft });
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) { console.error('Failed to log copy', e); }
    };
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleGenerateSubject} disabled={isGenerating}>Regenerate Subject</Button>
          <Button variant="outline" size="sm" onClick={handleGenerateBody} disabled={isGenerating}>Regenerate Body</Button>
          <Button variant="outline" size="sm" onClick={handleGenerateAll} disabled={isGenerating}>Regenerate All</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopy} disabled={!draft.body}>Copy</Button>
          <Button variant="secondary" onClick={handleSaveDraft}>Save Draft</Button>
          <Button variant="ghost" onClick={handleOpenMailApp} disabled={!draft.body}>Open in Mail App</Button>
          <Button onClick={handleSend} disabled={!draft.body} className="gradient-primary">Send</Button>
        </div>
      </div>
    );
  };

  return (
    <main className="container max-w-6xl mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-xl border border-border p-5 shadow-soft space-y-5">
            <MeetingHeader />
            <EmailFieldsBlock />
            <EmailBodyEditorBlock />
            <ActionButtonsBlock />
          </div>
        </div>
        <div className="space-y-5">
          <InclusionsPanelBlock />
          <SelfieAttachmentBlock />
        </div>
      </div>
    </main>
  );
};

export default EmailEditor;
