import { useEffect, useState } from 'react';
import { miniApp } from '@farcaster/miniapp-sdk';

export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  verifications: string[];
}

export function useFarcaster() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initFarcaster = async () => {
      try {
        await miniApp.ready();
        const userData = await miniApp.user();
        setUser(userData);
      } catch (err) {
        setError('Failed to initialize Farcaster');
        console.error('Farcaster init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initFarcaster();
  }, []);

  const shareToFarcaster = async (text: string, embeds?: string[]) => {
    try {
      await miniApp.share({
        text,
        embeds: embeds || []
      });
    } catch (err) {
      console.error('Share error:', err);
      throw new Error('Failed to share to Farcaster');
    }
  };

  return {
    user,
    isLoading,
    error,
    shareToFarcaster,
    isInFarcaster: !!user
  };
}