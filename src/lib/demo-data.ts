import { Business, FundingRequest, RiskAssessment, Investment } from './types'

export const demoBusinesses: Business[] = [
  {
    id: 'business_1',
    ownerId: 'user_business_1',
    name: 'Sunrise Bakery',
    type: 'Restaurant',
    description: 'Family-owned bakery specializing in artisanal breads and pastries, serving the community for over 5 years with fresh, locally-sourced ingredients.',
    location: {
      address: '123 Main Street',
      coordinates: [-122.4194, 37.7749],
      city: 'San Francisco',
      country: 'USA'
    },
    monthlyRevenue: 18000,
    yearsInOperation: 5,
    employeeCount: 8,
    verificationStatus: 'verified',
    documentsHash: 'QmSunriseBakeryDocs123',
    website: 'https://sunrisebakery.com',
    phone: '+1-555-0123',
    email: 'info@sunrisebakery.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'business_2',
    ownerId: 'user_business_2',
    name: 'TechFix Solutions',
    type: 'Services',
    description: 'Professional computer and smartphone repair services with same-day turnaround for most devices. Serving both individual customers and small businesses.',
    location: {
      address: '456 Oak Avenue',
      coordinates: [-122.4094, 37.7849],
      city: 'San Francisco',
      country: 'USA'
    },
    monthlyRevenue: 12000,
    yearsInOperation: 2,
    employeeCount: 3,
    verificationStatus: 'verified',
    documentsHash: 'QmTechFixSolutionsDocs456',
    website: 'https://techfixsolutions.com',
    phone: '+1-555-0456',
    email: 'contact@techfixsolutions.com',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'business_3',
    ownerId: 'user_business_3',
    name: 'Green Thumb Gardens',
    type: 'Agriculture',
    description: 'Urban farming operation growing organic vegetables and herbs for local restaurants and farmers markets. Committed to sustainable farming practices.',
    location: {
      address: '789 Garden Way',
      coordinates: [-122.3994, 37.7949],
      city: 'San Francisco',
      country: 'USA'
    },
    monthlyRevenue: 8500,
    yearsInOperation: 3,
    employeeCount: 4,
    verificationStatus: 'verified',
    documentsHash: 'QmGreenThumbGardensDocs789',
    website: 'https://greenthumbgardens.com',
    phone: '+1-555-0789',
    email: 'hello@greenthumbgardens.com',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'business_4',
    ownerId: 'user_business_4',
    name: 'Artisan Jewelry Studio',
    type: 'Retail',
    description: 'Handcrafted jewelry studio creating unique pieces using sustainable materials. Each piece tells a story and supports local artisans.',
    location: {
      address: '321 Creative Lane',
      coordinates: [-122.4294, 37.7649],
      city: 'San Francisco',
      country: 'USA'
    },
    monthlyRevenue: 6500,
    yearsInOperation: 1,
    employeeCount: 2,
    verificationStatus: 'pending',
    documentsHash: 'QmArtisanJewelryDocs321',
    website: 'https://artisanjewelrystudio.com',
    phone: '+1-555-0321',
    email: 'create@artisanjewelrystudio.com',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 'business_5',
    ownerId: 'user_business_5',
    name: 'Community Fitness Hub',
    type: 'Services',
    description: 'Neighborhood fitness studio offering group classes, personal training, and wellness programs. Building a healthier community one workout at a time.',
    location: {
      address: '654 Wellness Street',
      coordinates: [-122.4394, 37.7549],
      city: 'San Francisco',
      country: 'USA'
    },
    monthlyRevenue: 15000,
    yearsInOperation: 4,
    employeeCount: 6,
    verificationStatus: 'verified',
    documentsHash: 'QmCommunityFitnessHubDocs654',
    website: 'https://communityfitnesshub.com',
    phone: '+1-555-0654',
    email: 'info@communityfitnesshub.com',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-08')
  }
]

export const demoFundingRequests: FundingRequest[] = [
  {
    id: 'funding_1',
    businessId: 'business_1',
    requesterId: 'user_1',
    targetAmount: 25000,
    purpose: 'New oven equipment and kitchen expansion to meet growing demand',
    duration: 12,
    currentAmount: 18500,
    status: 'active',
    poolContractAddress: '0x1234567890123456789012345678901234567890',
    interestRate: 8.5,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'funding_2',
    businessId: 'business_2',
    requesterId: 'user_2',
    targetAmount: 15000,
    purpose: 'Inventory expansion and digital marketing campaign',
    duration: 8,
    currentAmount: 4200,
    status: 'active',
    poolContractAddress: '0x2345678901234567890123456789012345678901',
    interestRate: 11.0,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'funding_3',
    businessId: 'business_3',
    requesterId: 'user_3',
    targetAmount: 20000,
    purpose: 'Greenhouse expansion and automated irrigation system',
    duration: 18,
    currentAmount: 12800,
    status: 'active',
    poolContractAddress: '0x3456789012345678901234567890123456789012',
    interestRate: 9.5,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'funding_4',
    businessId: 'business_4',
    requesterId: 'user_4',
    targetAmount: 8000,
    purpose: 'Professional photography setup and online store development',
    duration: 6,
    currentAmount: 1200,
    status: 'active',
    poolContractAddress: '0x4567890123456789012345678901234567890123',
    interestRate: 13.5,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'funding_5',
    businessId: 'business_5',
    requesterId: 'user_5',
    targetAmount: 30000,
    purpose: 'New equipment and studio renovation for expanded class offerings',
    duration: 15,
    currentAmount: 22500,
    status: 'active',
    poolContractAddress: '0x5678901234567890123456789012345678901234',
    interestRate: 7.5,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-02-12'),
  }
]

export const demoRiskAssessments: RiskAssessment[] = [
  {
    businessId: 'business_1',
    riskScore: 85,
    recommendedInterestRate: 8.5,
    maxInvestmentPool: 30000,
    repaymentTimeline: 12,
    riskFactors: [
      {
        category: 'financial',
        factor: 'Consistent revenue growth',
        impact: 'positive',
        weight: 0.8,
        description: 'Business shows steady 15% year-over-year growth with strong cash flow'
      },
      {
        category: 'location',
        factor: 'High foot traffic area',
        impact: 'positive',
        weight: 0.7,
        description: 'Located in busy commercial district with excellent visibility'
      },
      {
        category: 'market',
        factor: 'Established customer base',
        impact: 'positive',
        weight: 0.6,
        description: 'Strong local reputation with 85% repeat customer rate'
      },
      {
        category: 'owner',
        factor: 'Experienced management',
        impact: 'positive',
        weight: 0.5,
        description: '5+ years of successful business operation and industry experience'
      }
    ],
    confidence: 0.92,
    assessmentDate: new Date('2024-01-20')
  },
  {
    businessId: 'business_2',
    riskScore: 68,
    recommendedInterestRate: 11.0,
    maxInvestmentPool: 20000,
    repaymentTimeline: 8,
    riskFactors: [
      {
        category: 'financial',
        factor: 'Growing but volatile revenue',
        impact: 'neutral',
        weight: 0.6,
        description: 'Revenue shows growth but with seasonal fluctuations'
      },
      {
        category: 'owner',
        factor: 'Limited business experience',
        impact: 'negative',
        weight: 0.4,
        description: 'Owner has 2 years of business management experience'
      },
      {
        category: 'market',
        factor: 'High demand for services',
        impact: 'positive',
        weight: 0.7,
        description: 'Strong demand for tech repair services in the area'
      },
      {
        category: 'location',
        factor: 'Moderate competition',
        impact: 'neutral',
        weight: 0.3,
        description: 'Several competitors in the area but differentiated service offering'
      }
    ],
    confidence: 0.78,
    assessmentDate: new Date('2024-02-01')
  },
  {
    businessId: 'business_3',
    riskScore: 72,
    recommendedInterestRate: 9.5,
    maxInvestmentPool: 25000,
    repaymentTimeline: 18,
    riskFactors: [
      {
        category: 'market',
        factor: 'Growing demand for organic produce',
        impact: 'positive',
        weight: 0.8,
        description: 'Increasing consumer preference for organic, locally-grown food'
      },
      {
        category: 'financial',
        factor: 'Seasonal revenue patterns',
        impact: 'neutral',
        weight: 0.5,
        description: 'Revenue varies with growing seasons but predictable patterns'
      },
      {
        category: 'location',
        factor: 'Limited expansion space',
        impact: 'negative',
        weight: 0.3,
        description: 'Current location limits future growth potential'
      },
      {
        category: 'owner',
        factor: 'Agricultural expertise',
        impact: 'positive',
        weight: 0.6,
        description: 'Owner has formal agricultural training and 3 years experience'
      }
    ],
    confidence: 0.85,
    assessmentDate: new Date('2024-01-10')
  },
  {
    businessId: 'business_4',
    riskScore: 55,
    recommendedInterestRate: 13.5,
    maxInvestmentPool: 12000,
    repaymentTimeline: 6,
    riskFactors: [
      {
        category: 'owner',
        factor: 'New business owner',
        impact: 'negative',
        weight: 0.7,
        description: 'First-time business owner with limited management experience'
      },
      {
        category: 'financial',
        factor: 'Limited financial history',
        impact: 'negative',
        weight: 0.8,
        description: 'Only 1 year of business financial records available'
      },
      {
        category: 'market',
        factor: 'Niche market appeal',
        impact: 'neutral',
        weight: 0.4,
        description: 'Specialized product with limited but dedicated customer base'
      },
      {
        category: 'location',
        factor: 'Creative district location',
        impact: 'positive',
        weight: 0.5,
        description: 'Located in area known for arts and crafts businesses'
      }
    ],
    confidence: 0.65,
    assessmentDate: new Date('2024-02-10')
  },
  {
    businessId: 'business_5',
    riskScore: 88,
    recommendedInterestRate: 7.5,
    maxInvestmentPool: 35000,
    repaymentTimeline: 15,
    riskFactors: [
      {
        category: 'financial',
        factor: 'Strong financial performance',
        impact: 'positive',
        weight: 0.9,
        description: 'Consistent profitability with 20% annual growth'
      },
      {
        category: 'market',
        factor: 'Growing health and wellness trend',
        impact: 'positive',
        weight: 0.8,
        description: 'Increasing demand for fitness and wellness services'
      },
      {
        category: 'owner',
        factor: 'Industry expertise',
        impact: 'positive',
        weight: 0.7,
        description: 'Owner is certified fitness professional with 8+ years experience'
      },
      {
        category: 'location',
        factor: 'Prime location with parking',
        impact: 'positive',
        weight: 0.6,
        description: 'Easily accessible location with dedicated parking'
      }
    ],
    confidence: 0.94,
    assessmentDate: new Date('2024-01-05')
  }
]

export const demoInvestments: Investment[] = [
  {
    id: 'investment_1',
    investorId: 'user_investor_1',
    businessId: 'business_1',
    poolId: 'pool_1',
    amount: 500,
    interestRate: 8.5,
    duration: 12,
    status: 'active',
    transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901',
    createdAt: new Date('2024-01-25')
  },
  {
    id: 'investment_2',
    investorId: 'user_investor_1',
    businessId: 'business_2',
    poolId: 'pool_2',
    amount: 250,
    interestRate: 11.0,
    duration: 8,
    status: 'active',
    transactionHash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234',
    createdAt: new Date('2024-02-05')
  },
  {
    id: 'investment_3',
    investorId: 'user_investor_1',
    businessId: 'business_3',
    poolId: 'pool_3',
    amount: 750,
    interestRate: 9.5,
    duration: 18,
    status: 'active',
    transactionHash: '0xghi789jkl012mno345pqr678stu901vwx234yza567',
    createdAt: new Date('2024-01-12')
  }
]

// Helper function to get business opportunities (business + funding request + risk assessment)
export function getDemoOpportunities() {
  return demoFundingRequests.map(funding => {
    const business = demoBusinesses.find(b => b.id === funding.businessId)
    const riskAssessment = demoRiskAssessments.find(r => r.businessId === funding.businessId)
    
    return {
      business: business!,
      fundingRequest: funding,
      riskAssessment
    }
  })
}

// Helper function to get investor portfolio data
export function getDemoPortfolioStats() {
  const totalInvested = demoInvestments.reduce((sum, inv) => sum + inv.amount, 0)
  const activeInvestments = demoInvestments.filter(inv => inv.status === 'active').length
  const completedInvestments = demoInvestments.filter(inv => inv.status === 'completed').length
  
  // Calculate expected returns
  const totalExpectedReturns = demoInvestments.reduce((sum, inv) => {
    const expectedReturn = inv.amount * (1 + (inv.interestRate / 100) * (inv.duration / 12))
    return sum + (expectedReturn - inv.amount)
  }, 0)
  
  const averageReturn = totalExpectedReturns / totalInvested * 100
  const uniqueBusinesses = new Set(demoInvestments.map(inv => inv.businessId)).size

  return {
    totalInvested,
    totalReturns: Math.round(totalExpectedReturns),
    activeInvestments,
    completedInvestments,
    averageReturn: Math.round(averageReturn * 10) / 10,
    businessesHelped: uniqueBusinesses
  }
}

// Helper function to get detailed investment data for portfolio
export function getDemoInvestmentDetails() {
  return demoInvestments.map(investment => {
    const business = demoBusinesses.find(b => b.id === investment.businessId)
    const expectedReturn = investment.amount * (1 + (investment.interestRate / 100) * (investment.duration / 12))
    const monthlyPayment = expectedReturn / investment.duration
    const nextPaymentDate = new Date()
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    
    return {
      ...investment,
      businessName: business?.name || 'Unknown Business',
      businessType: business?.type || 'Unknown',
      expectedReturn: Math.round(expectedReturn * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      nextPaymentDate
    }
  })
}