import { NextRequest, NextResponse } from 'next/server'
import { verifyMessage } from 'viem'
import { signToken } from '@/lib/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature, role } = await request.json()

    // Verify the signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const userId = `user_${address.toLowerCase()}`
    
    // Check if user exists in Firebase
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    let userProfile
    
    if (!userDoc.exists()) {
      // Create new user
      userProfile = {
        id: userId,
        walletAddress: address.toLowerCase(),
        role: role || 'investor',
        kycStatus: 'pending',
        preferredLanguage: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await setDoc(userRef, userProfile)
    } else {
      // Update existing user
      const userData = userDoc.data()
      userProfile = { 
        id: userDoc.id, 
        walletAddress: userData?.walletAddress || address.toLowerCase(),
        role: userData?.role || 'investor',
        kycStatus: userData?.kycStatus || 'pending',
        preferredLanguage: userData?.preferredLanguage || 'en',
        createdAt: userData?.createdAt || new Date(),
        updatedAt: new Date(),
        ...userData
      }
      await updateDoc(userRef, {
        lastLogin: new Date(),
        updatedAt: new Date()
      })
    }

    // Create JWT token
    const token = await signToken({
      userId: userProfile.id,
      address: userProfile.walletAddress,
      role: userProfile.role,
    })

    return NextResponse.json({
      token,
      user: userProfile,
    })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}