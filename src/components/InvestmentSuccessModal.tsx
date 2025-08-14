'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Share, TrendingUp } from 'lucide-react';
import { Business } from '@/types';
import { useFarcaster } from '@/hooks/useFarcaster';

interface InvestmentSuccessModalProps {
  business: Business | null;
  investmentAmount: number;
  onClose: () => void;
}

export function InvestmentSuccessModal({ 
  business, 
  investmentAmount, 
  onClose 
}: InvestmentSuccessModalProps) {
  const [sharing, setSharing] = useState(false);
  const { shareToFarcaster } = useFarcaster();

  if (!business) return null;

  const expectedReturn = investmentAmount * (business.paybackPercentage / 100);

  const handleShare = async () => {
    setSharing(true);
    try {
      await shareToFarcaster(
        `Just invested $${investmentAmount} in ${business.name} on @swipevest! 🚀\n\nExpected return: $${expectedReturn.toFixed(2)} (${business.paybackPercentage}%)\n\nSwipe. Invest. Earn. 💰`,
        ['https://swipevest.site']
      );
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={!!business} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 h-16 w-16 glass rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8 text-indigo-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-700">
            Investment Successful! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="glass-card p-4 rounded-2xl">
            <h3 className="font-semibold text-slate-700 mb-2">{business.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Invested</p>
                <p className="font-bold text-slate-700">${investmentAmount}</p>
              </div>
              <div>
                <p className="text-slate-500">Expected Return</p>
                <p className="font-bold text-emerald-500 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  ${expectedReturn.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-sm">
            Your investment is now supporting {business.name}. Track your returns in the History tab!
          </p>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Swiping
            </Button>
            <Button
              onClick={handleShare}
              disabled={sharing}
              className="flex-1"
            >
              <Share className="h-4 w-4 mr-2" />
              {sharing ? 'Sharing...' : 'Share'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}