'use client';

import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { WelcomeDialog } from '@/components/WelcomeDialog';
import { SwipeView } from '@/components/SwipeView';
import { BusinessListView } from '@/components/BusinessListView';
import { LeaderboardView } from '@/components/LeaderboardView';
import { HistoryView } from '@/components/HistoryView';
import { BusinessView } from '@/components/BusinessView';
import { VerifyDialog } from '@/components/VerifyDialog';
import { CommentDialog } from '@/components/CommentDialog';
// import { InvestmentSuccessModal } from '@/components/InvestmentSuccessModal';
import { Toaster } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Business } from '@/types';
import { seedDatabase } from '@/lib/seedData';
import { LocationSelector } from '@/components/LocationSelector';
import { UserProfile } from '@/components/UserProfile';
import { Settings, LayoutGrid, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
  const [verifyBusiness, setVerifyBusiness] = useState<Business | null>(null);
  const [commentBusiness, setCommentBusiness] = useState<Business | null>(null);
  // const [successBusiness, setSuccessBusiness] = useState<Business | null>(null);
  // const [investmentAmount, setInvestmentAmount] = useState(10);
  const [userLocation, setUserLocation] = useState<{ address: string; lat: number; lng: number; radius: number; } | null>(null);
  const [investmentSettings, setInvestmentSettings] = useState({ amount: 100, riskLevel: 'medium' });

  useEffect(() => {
    // Seed database with sample data on first load
    seedDatabase();
  }, []);

  const handleLocationSelect = (location: { address: string; lat: number; lng: number; radius: number; } | null) => {
    setUserLocation(location);
    // Save to user preferences
  };

  const handleSettingsChange = (settings: unknown) => {
    setInvestmentSettings(settings as { amount: number; riskLevel: string });
  }

  const handleVerify = (business: Business) => {
    setVerifyBusiness(business);
  };

  const handleComment = (business: Business) => {
    setCommentBusiness(business);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return viewMode === 'swipe' 
          ? <SwipeView onVerify={handleVerify} onComment={handleComment} />
          : <BusinessListView onVerify={handleVerify} onComment={handleComment} />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'history':
        return <HistoryView />;
      case 'business':
        return <BusinessView />;
      default:
        return viewMode === 'swipe' 
          ? <SwipeView onVerify={handleVerify} onComment={handleComment} />
          : <BusinessListView onVerify={handleVerify} onComment={handleComment} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col relative">
        <header className="fixed top-0 left-0 right-0 z-50 glass-nav text-slate-700 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UserProfile 
                  onSettingsChange={handleSettingsChange}
                  currentSettings={investmentSettings}
                />
              </div>
              <div className="text-center flex-1">
                <h1 className="text-xl font-bold">Swipevest</h1>
                <p className="text-sm text-slate-500">Swipe. Invest. Earn.</p>
              </div>
              <div className="flex items-center space-x-2">
                <LocationSelector 
                  onLocationSelect={handleLocationSelect}
                  currentLocation={userLocation}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Find the UserProfile component and trigger its settings
                    const settingsEvent = new CustomEvent('openSettings');
                    window.dispatchEvent(settingsEvent);
                  }}
                  className="glass-button"
                >
                  <Settings className="h-5 w-5 text-indigo-500" />
                </Button>
                {activeTab === 'home' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode(viewMode === 'swipe' ? 'list' : 'swipe')}
                    className="glass-button"
                    title={viewMode === 'swipe' ? 'Switch to List View' : 'Switch to Swipe View'}
                  >
                    {viewMode === 'swipe' ? (
                      <LayoutGrid className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <Layers className="h-5 w-5 text-indigo-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto pt-32 pb-20">
          <div className="h-full">
            {renderContent()}
          </div>
        </main>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <WelcomeDialog />
        
        {verifyBusiness && (
          <VerifyDialog
            business={verifyBusiness}
            onClose={() => setVerifyBusiness(null)}
          />
        )}
        
        {commentBusiness && (
          <CommentDialog
            business={commentBusiness}
            onClose={() => setCommentBusiness(null)}
          />
        )}
        
        <Toaster />
      </div>
    </div>
  );
}
