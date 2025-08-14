export interface Business {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  ownerWallet: string;
  requestedAmount: number;
  monthlyContribution: number;
  currentInvestment: number;
  campaignDuration: number; // in days
  campaignStartDate: Date;
  isVerified: boolean;
  verificationImages: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  expiresAt: Date;
}

export interface Investment {
  id: string;
  businessId: string;
  investorWallet: string;
  amount: number;
  timestamp: Date;
  expectedReturn: number;
  transactionHash?: string;
}

export interface User {
  id: string;
  wallet: string;
  fid?: number;
  username?: string;
  avatar?: string;
  displayName?: string;
  totalInvested: number;
  totalEarnings: number;
  businessId?: string; // One business per user
  investmentSettings: {
    autoInvest: boolean;
    defaultAmount: number;
    askEachTime: boolean;
  };
  location?: {
    address: string;
    lat: number;
    lng: number;
    radius: number; // in km
  };
}

export interface Comment {
  id: string;
  businessId: string;
  userWallet: string;
  username?: string;
  avatar?: string;
  content: string;
  timestamp: Date;
}