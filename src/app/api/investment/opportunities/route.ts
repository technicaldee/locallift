import { BusinessService } from '@/services/business.service'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch investment opportunities from Firebase
    const opportunities = await BusinessService.getInvestmentOpportunities()
    
    return NextResponse.json(opportunities)
  } catch (error) {
    console.error('Fetch opportunities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    )
  }
}