import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { EmailDraft, MeetingSummary } from '@/types/meeting';

interface EmailFieldsProps {
  draft: EmailDraft;
  meeting: MeetingSummary;
  onUpdate: (updates: Partial<EmailDraft>) => void;
}

export const EmailFields: React.FC<EmailFieldsProps> = ({ draft, meeting, onUpdate }) => {
  const [showCcBcc, setShowCcBcc] = useState(false);

  const allEmails = [meeting.recipientEmail, ...(meeting.additionalEmails || [])];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          list="recipient-list"
          value={draft.to}
          onChange={(e) => onUpdate({ to: e.target.value })}
          placeholder="Enter or select recipient"
        />
        <datalist id="recipient-list">
          {allEmails.map((email) => (
            <option key={email} value={email} />
          ))}
        </datalist>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowCcBcc(!showCcBcc)}
        className="text-muted-foreground -ml-2"
      >
        {showCcBcc ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
        {showCcBcc ? 'Hide' : 'Show'} CC/BCC
      </Button>

      {showCcBcc && (
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              value={draft.cc}
              onChange={(e) => onUpdate({ cc: e.target.value })}
              placeholder="cc@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bcc">BCC</Label>
            <Input
              id="bcc"
              value={draft.bcc}
              onChange={(e) => onUpdate({ bcc: e.target.value })}
              placeholder="bcc@example.com"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={draft.subject}
          onChange={(e) => onUpdate({ subject: e.target.value })}
          placeholder="Email subject..."
          className="font-medium"
        />
      </div>
    </div>
  );
};
