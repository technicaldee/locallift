'use client';

import { useOnline } from '@/hooks/useOnline';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnline();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may not work.</span>
      </div>
    </div>
  );
}

export function ConnectionStatus() {
  const isOnline = useOnline();

  return (
    <div className="flex items-center space-x-2">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-xs text-green-600">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span className="text-xs text-red-600">Offline</span>
        </>
      )}
    </div>
  );
}