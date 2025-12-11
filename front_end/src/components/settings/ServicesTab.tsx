import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/context/SettingsContext';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { settings, toggleService, addService, removeService } = useSettings();
  const { services } = settings;

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddService = () => {
    if (newName.trim() && newDesc.trim()) {
      addService(newName.trim(), newDesc.trim());
      setNewName('');
      setNewDesc('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Services / Solutions / Products</h3>
          <p className="text-sm text-muted-foreground">Toggle which offerings to include in emails</p>
        </div>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center gap-3 flex-1">
              <Switch
                checked={service.enabled}
                onCheckedChange={() => toggleService(service.id)}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{service.name}</p>
                <p className="text-xs text-muted-foreground truncate">{service.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeService(service.id)}
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <Label className="text-sm font-medium">Add New Service</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Service name"
          />
          <Input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Brief description"
          />
        </div>
        <Button
          onClick={handleAddService}
          disabled={!newName.trim() || !newDesc.trim()}
          size="sm"
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
    </div>
  );
};
