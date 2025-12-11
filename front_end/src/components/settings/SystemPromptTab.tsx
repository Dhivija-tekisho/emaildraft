import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSettings } from '@/context/SettingsContext';
import { Sparkles, MessageSquare, FileText, Target, Shield } from 'lucide-react';

export const SystemPromptTab: React.FC = () => {
  const { settings, updateEmailSettings } = useSettings();
  const { emailSettings } = settings;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Email Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure how AI generates your follow-up emails</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone" className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            Tone
          </Label>
          <Select
            value={emailSettings.tone}
            onValueChange={(value: 'professional' | 'friendly') => updateEmailSettings({ tone: value })}
          >
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length" className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            Length
          </Label>
          <Select
            value={emailSettings.length}
            onValueChange={(value: 'short' | 'detailed') => updateEmailSettings({ length: value })}
          >
            <SelectTrigger id="length">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (150-200 words)</SelectItem>
              <SelectItem value="detailed">Detailed (300-400 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaStyle" className="flex items-center gap-2">
          <Target className="h-3.5 w-3.5 text-muted-foreground" />
          Call-to-Action Style
        </Label>
        <Select
          value={emailSettings.ctaStyle}
          onValueChange={(value: 'schedule_call' | 'request_confirmation' | 'share_brochure' | 'send_proposal') =>
            updateEmailSettings({ ctaStyle: value })
          }
        >
          <SelectTrigger id="ctaStyle">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="schedule_call">Schedule a Call</SelectItem>
            <SelectItem value="request_confirmation">Request Confirmation</SelectItem>
            <SelectItem value="share_brochure">Share Brochure</SelectItem>
            <SelectItem value="send_proposal">Send Proposal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <div>
            <Label htmlFor="compliance">Include Compliance Note</Label>
            <p className="text-xs text-muted-foreground">Add privacy/consent text at email end</p>
          </div>
        </div>
        <Switch
          id="compliance"
          checked={emailSettings.includeCompliance}
          onCheckedChange={(checked) => updateEmailSettings({ includeCompliance: checked })}
        />
      </div>

      {emailSettings.includeCompliance && (
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="complianceText">Compliance Text</Label>
          <Input
            id="complianceText"
            value={emailSettings.complianceText}
            onChange={(e) => updateEmailSettings({ complianceText: e.target.value })}
            placeholder="Enter compliance/privacy text..."
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <p className="text-xs text-muted-foreground">
          The AI instructions for generating emails. Use {'{{tone}}'}, {'{{length}}'}, {'{{ctaStyle}}'} as placeholders.
        </p>
        <Textarea
          id="systemPrompt"
          value={emailSettings.systemPrompt}
          onChange={(e) => updateEmailSettings({ systemPrompt: e.target.value })}
          rows={12}
          className="font-mono text-xs"
          placeholder="Enter system prompt..."
        />
      </div>
    </div>
  );
};
