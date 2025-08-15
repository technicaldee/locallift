'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  Heart,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Business } from '@/types';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface BusinessDetailModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (business: Business) => void;
  onPass: (business: Business) => void;
}

export function BusinessDetailModal({ 
  business, 
  isOpen, 
  onClose, 
  onInvest, 
  onPass 
}: BusinessDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!business) return null;

  const allImages = [business.imageUrl, ...business.gallery];
  const daysLeft = Math.max(0, Math.ceil((business.updatedAt.getTime() + (30 * 24 * 60 * 60 * 1000) - Date.now()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = (business.currentInvestment / business.requestedAmount) * 100;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleInvest = () => {
    onInvest(business);
    onClose();
  };

  const handlePass = () => {
    onPass(business);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto p-0">
        {/* Image Gallery */}
        <div className="relative h-64 overflow-hidden rounded-t-3xl">
          <img
            src={allImages[currentImageIndex]}
            alt={business.name}
            className="h-full w-full object-cover"
          />
          
          {allImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 glass-button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 glass-button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {allImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {business.isVerified && (
            <Badge className="absolute top-4 right-4 bg-emerald-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{business.name}</h2>
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              Local Business
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Campaign Progress</span>
              <span className="text-sm font-medium text-slate-800">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                ${business.currentInvestment.toLocaleString()} raised
              </span>
              <span className="text-slate-600">
                ${business.requestedAmount.toLocaleString()} goal
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 text-center">
              <DollarSign className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-800">
                ${Math.round(business.requestedAmount / 12)}
              </p>
              <p className="text-xs text-slate-500">Monthly Goal</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Clock className="h-5 w-5 text-slate-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-slate-800">{daysLeft}</p>
              <p className="text-xs text-slate-500">Days Left</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">About</h3>
            <p className="text-slate-600 leading-relaxed">{business.description}</p>
          </div>

          {/* Campaign Details */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Campaign Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-700">30 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Started:</span>
                <span className="text-slate-700">
                  {business.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expires:</span>
                <span className="text-slate-700">
                  {new Date(business.createdAt.getTime() + (30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePass}
              className="flex-1 h-12"
            >
              <X className="h-5 w-5 mr-2 text-red-400" />
              Pass
            </Button>
            <Button
              onClick={handleInvest}
              className="flex-1 h-12 bg-indigo-500 hover:bg-indigo-600"
            >
              <Heart className="h-5 w-5 mr-2" />
              Invest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}