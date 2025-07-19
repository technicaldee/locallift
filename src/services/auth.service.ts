import { auth, db } from '@/lib/firebase';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '@/lib/auth';

/**
 * Service for authentication-related operations using Firebase
 */
export const AuthService = {
  /**
   * Sign in with wallet address and signature
   */
  async signInWithWallet(address: string, signature: string): Promise<{ token: string; user: UserProfile }> {
    try {
      // In a real implementation, we would verify the signature on the backend
      // and generate a Firebase custom token
      
      // For now, we'll simulate this process
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature })
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const { token, user } = await response.json();
      
      // Sign in to Firebase with the custom token
      await signInWithCustomToken(auth, token);
      
      // Check if user exists in Firestore, create if not
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          walletAddress: address.toLowerCase(),
          role: user.role,
          kycStatus: 'pending',
          preferredLanguage: 'en',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: new Date(),
          updatedAt: new Date()
        });
      }
      
      return { token, user };
    } catch (error) {
      console.error('Error signing in with wallet:', error);
      throw new Error('Authentication failed');
    }
  },
  
  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  },
  
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return null;
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as UserProfile;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};