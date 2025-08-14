'use client';

import { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { WelcomeDialog } from '@/components/WelcomeDialog';
import { SwipeView } from '@/components/SwipeView';
import { LeaderboardView } from '@/components/LeaderboardView';
import { HistoryView } from '@/components/HistoryView';
import { BusinessView } from '@/components/BusinessView';
import { VerifyDialog } from '@/components/VerifyDialog';
import { CommentDialog } from '@/components/CommentDialog';
import { InvestmentSuccessModal } from '@/components/InvestmentSuccessModal';
import { Business } from '@/types';
import { seedDatabase } from '@/lib/seedData';
import { LocationSelector } from '@/components/LocationSelector';
import { UserProfile } from '@/components/UserProfile';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [verifyBusiness, setVerifyBusiness] = useState<Business | null>(null);
  const [commentBusiness, setCommentBusiness] = useState<Business | null>(null);
  const [successBusiness, setSuccessBusiness] = useState<Business | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [investmentSettings, setInvestmentSettings] = useState({ amount: 100, riskLevel: 'medium' });

  useEffect(() => {
    // Seed database with sample data on first load
    seedDatabase();
  }, []);

  const handleLocationSelect = (location: any) => {
    setUserLocation(location);
    // Save to user preferences
  };

  const handleSettingsChange = (settings: any) => {
    setInvestmentSettings(settings)
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
        return <SwipeView onVerify={handleVerify} onComment={handleComment} />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'history':
        return <HistoryView />;
      case 'business':
        return <BusinessView />;
      default:
        return <SwipeView onVerify={handleVerify} onComment={handleComment} />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto min-h-screen glass-card relative">
        <header className="glass-nav text-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold">Swipevest</h1>
              <p className="text-sm text-slate-500">Swipe. Invest. Earn.</p>
            </div>
            <LocationSelector 
              onLocationSelect={handleLocationSelect}
              currentLocation={userLocation}
            />
          </div>
          <div className="mt-3">
            <UserProfile 
              onSettingsChange={handleSettingsChange}
              currentSettings={investmentSettings}
            />
          </div>
        </header>

        <main className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          {renderContent()}
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
      </div>
    </div>
  );
}
