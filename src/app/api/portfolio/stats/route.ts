export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { InvestmentService } from '@/services/investment.service'

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

    // Calculate portfolio stats from Firebase
    const stats = await InvestmentService.getPortfolioStats(payload.userId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Portfolio stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio stats' },
      { status: 500 }
    )
  }
}
