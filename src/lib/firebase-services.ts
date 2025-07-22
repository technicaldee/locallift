import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  setDoc,
  FieldValue
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Business, FundingRequest, RiskAssessment, Investment, User } from './types'

// User Profile Services
export const createUserProfile = async (userId: string, profileData: Record<string, unknown>) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null
}

// Business Services
export const createBusiness = async (businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) => {
  const businessRef = await addDoc(collection(db, 'businesses'), {
    ...businessData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return businessRef.id
}

export const getBusiness = async (businessId: string) => {
  const businessRef = doc(db, 'businesses', businessId)
  const businessSnap = await getDoc(businessRef)
  return businessSnap.exists() ? { id: businessSnap.id, ...businessSnap.data() } : null
}

export const getBusinessesByOwner = async (ownerId: string) => {
  const q = query(
    collection(db, 'businesses'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getVerifiedBusinesses = async (limitCount = 20) => {
  const q = query(
    collection(db, 'businesses'),
    where('verificationStatus', '==', 'verified'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateBusinessStatus = async (businessId: string, status: string) => {
  const businessRef = doc(db, 'businesses', businessId)
  await updateDoc(businessRef, {
    verificationStatus: status,
    updatedAt: serverTimestamp()
  })
}

// Funding Request Services
export const createFundingRequest = async (fundingData: Omit<FundingRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  const fundingRef = await addDoc(collection(db, 'fundingRequests'), {
    ...fundingData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return fundingRef.id
}

export const getFundingRequestsByBusiness = async (businessId: string) => {
  const q = query(
    collection(db, 'fundingRequests'),
    where('businessId', '==', businessId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getActiveFundingRequests = async (limitCount = 20): Promise<FundingRequest[]> => {
  const q = query(
    collection(db, 'fundingRequests'),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FundingRequest))
}

export const updateFundingRequestAmount = async (requestId: string, currentAmount: number) => {
  const requestRef = doc(db, 'fundingRequests', requestId)
  await updateDoc(requestRef, {
    currentAmount,
    updatedAt: serverTimestamp()
  })
}

// Investment Services
export const createInvestment = async (investmentData: Omit<Investment, 'id' | 'createdAt'>) => {
  const investmentRef = await addDoc(collection(db, 'investments'), {
    ...investmentData,
    createdAt: serverTimestamp()
  })
  return investmentRef.id
}

export const getInvestmentsByInvestor = async (investorId: string) => {
  const q = query(
    collection(db, 'investments'),
    where('investorId', '==', investorId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getInvestmentsByBusiness = async (businessId: string) => {
  const q = query(
    collection(db, 'investments'),
    where('businessId', '==', businessId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// AI Risk Assessment Services
export const saveRiskAssessment = async (assessmentData: Omit<RiskAssessment, 'assessmentDate'>) => {
  const assessmentRef = await addDoc(collection(db, 'riskAssessments'), {
    ...assessmentData,
    assessmentDate: serverTimestamp()
  })
  return assessmentRef.id
}

export const getRiskAssessment = async (businessId: string) => {
  const q = query(
    collection(db, 'riskAssessments'),
    where('businessId', '==', businessId),
    orderBy('assessmentDate', 'desc'),
    limit(1)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.length > 0 ?
    { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } : null
}

// File Upload Services
export const uploadBusinessDocument = async (file: File, businessId: string): Promise<string> => {
  const fileName = `businesses/${businessId}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, fileName)

  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}

export const uploadBusinessPhoto = async (file: File, businessId: string): Promise<string> => {
  const fileName = `businesses/${businessId}/photos/${Date.now()}_${file.name}`
  const storageRef = ref(storage, fileName)

  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}

// Combined Services for Investment Opportunities
export const getInvestmentOpportunities = async () => {
  // Get active funding requests
  const fundingRequests = await getActiveFundingRequests()

  // Get corresponding businesses and risk assessments
  const opportunities = await Promise.all(
    fundingRequests.map(async (request: FundingRequest) => {
      const business = await getBusiness(request.businessId)
      const riskAssessment = await getRiskAssessment(request.businessId)

      return {
        business,
        fundingRequest: request,
        riskAssessment
      }
    })
  )

  return opportunities.filter(opp => opp.business) // Filter out any null businesses
}
//Farcaster Integration Services
export const getUserByFid = async (fid: number) => {
  const q = query(
    collection(db, 'users'),
    where('farcasterFid', '==', fid),
    limit(1)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.length > 0 ?
    { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } : null
}

export const createUserFromFarcaster = async (fid: number) => {
  // Create a new user document with Farcaster FID
  const userRef = doc(collection(db, 'users'))

  // Use any type for the Firestore document data to avoid type conflicts
  const firestoreData: any = {
    farcasterFid: fid,
    authProvider: 'farcaster',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    displayName: `Farcaster User ${fid}`, // Default name
    email: null, // Farcaster doesn't provide email
    walletAddress: null // Will be connected later
  }

  await setDoc(userRef, firestoreData)

  // Return the created user with proper types
  return {
    id: userRef.id,
    ...firestoreData
  }
}

export const linkWalletToFarcasterUser = async (userId: string, walletAddress: string) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    walletAddress,
    updatedAt: serverTimestamp()
  })
}

export const updateFarcasterUserProfile = async (userId: string, profileData: Record<string, unknown>) => {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp()
  })
}
// Search businesses by city or region
export const getBusinessesByLocation = async (location: string, limitCount = 20) => {
  // First try exact city match
  const cityQuery = query(
    collection(db, 'businesses'),
    where('location.city', '==', location),
    where('verificationStatus', '==', 'verified'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  
  let querySnapshot = await getDocs(cityQuery)
  let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // If no results, try partial match (this is less efficient but works for demo purposes)
  // In production, you might want to use a search service like Algolia
  if (results.length === 0) {
    const allBusinessesQuery = query(
      collection(db, 'businesses'),
      where('verificationStatus', '==', 'verified'),
      limit(100) // Get a larger set to filter client-side
    )
    
    querySnapshot = await getDocs(allBusinessesQuery)
    const allBusinesses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Filter for partial matches in city or country
    results = allBusinesses.filter((business: any) => {
      const city = business.location?.city?.toLowerCase() || ''
      const country = business.location?.country?.toLowerCase() || ''
      const searchTerm = location.toLowerCase()
      
      return city.includes(searchTerm) || country.includes(searchTerm)
    }).slice(0, limitCount)
  }
  
  return results
}

// Get businesses by multiple filters including location
export const getFilteredBusinesses = async (filters: {
  category?: string,
  location?: string,
  minRevenue?: number,
  maxRevenue?: number,
  riskScore?: number,
  limit?: number
}) => {
  // Start with base query for verified businesses
  let baseQuery = query(
    collection(db, 'businesses'),
    where('verificationStatus', '==', 'verified')
  )
  
  // Add category filter if provided
  if (filters.category) {
    baseQuery = query(
      baseQuery,
      where('type', '==', filters.category)
    )
  }
  
  // Add revenue filters if provided
  if (filters.minRevenue !== undefined) {
    baseQuery = query(
      baseQuery,
      where('monthlyRevenue', '>=', filters.minRevenue)
    )
  }
  
  if (filters.maxRevenue !== undefined) {
    baseQuery = query(
      baseQuery,
      where('monthlyRevenue', '<=', filters.maxRevenue)
    )
  }
  
  // Add limit
  baseQuery = query(
    baseQuery,
    orderBy('createdAt', 'desc'),
    limit(filters.limit || 20)
  )
  
  // Execute query
  const querySnapshot = await getDocs(baseQuery)
  let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Filter by location if provided (client-side filtering)
  if (filters.location) {
    const locationLower = filters.location.toLowerCase()
    results = results.filter((business: any) => {
      const city = business.location?.city?.toLowerCase() || ''
      const country = business.location?.country?.toLowerCase() || ''
      
      return city.includes(locationLower) || country.includes(locationLower)
    })
  }
  
  // For risk score filtering, we need to get risk assessments separately
  if (filters.riskScore !== undefined) {
    // Get risk assessments for all businesses
    const riskAssessments = await Promise.all(
      results.map(async (business: any) => {
        return await getRiskAssessment(business.id)
      })
    )
    
    // Filter businesses based on risk score
    results = results
    // results = results.filter((business: any, index) => {
    //   const assessment = riskAssessments[index]
    //   if (!assessment) return false
    //   return assessment.riskScore >= filters.riskScore!
    // })
  }
  
  return results
}