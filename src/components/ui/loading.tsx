'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      <Loader2 className={cn('animate-spin text-indigo-500', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-slate-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="glass-card p-6 rounded-3xl animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded-full flex-1"></div>
          <div className="h-10 bg-gray-200 rounded-full flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          {text}
        </h2>
        <p className="text-slate-500">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
}