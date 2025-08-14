'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { Business } from '@/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';

interface VerifyDialogProps {
  business: Business;
  onClose: () => void;
}

export function VerifyDialog({ business, onClose }: VerifyDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useFarcaster();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const storageRef = ref(storage, `verification/${business.id}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);
    try {
      const imageUrls = await uploadImages();
      
      // Update business with verification images
      const businessRef = doc(db, 'businesses', business.id);
      await updateDoc(businessRef, {
        verificationImages: arrayUnion(...imageUrls),
        gallery: arrayUnion(...imageUrls), // Also add to gallery
      });

      onClose();
    } catch (error) {
      console.error('Error uploading verification images:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2 text-indigo-500" />
            Verify Business
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Help verify <strong>{business.name}</strong> by uploading photos of the business location, 
            products, or services. This helps other investors make informed decisions.
          </p>

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="verify-images"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('verify-images')?.click()}
              className="w-full"
              disabled={selectedFiles.length >= 5}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Images ({selectedFiles.length}/5)
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Images:</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0 || uploading}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white soft-shadow"
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}