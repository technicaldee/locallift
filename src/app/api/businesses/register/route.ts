import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { BusinessService } from '@/services/business.service'

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

    const formData = await request.formData()
    
    // Extract business data
    const businessData = {
      ownerId: payload.userId,
      name: formData.get('name') as string,
      businessType: formData.get('businessType') as string,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      monthlyRevenue: parseFloat(formData.get('monthlyRevenue') as string) || 0,
      yearsInOperation: parseInt(formData.get('yearsInOperation') as string) || 0,
      employeeCount: parseInt(formData.get('employeeCount') as string) || 0,
      location: {
        address: formData.get('address') as string,
        coordinates: [0, 0] as [number, number], // Would get from geocoding API
        city: formData.get('city') as string,
        country: formData.get('country') as string || 'Unknown',
      }
    }

    // Extract documents
    const documents: File[] = []
    const documentKeys = ['businessLicense', 'taxCertificate', 'bankStatement', 'identityDocument']
    
    for (const key of documentKeys) {
      const file = formData.get(key) as File
      if (file && file.size > 0) {
        documents.push(file)
      }
    }

    // Register business using Firebase service
    const businessId = await BusinessService.registerBusiness(businessData, documents)

    return NextResponse.json({
      businessId,
      message: 'Business registered successfully. Verification process will begin shortly.',
    })
  } catch (error) {
    console.error('Business registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register business' },
      { status: 500 }
    )
  }
}