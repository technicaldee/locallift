'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DollarSign } from 'lucide-react';

interface InvestmentSettings {
  autoInvest: boolean;
  defaultAmount: number;
  askEachTime: boolean;
}

interface InvestmentSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: InvestmentSettings) => void;
  currentSettings?: InvestmentSettings;
}

export function InvestmentSettingsDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}: InvestmentSettingsDialogProps) {
  const [settings, setSettings] = useState<InvestmentSettings>(
    currentSettings || {
      autoInvest: true,
      defaultAmount: 10,
      askEachTime: false,
    }
  );

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-indigo-500" />
            Investment Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-invest">Auto-invest on swipe</Label>
                <p className="text-sm text-slate-500">Automatically invest when you swipe right</p>
              </div>
              <Switch
                id="auto-invest"
                checked={settings.autoInvest}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoInvest: checked }))
                }
              />
            </div>

            {settings.autoInvest && (
              <>
                <div>
                  <Label htmlFor="default-amount">Default Investment Amount ($)</Label>
                  <Input
                    id="default-amount"
                    type="number"
                    value={settings.defaultAmount}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, defaultAmount: Number(e.target.value) }))
                    }
                    min="1"
                    max="1000"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ask-each-time">Ask amount each time</Label>
                    <p className="text-sm text-slate-500">Prompt for amount on each investment</p>
                  </div>
                  <Switch
                    id="ask-each-time"
                    checked={settings.askEachTime}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, askEachTime: checked }))
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}