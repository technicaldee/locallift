export interface Business {
  id: string
  ownerId: string
  name: string
  type: string
  location: {
    address: string
    coordinates: [number, number]
    city: string
    country: string
  }
  monthlyRevenue: number
  yearsInOperation: number
  employeeCount: number
  verificationStatus: 'pending' | 'verified' | 'rejected'
  documentsHash: string
  description: string
  website?: string
  phone?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}



export interface Investment {
  id: string
  investorId: string
  businessId: string
  poolId: string
  amount: number
  interestRate: number
  duration: number
  status: 'active' | 'completed' | 'defaulted'
  transactionHash: string
  createdAt: Date
}

export interface RiskAssessment {
  businessId: string
  riskScore: number // 1-100, where 100 is lowest risk
  recommendedInterestRate: number
  maxInvestmentPool: number
  repaymentTimeline: number
  riskFactors: RiskFactor[]
  confidence: number
  assessmentDate: Date
}

export interface RiskFactor {
  category: 'financial' | 'location' | 'owner' | 'market'
  factor: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

export interface FundingRequest {
  id: string
  businessId: string
  requesterId: string
  targetAmount: number
  currentAmount: number
  duration: number
  interestRate: number
  purpose: string
  description?: string
  status: 'active' | 'funded' | 'cancelled' | 'completed'
  poolContractAddress?: string
  createdAt: Date
  updatedAt: Date
}

import { FieldValue } from 'firebase/firestore'

export interface User {
  id: string
  email: string | null
  displayName: string
  walletAddress: string | null
  authProvider: 'email' | 'wallet' | 'farcaster'
  farcasterFid?: number
  farcasterUsername?: string
  profileImageUrl?: string
  createdAt: Date | FieldValue
  updatedAt: Date | FieldValue
}

export interface FarcasterUser {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
}

export interface FarcasterSignInResult {
  message: string
  signature: string
}