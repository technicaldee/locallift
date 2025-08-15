'use client';

import { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { Business } from '@/types';
import { collection, getDocs, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';
import { LoadingCard } from '@/components/ui/loading';
import { useAccount } from 'wagmi';
import { InvestmentService } from '@/lib/investmentService';
import { Analytics } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';

interface SwipeViewProps {
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function SwipeView({ onVerify, onComment }: SwipeViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
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
    
    if (direction === 'right' && isConnected && address) {
      setInvesting(true);
      
      // Get investment amount from user settings or default
      const userSettings = JSON.parse(localStorage.getItem('investment-settings') || '{}');
      const investmentAmount = (userSettings.defaultAmount || 10).toString();
      
      try {
        // Check balance and allowance first
        const balanceCheck = await InvestmentService.checkBalance(address, investmentAmount);
        
        if (!balanceCheck.hasBalance) {
          toast({
            title: "Insufficient Balance",
            description: `You need at least ${investmentAmount} cUSD to invest. Your balance: ${parseFloat(balanceCheck.balance).toFixed(2)} cUSD`,
            variant: "destructive",
          });
          setInvesting(false);
          return;
        }

        // Approve cUSD if needed
        if (!balanceCheck.hasAllowance) {
          toast({
            title: "Approving cUSD",
            description: "Please approve the transaction to allow investments...",
          });
          
          const approvalResult = await InvestmentService.approvecUSD(investmentAmount);
          if (!approvalResult.success) {
            toast({
              title: "Approval Failed",
              description: approvalResult.error || "Failed to approve cUSD",
              variant: "destructive",
            });
            setInvesting(false);
            return;
          }
        }

        // Make the investment
        toast({
          title: "Processing Investment",
          description: "Sending your investment to the business...",
        });

        const investmentResult = await InvestmentService.invest(business.id, investmentAmount);
        
        if (investmentResult.success) {
          // Update Firebase with investment record
          await addDoc(collection(db, 'investments'), {
            businessId: business.id,
            investorAddress: address,
            amount: parseFloat(investmentAmount),
            timestamp: new Date(),
            transactionHash: investmentResult.transactionHash,
            status: 'completed'
          });

          // Update business current investment
          await updateDoc(doc(db, 'businesses', business.id), {
            currentInvestment: increment(parseFloat(investmentAmount))
          });

          // Track successful investment
          Analytics.trackInvestment(business.id, parseFloat(investmentAmount));
          
          toast({
            title: "Investment Successful! 🎉",
            description: `You invested ${investmentAmount} cUSD in ${business.name}`,
          });
        } else {
          toast({
            title: "Investment Failed",
            description: investmentResult.error || "Failed to process investment",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Error processing investment:', error);
        toast({
          title: "Investment Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setInvesting(false);
      }
    }

    // Move to next business
    setCurrentIndex(prev => prev + 1);
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
    <div className="relative h-full p-4">
      <div className="relative h-[90%] max-w-sm mx-auto">
        {currentBusiness && (
          <SwipeCard
            business={currentBusiness}
            onSwipe={handleSwipe}
            onVerify={onVerify}
            onComment={onComment}
            isInvesting={investing}
          />
        )}
      </div>
    </div>
  );
}