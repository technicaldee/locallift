'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Users } from 'lucide-react';

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('swipevest-welcome-seen');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('swipevest-welcome-seen', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full glass flex items-center justify-center">
            <Heart className="h-8 w-8 text-indigo-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-700">
            Welcome to Swipevest
          </DialogTitle>
          <DialogDescription className="text-base mt-4 space-y-4">
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
          onClick={handleClose}
          className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl soft-shadow"
        >
          Start Swiping
        </Button>
      </DialogContent>
    </Dialog>
  );
}