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
  isInvesting?: boolean;
}

export function SwipeCard({ business, onSwipe, onVerify, onComment, isInvesting = false }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Color transforms for swipe feedback
  const leftColor = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightColor = useTransform(x, [0, 50, 150], [0, 0.5, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
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
      className={cn(
        "absolute inset-0 cursor-grab active:cursor-grabbing",
        isInvesting && "pointer-events-none opacity-75"
      )}
      style={{ x, rotate, opacity }}
      drag={!isInvesting ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <Card className={cn(
        "h-full w-full overflow-hidden glass-card soft-shadow-lg transition-all duration-200",
        isDragging && "scale-105 shadow-2xl",
        isInvesting && "animate-pulse"
      )}>
        
        {/* Swipe feedback overlays */}
        <motion.div 
          className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-10"
          style={{ opacity: leftColor }}
        >
          <div className="bg-red-500 text-white p-4 rounded-full">
            <X className="h-8 w-8" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-10"
          style={{ opacity: rightColor }}
        >
          <div className="bg-green-500 text-white p-4 rounded-full">
            <Heart className="h-8 w-8" />
          </div>
        </motion.div>
        
        {/* Investment loading overlay */}
        {isInvesting && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-sm font-medium">Processing Investment...</p>
            </div>
          </div>
        )}
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
              disabled={isInvesting}
              className={cn(
                "h-14 w-14 shadow-2xl rounded-full glass-button border-0 hover:bg-red-100 transition-all",
                isInvesting && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="h-6 w-6 text-red-400" />
            </Button>

            <Button
              size="icon"
              onClick={handleSwipeRight}
              disabled={isInvesting}
              className={cn(
                "h-14 w-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white soft-shadow transition-all",
                isInvesting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isInvesting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <Heart className="h-6 w-6" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}