export interface Business {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  requestedAmount: number;
  currentInvestment: number;
  paybackPercentage: number;
  walletAddress?: string;
  ownerWallet: string;
  isVerified: boolean;
  gallery: string[];
  verificationImages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  businessId: string;
  investorAddress: string;
  amount: number;
  timestamp: Date;
  transactionHash?: string;
  expectedReturn: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  verifications?: string[];
}

export interface InvestmentSettings {
  defaultAmount: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoInvest: boolean;
  notifications: boolean;
}

export interface ContractBusiness {
  id: string;
  wallet: string;
  goalAmount: bigint;
  currentAmount: bigint;
  isActive: boolean;
  createdAt: bigint;
}

export interface ContractInvestment {
  investor: string;
  businessId: string;
  amount: bigint;
  timestamp: bigint;
}

export interface FundingRequest {
  id: string;
  businessId: string;
  targetAmount: number;
  currentAmount: number;
  interestRate: number;
  duration: number; // in months
  purpose: string;
  status: 'active' | 'funded' | 'completed' | 'cancelled';
  poolContractAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAssessment {
  businessId: string;
  riskScore: number; // 0-100
  recommendedInterestRate: number;
  riskFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    weight: number;
  }>;
  assessmentDate: Date;
  confidence: number; // 0-1
}

export interface Comment {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
}