import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDoc, getDocs, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Business, FundingRequest, RiskAssessment } from '@/lib/types';

/**
 * Service for business-related operations using Firebase
 */
export const BusinessService = {
  /**
   * Register a new business
   */
  async registerBusiness(businessData: Partial<Business>, documents: File[]): Promise<string> {
    try {
      // Upload documents to Firebase Storage
      const documentUrls = await Promise.all(
        documents.map(async (file) => {
          const storageRef = ref(storage, `business-documents/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );
      
      // Create business record in Firestore
      const businessRef = await addDoc(collection(db, 'businesses'), {
        ...businessData,
        documentUrls,
        verificationStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return businessRef.id;
    } catch (error) {
      console.error('Error registering business:', error);
      throw new Error('Failed to register business');
    }
  },
  
  /**
   * Get businesses owned by a user
   */
  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('ownerId', '==', ownerId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Business[];
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return [];
    }
  },
  
  /**
   * Get investment opportunities
   */
  async getInvestmentOpportunities(): Promise<{
    business: Business;
    fundingRequest: FundingRequest;
    riskAssessment?: RiskAssessment;
  }[]> {
    try {
      // Get funding requests
      const fundingQuery = query(
        collection(db, 'fundingRequests'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      
      const fundingSnapshot = await getDocs(fundingQuery);
      const fundingRequests = fundingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FundingRequest[];
      
      // Get associated businesses and risk assessments
      const opportunities = await Promise.all(
        fundingRequests.map(async (request) => {
          const businessDoc = await getDoc(doc(db, 'businesses', request.businessId));
          const business = { id: businessDoc.id, ...businessDoc.data() } as Business;
          
          // Get risk assessment if available
          let riskAssessment: RiskAssessment | undefined;
          try {
            const riskQuery = query(
              collection(db, 'riskAssessments'),
              where('businessId', '==', request.businessId),
              orderBy('assessmentDate', 'desc'),
              limit(1)
            );
            
            const riskSnapshot = await getDocs(riskQuery);
            if (!riskSnapshot.empty) {
              const riskData = riskSnapshot.docs[0].data();
              riskAssessment = { id: riskSnapshot.docs[0].id, ...riskData } as unknown as RiskAssessment;
            }
          } catch (e) {
            console.error('Error fetching risk assessment:', e);
          }
          
          return {
            business,
            fundingRequest: request,
            riskAssessment
          };
        })
      );
      
      return opportunities;
    } catch (error) {
      console.error('Error fetching investment opportunities:', error);
      return [];
    }
  },
  
  /**
   * Create a funding request
   */
  async createFundingRequest(fundingData: Partial<FundingRequest>): Promise<string> {
    try {
      const fundingRef = await addDoc(collection(db, 'fundingRequests'), {
        ...fundingData,
        currentAmount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return fundingRef.id;
    } catch (error) {
      console.error('Error creating funding request:', error);
      throw new Error('Failed to create funding request');
    }
  },
  
  /**
   * Update funding request with contract address
   */
  async updateFundingWithContract(fundingId: string, poolContractAddress: string): Promise<void> {
    try {
      const fundingRef = doc(db, 'fundingRequests', fundingId);
      await updateDoc(fundingRef, {
        poolContractAddress,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating funding with contract:', error);
      throw new Error('Failed to update funding with contract address');
    }
  }
};