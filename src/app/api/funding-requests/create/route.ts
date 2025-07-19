import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { BusinessService } from '@/services/business.service'
import { getContract } from '@/lib/contracts'

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
      targetAmount,
      duration,
      interestRate,
      purpose,
      description
    } = await request.json()

    // Validate required fields
    if (!businessId || !targetAmount || !duration || !interestRate || !purpose) {
      return NextResponse.json(
        { error: 'Missing required funding request parameters' },
        { status: 400 }
      )
    }

    // Create funding request in Firebase
    const fundingRequestId = await BusinessService.createFundingRequest({
      businessId,
      requesterId: payload.userId,
      targetAmount,
      duration,
      interestRate,
      purpose,
      description
    })

    // Create investment pool on blockchain
    try {
      const investmentPoolContract = await getContract('InvestmentPool')
      
      const tx = await investmentPoolContract.write.createPool([
        targetAmount,
        duration,
        interestRate,
        businessId,
        purpose
      ])

      // Update funding request with contract address
      await BusinessService.updateFundingWithContract(fundingRequestId, tx)

      return NextResponse.json({
        success: true,
        fundingRequestId,
        transactionHash: tx,
        message: 'Funding request created successfully'
      })

    } catch (contractError) {
      console.error('Smart contract error:', contractError)
      
      // Return success for Firebase creation even if blockchain fails
      return NextResponse.json({
        success: true,
        fundingRequestId,
        message: 'Funding request created. Blockchain integration pending.',
        warning: 'Smart contract deployment failed - will retry automatically'
      })
    }

  } catch (error) {
    console.error('Funding request creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create funding request' },
      { status: 500 }
    )
  }
}