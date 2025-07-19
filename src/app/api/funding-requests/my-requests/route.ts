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
    await verifyToken(token)

    // In a real app, fetch from database
    // For now, return mock data
    const mockFundingRequests = [
      {
        id: 'funding_1',
        businessId: 'business_1',
        targetAmount: 25000,
        purpose: 'Equipment upgrade and expansion',
        duration: 12,
        currentAmount: 18500,
        status: 'active',
        poolContractAddress: '0x1234567890123456789012345678901234567890',
        interestRate: 8.5,
        riskScore: 75,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: 'funding_2',
        businessId: 'business_2',
        targetAmount: 10000,
        purpose: 'Marketing campaign and inventory',
        duration: 6,
        currentAmount: 3200,
        status: 'active',
        interestRate: 12.0,
        riskScore: 60,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-15')
      }
    ]

    return NextResponse.json(mockFundingRequests)
  } catch (error) {
    console.error('Fetch funding requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funding requests' },
      { status: 500 }
    )
  }
}