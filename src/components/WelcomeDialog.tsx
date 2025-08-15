'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Users, Wallet } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { useFarcaster } from '@/hooks/useFarcaster';

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { isInFarcaster } = useFarcaster();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('swipevest-welcome-seen');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isConnected && step === 2) {
      handleClose();
    }
  }, [isConnected, step]);

  const handleClose = () => {
    localStorage.setItem('swipevest-welcome-seen', 'true');
    setIsOpen(false);
  };

  const handleConnectWallet = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const renderStep1 = () => (
    <>
      <DialogHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full glass flex items-center justify-center">
          <Heart className="h-8 w-8 text-indigo-500" />
        </div>
        <DialogTitle className="text-2xl font-bold text-slate-700">
          Welcome to Swipevest
        </DialogTitle>
        <DialogDescription className="text-base text-black mt-4 space-y-4">
          <div className="flex items-start space-x-3">
            <Heart className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-left">Swipe right on businesses you believe in and invest instantly</p>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-left">Earn returns as businesses grow and succeed</p>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-left">Join a community of investors supporting local businesses</p>
          </div>
        </DialogDescription>
      </DialogHeader>
      <Button 
        onClick={() => setStep(2)}
        className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl soft-shadow"
      >
        Get Started
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <DialogHeader className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full glass flex items-center justify-center">
          <Wallet className="h-8 w-8 text-indigo-500" />
        </div>
        <DialogTitle className="text-2xl font-bold text-slate-700">
          Connect Your Wallet
        </DialogTitle>
        <DialogDescription className="text-base mt-4 space-y-4">
          <p className="text-center text-black">
            Connect your wallet to start investing in local businesses with cUSD on Celo.
          </p>
          
          {isInFarcaster && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3">
              <p className="text-sm text-purple-700">
                🎉 You're using Swipevest in Farcaster! Your experience is optimized for social investing.
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
            <p className="text-sm text-blue-700 font-medium mb-2">Why connect a wallet?</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Make secure investments with cUSD</li>
              <li>• Track your investment history</li>
              <li>• Receive returns directly</li>
            </ul>
          </div>
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-3 mt-6">
        <Button 
          onClick={handleConnectWallet}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl soft-shadow"
        >
          Connect Wallet
        </Button>
        
        <Button 
          onClick={handleClose}
          variant="outline"
          className="w-full rounded-2xl"
        >
          Skip for Now
        </Button>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm mx-auto">
        {step === 1 ? renderStep1() : renderStep2()}
      </DialogContent>
    </Dialog>
  );
}