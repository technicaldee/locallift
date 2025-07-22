import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-jwt-secret-here'
)

export interface UserProfile {
  id: string
  walletAddress: string
  email?: string
  phoneNumber?: string
  role: 'investor' | 'business_owner' | 'admin'
  kycStatus: 'pending' | 'verified' | 'rejected'
  preferredLanguage: 'en' | 'es' | 'pt'
  createdAt: Date
  updatedAt: Date
}

export interface InvestorProfile {
  userId: string
  riskTolerance: 'low' | 'medium' | 'high'
  investmentPreferences: string[]
  totalInvested: number
  totalReturns: number
  activeInvestments: number
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export interface JWTPayload {
  userId: string
  address: string
  role: string
  iat?: number
  exp?: number
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    throw new Error('Invalid token')
  }
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export async function createUserSession(user: UserProfile): Promise<{ token: string }> {
  // Create a JWT token with user information
  const token = await signToken({
    userId: user.id,
    address: user.walletAddress || null,
    role: user.role || 'investor',
    fid: null
  })
  
  return { token }
}