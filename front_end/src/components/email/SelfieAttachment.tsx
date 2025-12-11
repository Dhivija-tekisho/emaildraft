import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X, Image } from 'lucide-react';

interface SelfieAttachmentProps {
  attached: boolean;
  selfieUrl?: string;
  onToggle: (attached: boolean) => void;
  onSelfieChange: (url: string | undefined) => void;
}

export const SelfieAttachment: React.FC<SelfieAttachmentProps> = ({
  attached,
  selfieUrl,
  onToggle,
  onSelfieChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSelfieChange(event.target?.result as string);
        onToggle(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onSelfieChange(undefined);
    onToggle(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Selfie Attachment
        </h3>
        <Switch checked={attached} onCheckedChange={onToggle} />
      </div>

      {attached && (
        <div className="space-y-3 animate-fade-in">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selfieUrl ? (
            <div className="relative">
              <img
                src={selfieUrl}
                alt="Selfie preview"
                className="w-full h-40 object-cover rounded-lg border border-border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
            >
              <Image className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload selfie</p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {selfieUrl ? 'Change Image' : 'Upload from Device'}
          </Button>
        </div>
      )}
    </div>
  );
};
