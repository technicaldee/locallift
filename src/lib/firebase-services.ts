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
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import { Business, FundingRequest, RiskAssessment, Investment } from './types'

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