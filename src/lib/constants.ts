// Platform configuration constants
export const PLATFORM_CONFIG = {
  MIN_INVESTMENT: 1,
  MAX_INVESTMENT: 100,
  PLATFORM_FEE: 2.5, // percentage
  DEFAULT_INTEREST_RATE: 12,
  MIN_INTEREST_RATE: 5,
  MAX_INTEREST_RATE: 25,
  MIN_DURATION: 1, // months
  MAX_DURATION: 60, // months
};

// Token addresses for different networks
export const TOKEN_ADDRESSES = {
  cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Celo Alfajores testnet
  CELO: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', // Celo Alfajores testnet
};

// Business categories
export const BUSINESS_CATEGORIES = [
  'Restaurant & Food',
  'Retail & Shopping',
  'Technology & Software',
  'Health & Wellness',
  'Education & Training',
  'Professional Services',
  'Manufacturing',
  'Agriculture',
  'Transportation',
  'Entertainment',
  'Real Estate',
  'Other',
] as const;

// Risk assessment ranges
export const RISK_RANGES = {
  LOW: { min: 0, max: 30, color: 'green', label: 'Low Risk' },
  MEDIUM: { min: 31, max: 60, color: 'yellow', label: 'Medium Risk' },
  HIGH: { min: 61, max: 100, color: 'red', label: 'High Risk' },
} as const;

// Investment status types
export const INVESTMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DEFAULTED: 'defaulted',
  CANCELLED: 'cancelled',
} as const;

// Business verification status
export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Supported chains
export const SUPPORTED_CHAINS = {
  CELO_ALFAJORES: 44787,
  CELO_MAINNET: 42220,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BUSINESSES: '/api/businesses',
  INVESTMENTS: '/api/investments',
  USERS: '/api/users',
  FUNDING_REQUESTS: '/api/funding-requests',
  RISK_ASSESSMENT: '/api/risk-assessment',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  INVESTMENT_SETTINGS: 'investment_settings',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_AMOUNT: 'Please enter a valid investment amount',
  BUSINESS_NOT_FOUND: 'Business not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  INVESTMENT_SUCCESSFUL: 'Investment successful! 🎉',
  BUSINESS_REGISTERED: 'Business registered successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  VERIFICATION_SUBMITTED: 'Verification submitted for review',
} as const;