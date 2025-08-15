'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDisconnect } from 'wagmi';

interface InvestmentSettings {
  defaultAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoInvest: boolean;
  notifications: boolean;
}

interface InvestmentSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: InvestmentSettings) => void;
  currentSettings?: any;
}

export function InvestmentSettingsDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}: InvestmentSettingsDialogProps) {
  const [settings, setSettings] = useState<InvestmentSettings>({
    defaultAmount: currentSettings?.defaultAmount || 10,
    riskLevel: currentSettings?.riskLevel || 'medium',
    autoInvest: currentSettings?.autoInvest || false,
    notifications: currentSettings?.notifications || true,
  });
  
  const { disconnect } = useDisconnect();

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Investment Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="defaultAmount">Default Investment Amount (cUSD)</Label>
            <Input
              id="defaultAmount"
              type="number"
              min="1"
              max="100"
              value={settings.defaultAmount}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                defaultAmount: parseInt(e.target.value) || 10 
              }))}
            />
            <p className="text-xs text-slate-500">
              Amount to invest when you swipe right (1-100 cUSD)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select 
              value={settings.riskLevel} 
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setSettings(prev => ({ ...prev, riskLevel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Affects which businesses are shown to you
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoInvest">Auto-Invest</Label>
              <p className="text-xs text-slate-500">
                Automatically invest in highly-rated businesses
              </p>
            </div>
            <Switch
              id="autoInvest"
              checked={settings.autoInvest}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, autoInvest: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-xs text-slate-500">
                Get notified about investment updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, notifications: checked }))
              }
            />
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button 
              onClick={handleSave}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              Save Settings
            </Button>
            
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}