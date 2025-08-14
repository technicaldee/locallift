'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, X, MessageCircle, CheckCircle, Camera } from 'lucide-react';
import { Business } from '@/types';
import { cn } from '@/lib/utils';

interface SwipeCardProps {
  business: Business;
  onSwipe: (direction: 'left' | 'right', business: Business) => void;
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function SwipeCard({ business, onSwipe, onVerify, onComment }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      setExitX(200);
      onSwipe('right', business);
    } else if (info.offset.x < -threshold) {
      setExitX(-200);
      onSwipe('left', business);
    }
  };

  const handleSwipeRight = () => {
    setExitX(200);
    onSwipe('right', business);
  };

  const handleSwipeLeft = () => {
    setExitX(-200);
    onSwipe('left', business);
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full w-full overflow-hidden glass-card soft-shadow-lg">
        <div className="relative h-[65%]">
          <img
            src={business.imageUrl}
            alt={business.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          {business.isVerified && (
            <div className="absolute top-4 right-4 glass rounded-full p-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold mb-2 drop-shadow-sm">{business.name}</h2>
            <div className="flex items-center justify-between">
              <div className="glass rounded-2xl px-3 py-2">
                <p className="text-lg font-semibold">
                  ${business.requestedAmount.toLocaleString()}
                </p>
                <p className="text-sm opacity-90">
                  {business.paybackPercentage}% return
                </p>
              </div>
              <div className="text-right glass rounded-2xl px-3 py-2">
                <p className="text-sm opacity-90">Current</p>
                <p className="text-lg font-semibold">
                  ${business.currentInvestment.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="h-1/2 p-6 flex flex-col justify-start">
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {business.description}
          </p>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComment(business)}
              className="rounded-full shadow-lg glass-button border-0"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onVerify(business)}
              className="rounded-full shadow-lg glass-button border-0"
            >
              <Camera className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>

          <div className="flex justify-center space-x-6 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwipeLeft}
              className="h-14 w-14 shadow-2xl rounded-full glass-button border-0 hover:bg-red-100"
            >
              <X className="h-6 w-6 text-red-400" />
            </Button>

            <Button
              size="icon"
              onClick={handleSwipeRight}
              className="h-14 w-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white soft-shadow"
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}