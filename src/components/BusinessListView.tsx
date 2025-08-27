'use client';

import { useState, useEffect } from 'react';
import { Business } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, CheckCircle, Camera, MapPin } from 'lucide-react';
import { BusinessDescriptionModal } from './BusinessDescriptionModal';

interface BusinessListViewProps {
  onVerify: (business: Business) => void;
  onComment: (business: Business) => void;
}

export function BusinessListView({ onVerify, onComment }: BusinessListViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

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

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setShowDescriptionModal(true);
  };

  const handleModalClose = () => {
    setShowDescriptionModal(false);
    setSelectedBusiness(null);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
      {businesses.map((business) => (
        <Card 
          key={business.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleBusinessClick(business)}
        >
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={business.imageUrl}
                  alt={business.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                {business.isVerified && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg truncate">{business.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>Local Business</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {business.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-indigo-600">
                        ${business.requestedAmount.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-xs">Goal</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">
                        ${business.currentInvestment.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-xs">Raised</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-orange-600">
                        {business.paybackPercentage}%
                      </p>
                      <p className="text-gray-500 text-xs">Return</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onComment(business);
                      }}
                      className="rounded-full"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVerify(business);
                      }}
                      className="rounded-full"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBusinessClick(business);
                      }}
                      className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
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