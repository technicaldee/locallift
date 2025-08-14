import { useState, useEffect } from 'react';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            
            if (!response.ok) {
              // Fallback to a simple address format
              resolve({
                address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                lat: latitude,
                lng: longitude,
              });
              return;
            }

            const data = await response.json();
            const address = data.results[0]?.formatted || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            resolve({
              address,
              lat: latitude,
              lng: longitude,
            });
          } catch (err) {
            resolve({
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              lat: latitude,
              lng: longitude,
            });
          }
        },
        (error) => {
          reject(new Error('Failed to get location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    location,
    loading,
    error,
    requestLocation,
    calculateDistance,
  };
}