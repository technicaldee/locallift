'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Business } from '@/types';
import { Heart, X, MapPin, Calendar, DollarSign, TrendingUp, CheckCircle, Camera, MessageCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { InvestmentService } from '@/lib/investmentService';
import { Analytics } from '@/lib/analytics';
import { addDoc, collection, updateDoc, doc, increment, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';

interface BusinessDescriptionModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function BusinessDescriptionModal({ 
  business, 
  isOpen, 
  onClose, 
  onVerify, 
  onComment 
}: BusinessDescriptionModalProps) {
  const [investing, setInvesting] = useState(false);
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { user } = useFarcaster();

  if (!business) return null;

  const handleInvest = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to invest",
        variant: "destructive",
      });
      return;
    }

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

        // Update or create user document for leaderboard
        try {
          const userWallet = address;
          const userRef = doc(db, 'users', userWallet);
          
          // Use setDoc with merge to create or update user document
          await setDoc(userRef, {
            wallet: userWallet,
            username: user?.username || user?.displayName || `User ${userWallet.slice(-6)}`,
            avatar: user?.pfpUrl || '',
            totalInvested: increment(parseFloat(investmentAmount)),
            totalEarnings: 0, // Will be calculated based on returns
            lastInvestment: new Date(),
            updatedAt: new Date()
          }, { merge: true });
        } catch (userUpdateError) {
          console.error('Error updating user stats:', userUpdateError);
          // Don't fail the investment if user update fails
        }

        // Track successful investment
        Analytics.trackInvestment(business.id, parseFloat(investmentAmount));
        
        toast({
          title: "Investment Successful! 🎉",
          description: `You invested ${investmentAmount} cUSD in ${business.name}`,
        });
        
        onClose();
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
  };

  const progressPercentage = Math.min((business.currentInvestment / business.requestedAmount) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{business.name}</span>
            {business.isVerified && (
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Business Image */}
          <div className="relative h-48 rounded-lg overflow-hidden">
            <img
              src={business.imageUrl}
              alt={business.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Business Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Local Business</span>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>${business.requestedAmount.toLocaleString()}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{business.paybackPercentage}% return</span>
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>${business.currentInvestment.toLocaleString()} / ${business.requestedAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-right">
                {progressPercentage.toFixed(1)}% funded
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About this business</h3>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onComment(business)}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerify(business)}
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Verify
              </Button>
            </div>

            {/* Investment Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={investing}
              >
                <X className="h-4 w-4 mr-2" />
                Pass
              </Button>
              <Button
                onClick={handleInvest}
                disabled={investing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {investing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Heart className="h-4 w-4 mr-2" />
                )}
                {investing ? 'Investing...' : 'Invest'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}