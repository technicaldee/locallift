'use client';

import { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { Business } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';
import { LoadingCard } from '@/components/ui/loading';
import { useAccount } from 'wagmi';
import { Analytics } from '@/lib/analytics';
import { BusinessDescriptionModal } from './BusinessDescriptionModal';

interface SwipeViewProps {
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function SwipeView({ onVerify, onComment }: SwipeViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const { user } = useFarcaster();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const businessesRef = collection(db, 'businesses');
      const snapshot = await getDocs(businessesRef);
      const businessData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Business[];
      
      setBusinesses(businessData);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right', business: Business) => {
    // Track swipe analytics
    Analytics.trackSwipe(direction, business.id);
    
    if (direction === 'right') {
      // Show description modal instead of immediately investing
      setSelectedBusiness(business);
      setShowDescriptionModal(true);
    } else {
      // For left swipe, just move to next card
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300); // Match the animation duration
    }
  };

  const handleModalClose = () => {
    setShowDescriptionModal(false);
    setSelectedBusiness(null);
    // Move to next card after modal closes
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  if (loading) {
    return (
      <div className="relative h-full p-4">
        <div className="relative h-[90%] max-w-sm mx-auto">
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (currentIndex >= businesses.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">You've seen all businesses!</h2>
        <p className="text-gray-600 mb-6">Check back later for new investment opportunities</p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            loadBusinesses();
          }}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-medium soft-shadow"
        >
          Start Over
        </button>
      </div>
    );
  }

  const currentBusiness = businesses[currentIndex];

  return (
    <div className="relative h-full overflow-hidden">
      <div className="h-full overflow-auto p-4">
        <div className="relative h-[calc(100vh-200px)] max-w-sm mx-auto">
          {currentBusiness && (
            <SwipeCard
              business={currentBusiness}
              onSwipe={handleSwipe}
              onVerify={onVerify}
              onComment={onComment}
            />
          )}
        </div>
      </div>
      
      {selectedBusiness && (
        <BusinessDescriptionModal
          business={selectedBusiness}
          isOpen={showDescriptionModal}
          onClose={handleModalClose}
          onVerify={onVerify}
          onComment={onComment}
        />
      )}
    </div>
  );
}