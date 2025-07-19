import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { InvestmentService } from '@/services/investment.service'

export async function POST(request: NextRequest) {
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

    const {
      businessId,
      poolId,
      poolContractAddress,
      amount,
      interestRate,
      duration
    } = await request.json()

    // Validate required fields
    if (!businessId || !poolId || !poolContractAddress || !amount || !interestRate || !duration) {
      return NextResponse.json(
        { error: 'Missing required investment parameters' },
        { status: 400 }
      )
    }

    // Make investment using the service (handles both blockchain and Firebase)
    const result = await InvestmentService.investInBusiness(
      payload.userId,
      businessId,
      poolId,
      poolContractAddress,
      amount,
      interestRate,
      duration
    )

    return NextResponse.json({
      success: true,
      transactionHash: result.transactionHash,
      investmentId: result.investmentId,
      message: 'Investment completed successfully'
    })

  } catch (error) {
    console.error('Investment error:', error)
    return NextResponse.json(
      { error: 'Failed to process investment' },
      { status: 500 }
    )
  }
}