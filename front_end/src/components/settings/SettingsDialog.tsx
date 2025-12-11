import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2, Briefcase, FileText, Sparkles } from 'lucide-react';
import { UserProfileTab } from './UserProfileTab';
import { CompanyProfileTab } from './CompanyProfileTab';
import { ServicesTab } from './ServicesTab';
import { SignatureTab } from './SignatureTab';
import { SystemPromptTab } from './SystemPromptTab';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('user');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="user" className="flex items-center gap-2 text-xs">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">User</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 text-xs">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 text-xs">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="signature" className="flex items-center gap-2 text-xs">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Signature</span>
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Prompt</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <TabsContent value="user" className="m-0 animate-fade-in">
              <UserProfileTab />
            </TabsContent>
            <TabsContent value="company" className="m-0 animate-fade-in">
              <CompanyProfileTab />
            </TabsContent>
            <TabsContent value="services" className="m-0 animate-fade-in">
              <ServicesTab />
            </TabsContent>
            <TabsContent value="signature" className="m-0 animate-fade-in">
              <SignatureTab />
            </TabsContent>
            <TabsContent value="prompt" className="m-0 animate-fade-in">
              <SystemPromptTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
