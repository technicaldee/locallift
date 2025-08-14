'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface LocationSelectorProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number; radius: number }) => void;
  currentLocation?: { address: string; lat: number; lng: number; radius: number } | null;
}

export function LocationSelector({ onLocationSelect, currentLocation }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [radius, setRadius] = useState(currentLocation?.radius || 10);
  const { location, loading, requestLocation } = useLocation();

  const handleCurrentLocation = async () => {
    try {
      const loc = await requestLocation();
      onLocationSelect({
        ...loc,
        radius,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleManualLocation = () => {
    if (manualAddress.trim()) {
      // For demo purposes, we'll use a default coordinate
      // In production, you'd geocode the address
      onLocationSelect({
        address: manualAddress.trim(),
        lat: 37.7749, // Default to SF
        lng: -122.4194,
        radius,
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="glass-button">
          <MapPin className="h-5 w-5 text-indigo-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
            Set Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentLocation && (
            <div className="p-3 glass rounded-2xl">
              <p className="text-sm text-slate-600">Current: {currentLocation.address}</p>
              <p className="text-xs text-slate-500">Radius: {currentLocation.radius}km</p>
            </div>
          )}

          <div>
            <Label htmlFor="radius">Search Radius (km)</Label>
            <Input
              id="radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              min="1"
              max="100"
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleCurrentLocation}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Use Current Location
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>

          <div>
            <Label htmlFor="manual-address">Enter Address</Label>
            <Input
              id="manual-address"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter city or address"
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleManualLocation}
            disabled={!manualAddress.trim()}
            variant="outline"
            className="w-full"
          >
            Set Manual Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}