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

    // Fetch investments from Firebase
    const investments = await InvestmentService.getInvestorInvestments(payload.userId)
    
    // Filter only active investments for the main display
    const activeInvestments = investments.filter(inv => inv.status === 'active')

    return NextResponse.json(activeInvestments)
  } catch (error) {
    console.error('Portfolio investments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}
