import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Image, FileText, FileSpreadsheet, FileVideo, FileAudio } from 'lucide-react';
import { EmailAttachment } from '@/types/meeting';

interface FileAttachmentProps {
  attachments: EmailAttachment[];
  onAttachmentsChange: (attachments: EmailAttachment[]) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
  if (mimeType.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
  if (mimeType.startsWith('audio/')) return <FileAudio className="h-4 w-4" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return <FileSpreadsheet className="h-4 w-4" />;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachments,
  onAttachmentsChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAttachment: EmailAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: dataUrl,
        };
        onAttachmentsChange([...attachments, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onAttachmentsChange(attachments.filter((att) => att.id !== id));
  };

  const handleDownload = (attachment: EmailAttachment) => {
    const a = document.createElement('a');
    a.href = attachment.data;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Upload className="h-4 w-4" />
          File Attachments
        </h3>
        <span className="text-sm text-muted-foreground">
          {attachments.length} file{attachments.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0 text-muted-foreground">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={attachment.name}>
                    {attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)} • {attachment.type || 'Unknown type'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {attachment.type.startsWith('image/') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(attachment)}
                      className="h-8"
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(attachment.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {attachments.length === 0 ? 'Add Files' : 'Add More Files'}
        </Button>

        {attachments.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Files will be attached to the email when sent
          </p>
        )}
      </div>
    </div>
  );
};



