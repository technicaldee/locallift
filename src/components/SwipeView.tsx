'use client';

import { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { Business } from '@/types';
import { collection, getDocs, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';
import { Loader2 } from 'lucide-react';

interface SwipeViewProps {
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function SwipeView({ onVerify, onComment }: SwipeViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useFarcaster();

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
    if (direction === 'right' && user) {
      // Invest in the business
      const investmentAmount = 10; // Default investment amount
      
      try {
        // Add investment record
        await addDoc(collection(db, 'investments'), {
          businessId: business.id,
          investorWallet: user.verifications[0] || `fid:${user.fid}`,
          amount: investmentAmount,
          timestamp: new Date(),
          expectedReturn: investmentAmount * (business.paybackPercentage / 100),
        });

        // Update business current investment
        const businessRef = doc(db, 'businesses', business.id);
        await updateDoc(businessRef, {
          currentInvestment: increment(investmentAmount)
        });

        // Update user stats
        const userWallet = user.verifications[0] || `fid:${user.fid}`;
        // You might want to create/update user document here
        
      } catch (error) {
        console.error('Error processing investment:', error);
      }
    }

    // Move to next business
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
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
  const nextBusiness = businesses[currentIndex + 1];

  return (
    <div className="relative h-full p-4">
      <div className="relative h-[90%] max-w-sm mx-auto">
        {nextBusiness && (
          <div className="absolute inset-0 scale-95 opacity-50">
            <SwipeCard
              business={nextBusiness}
              onSwipe={() => {}}
              onVerify={onVerify}
              onComment={onComment}
            />
          </div>
        )}
        
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
  );
}