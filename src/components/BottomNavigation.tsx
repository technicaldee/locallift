'use client';

import { Home, Trophy, History, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Swipe' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaders' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'business', icon: Building2, label: 'Business' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-nav px-4 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-indigo-500 text-white shadow-lg scale-105 soft-shadow" 
                  : "text-slate-500 hover:text-slate-700 glass-button"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}