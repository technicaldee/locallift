import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Investment } from '@/lib/types';
import { getContract } from '@/lib/contracts';
import { parseEther } from 'viem';

/**
 * Service for investment-related operations using Firebase and smart contracts
 */
export const InvestmentService = {
  /**
   * Make an investment in a business
   */
  async investInBusiness(
    investorId: string,
    businessId: string,
    poolId: string,
    poolContractAddress: string,
    amount: number,
    interestRate: number,
    duration: number
  ): Promise<{ transactionHash: string; investmentId: string }> {
    try {
      // 1. Execute blockchain transaction
      const investmentPoolContract = await getContract('InvestmentPool', poolContractAddress);
      
      // Convert amount to wei (ethers)
      const amountInWei = parseEther(amount.toString());
      
      // Call the contract's invest function
      const tx = await investmentPoolContract.write.invest([poolId, amountInWei]);
      
      // 2. Store investment record in Firebase
      const investmentData = {
        investorId,
        businessId,
        poolId,
        amount,
        interestRate,
        duration,
        status: 'active',
        transactionHash: tx,
        contractAddress: poolContractAddress,
        createdAt: new Date()
      };
      
      const investmentRef = await addDoc(collection(db, 'investments'), investmentData);
      
      return {
        transactionHash: tx,
        investmentId: investmentRef.id
      };
    } catch (error) {
      console.error('Error making investment:', error);
      throw new Error('Failed to make investment');
    }
  },
  
  /**
   * Get investments for an investor
   */
  async getInvestorInvestments(investorId: string): Promise<Investment[]> {
    try {
      const q = query(
        collection(db, 'investments'),
        where('investorId', '==', investorId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Investment[];
    } catch (error) {
      console.error('Error fetching investments:', error);
      return [];
    }
  },
  
  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(investorId: string) {
    try {
      const investments = await this.getInvestorInvestments(investorId);
      
      // Calculate statistics
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;
      const completedInvestments = investments.filter(inv => inv.status === 'completed').length;
      
      // Calculate expected returns
      const totalExpectedReturns = investments.reduce((sum, inv) => {
        const expectedReturn = inv.amount * (1 + (inv.interestRate / 100) * (inv.duration / 12));
        return sum + (expectedReturn - inv.amount);
      }, 0);
      
      const averageReturn = totalInvested > 0 ? (totalExpectedReturns / totalInvested) * 100 : 0;
      const uniqueBusinesses = new Set(investments.map(inv => inv.businessId)).size;

      return {
        totalInvested,
        totalReturns: Math.round(totalExpectedReturns),
        activeInvestments,
        completedInvestments,
        averageReturn: Math.round(averageReturn * 10) / 10,
        businessesHelped: uniqueBusinesses
      };
    } catch (error) {
      console.error('Error calculating portfolio stats:', error);
      throw new Error('Failed to calculate portfolio statistics');
    }
  }
};