import { NextRequest, NextResponse } from 'next/server'
import { verifySignInMessage } from '@farcaster/auth-client'
import { createUserSession } from '@/lib/auth'
import { getUserByFid, createUserFromFarcaster } from '@/lib/firebase-services'

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()
    
    if (!message || !signature) {
      return NextResponse.json(
        { error: 'Missing message or signature' },
        { status: 400 }
      )
    }
    
    // Verify the Farcaster sign-in message
    const verification = await verifySignInMessage({
      message,
      signature,
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'locallift.xyz',
    })
    
    if (!verification.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Get the Farcaster ID from the verification
    const fid = verification.fid
    
    // Check if user exists in your database
    let user = await getUserByFid(fid)
    
    // If user doesn't exist, create a new user
    if (!user) {
      // Fetch user details from Farcaster API (you'd need to implement this)
      // For now, we'll create a basic user
      user = await createUserFromFarcaster(fid)
    }
    
    // Create a session for the user
    const { token } = await createUserSession(user)
    
    return NextResponse.json({ token, user })
  } catch (error) {
    console.error('Farcaster sign-in error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}