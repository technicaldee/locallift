export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { BusinessService } from '@/services/business.service'

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

    // Fetch businesses from Firebase
    const businesses = await BusinessService.getBusinessesByOwner(payload.userId)

    return NextResponse.json(businesses)
  } catch (error) {
    console.error('Fetch businesses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    )
  }
}
