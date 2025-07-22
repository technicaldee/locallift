import { celo, celoAlfajores } from 'wagmi/chains'

// Celo network configuration
export const SUPPORTED_CHAINS = [celo, celoAlfajores]

// Token addresses on Celo
export const TOKEN_ADDRESSES = {
  cUSD: '0x765de816845861e75a25fca122bb6898b8b1282a' as const,
  CELO: '0x471ece3750da237f93b8e339c536989b8978a438' as const,
} as const

// Platform configuration
export const PLATFORM_CONFIG = {
  PLATFORM_FEE: 0.02, // 2%
  MIN_INVESTMENT: 1, // $1
  MAX_INVESTMENT: 50, // $50
  SUPPORTED_LANGUAGES: ['en', 'es', 'pt'] as const,
} as const

// Risk assessment ranges
export const RISK_RANGES = {
  LOW: { min: 80, max: 100 },
  MEDIUM: { min: 50, max: 79 },
  HIGH: { min: 1, max: 49 },
} as const

// Business categories
export const BUSINESS_CATEGORIES = [
  'Restaurant',
  'Retail',
  'Services',
  'Technology',
  'Agriculture',
  'Manufacturing',
  'Healthcare',
  'Education',
  'Other',
] as const

export const DIVVI_CONSUMER_ADDRESS = "0xf13dc3f7f6265e3bddcd07b3870e751dc3c3e026";