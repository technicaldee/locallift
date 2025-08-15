'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useConnect, useDisconnect } from 'wagmi';
import { useFarcaster } from '@/hooks/useFarcaster';
import { useAccount } from 'wagmi';
import { Settings } from 'lucide-react';
import { InvestmentSettingsDialog } from './InvestmentSettingsDialog';

interface UserProfileProps {
  onSettingsChange: (settings: unknown) => void;
  currentSettings?: unknown;
}

export function UserProfile({ onSettingsChange, currentSettings }: UserProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return <UserProfileContent onSettingsChange={onSettingsChange} currentSettings={currentSettings} />;
}

function UserProfileContent({ onSettingsChange, currentSettings }: UserProfileProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { user, isInFarcaster } = useFarcaster();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="glass-button">
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto">
        <div className="flex flex-col items-center space-y-4 p-4">
          <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
          <p className="text-sm text-slate-600 text-center">
            Connect your wallet to start investing in local businesses with cUSD on Celo
          </p>
          <Button 
            onClick={handleConnect}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            Connect Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}