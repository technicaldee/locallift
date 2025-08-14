'use client';

import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFarcaster } from '@/hooks/useFarcaster';
import { useAccount } from 'wagmi';
import { Settings } from 'lucide-react';
import { InvestmentSettingsDialog } from './InvestmentSettingsDialog';

interface UserProfileProps {
  onSettingsChange: (settings: any) => void;
  currentSettings?: any;
}

export function UserProfile({ onSettingsChange, currentSettings }: UserProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { user, isInFarcaster } = useFarcaster();
  const { address, isConnected } = useAccount();

  if (isInFarcaster && user) {
    return (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.pfpUrl} />
          <AvatarFallback>
            {user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            {user.displayName || user.username}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="glass-button"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <InvestmentSettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={onSettingsChange}
          currentSettings={currentSettings}
        />
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-indigo-100 text-indigo-600">
            {address.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700 truncate">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="glass-button"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <InvestmentSettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={onSettingsChange}
          currentSettings={currentSettings}
        />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto">
        <div className="flex flex-col items-center space-y-4 p-4">
          <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
          <p className="text-sm text-slate-600 text-center">
            Connect your wallet to start investing in local businesses
          </p>
          <ConnectButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}