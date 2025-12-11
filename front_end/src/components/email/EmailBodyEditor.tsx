import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EmailBodyEditorProps {
  body: string;
  onChange: (body: string) => void;
  isGenerating?: boolean;
}

export const EmailBodyEditor: React.FC<EmailBodyEditorProps> = ({ body, onChange, isGenerating }) => {
  return (
    <div className="space-y-2 flex-1 flex flex-col">
      <Label htmlFor="body">Email Body</Label>
      <div className="relative flex-1">
        <Textarea
          id="body"
          value={body}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your email content will appear here..."
          className="min-h-[300px] h-full resize-none"
          disabled={isGenerating}
        />
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
};
