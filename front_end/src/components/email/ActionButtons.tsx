import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, Save, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ActionButtonsProps {
  onRegenerateSubject: () => void;
  onRegenerateBody: () => void;
  onRegenerateAll: () => void;
  onCopy: () => void;
  onSaveDraft: () => void;
  onOpenMailApp: () => void;
  onSend: () => void;
  isGenerating: boolean;
  emailBody: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRegenerateSubject,
  onRegenerateBody,
  onRegenerateAll,
  onCopy,
  onSaveDraft,
  onOpenMailApp,
  onSend,
  isGenerating,
  emailBody,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    toast.success('Email copied to clipboard');
    onCopy();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerateSubject}
          disabled={isGenerating}
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Regenerate Subject
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerateBody}
          disabled={isGenerating}
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Regenerate Body
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerateAll}
          disabled={isGenerating}
        >
          <Sparkles className="h-4 w-4 mr-1.5" />
          Regenerate All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handleCopy} disabled={!emailBody}>
          <Copy className="h-4 w-4 mr-1.5" />
          Copy
        </Button>
        <Button variant="secondary" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Draft
        </Button>
        <Button variant="ghost" onClick={onOpenMailApp} disabled={!emailBody}>
          <Send className="h-4 w-4 mr-1.5" />
          Open in Mail App
        </Button>
        <Button onClick={onSend} disabled={!emailBody} className="gradient-primary">
          <Send className="h-4 w-4 mr-1.5" />
          Send
        </Button>
      </div>
    </div>
  );
};
