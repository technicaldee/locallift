'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Building2, CheckCircle, Camera } from 'lucide-react';
import { collection, addDoc, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';
import { Business } from '@/types';

export function BusinessView() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requestedAmount: '',
    paybackPercentage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useFarcaster();

  useEffect(() => {
    if (user) {
      loadUserBusiness();
    }
  }, [user]);

  const loadUserBusiness = async () => {
    if (!user) return;

    try {
      const userWallet = user.verifications[0] || `fid:${user.fid}`;
      const businessesRef = collection(db, 'businesses');
      const q = query(businessesRef, where('ownerWallet', '==', userWallet));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const businessDoc = snapshot.docs[0];
        const businessData = {
          id: businessDoc.id,
          ...businessDoc.data(),
          createdAt: businessDoc.data().createdAt?.toDate(),
          updatedAt: businessDoc.data().updatedAt?.toDate(),
        } as Business;
        
        setBusiness(businessData);
        setFormData({
          name: businessData.name,
          description: businessData.description,
          requestedAmount: businessData.requestedAmount.toString(),
          paybackPercentage: businessData.paybackPercentage.toString(),
        });
      }
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `businesses/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const userWallet = user.verifications[0] || `fid:${user.fid}`;
      let imageUrl = business?.imageUrl || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const businessData = {
        name: formData.name,
        description: formData.description,
        requestedAmount: parseFloat(formData.requestedAmount),
        paybackPercentage: parseFloat(formData.paybackPercentage),
        imageUrl,
        ownerWallet: userWallet,
        currentInvestment: business?.currentInvestment || 0,
        isVerified: business?.isVerified || false,
        gallery: business?.gallery || [],
        verificationImages: business?.verificationImages || [],
        updatedAt: new Date(),
      };

      if (business) {
        // Update existing business
        const businessRef = doc(db, 'businesses', business.id);
        await updateDoc(businessRef, businessData);
      } else {
        // Create new business
        await addDoc(collection(db, 'businesses'), {
          ...businessData,
          createdAt: new Date(),
        });
      }

      await loadUserBusiness();
    } catch (error) {
      console.error('Error saving business:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-32 bg-gray-200 rounded-3xl"></div>
          <div className="h-20 bg-gray-200 rounded-2xl"></div>
          <div className="h-20 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="h-16 w-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-700">
            {business ? 'Manage Business' : 'Create Business'}
          </h1>
          <p className="text-slate-500 text-sm">
            {business ? 'Update your business details' : 'Set up your business profile'}
          </p>
        </div>

        {business && (
          <Card className="mb-6 glass-card soft-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current Investment</p>
                  <p className="text-2xl font-bold text-slate-700">${business.currentInvestment.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Status</p>
                  <div className="flex items-center">
                    {business.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />
                        <span className="text-sm text-slate-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-1 text-slate-400" />
                        <span className="text-sm text-slate-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your business and what you'll use the investment for"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Requested Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestedAmount: e.target.value }))}
                    placeholder="10000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="percentage">Payback (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={formData.paybackPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, paybackPercentage: e.target.value }))}
                    placeholder="15"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Business Image</Label>
                <div className="mt-2">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imageFile ? imageFile.name : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white soft-shadow"
          >
            {submitting ? 'Saving...' : business ? 'Update Business' : 'Create Business'}
          </Button>
        </form>
      </div>
    </div>
  );
}