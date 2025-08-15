export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    // In a real app, you would fetch user data from database
    // For now, we'll return mock data based on the token
    const userProfile = {
      id: payload.userId,
      walletAddress: payload.address,
      role: payload.role,
      kycStatus: 'pending',
      preferredLanguage: 'en',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    const updates = await request.json()

    // In a real app, you would update user data in database
    // For now, we'll return the updated mock data
    const updatedProfile = {
      id: payload.userId,
      walletAddress: payload.address,
      role: payload.role,
      kycStatus: updates.kycStatus || 'pending',
      preferredLanguage: updates.preferredLanguage || 'en',
      email: updates.email,
      phoneNumber: updates.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
