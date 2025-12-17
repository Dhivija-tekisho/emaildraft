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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="to">To</Label>
        <textarea
          id="to"
          value={draft.to}
          onChange={(e) => onUpdate({ to: e.target.value })}
          placeholder="Enter recipient email(s) - use commas for multiple"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-none"
        />
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
            <textarea
              id="cc"
              value={draft.cc}
              onChange={(e) => onUpdate({ cc: e.target.value })}
              placeholder="cc@example.com (comma-separated)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bcc">BCC</Label>
            <textarea
              id="bcc"
              value={draft.bcc}
              onChange={(e) => onUpdate({ bcc: e.target.value })}
              placeholder="bcc@example.com (comma-separated)"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] resize-none"
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
