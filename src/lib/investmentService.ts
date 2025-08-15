import { parseEther, formatEther } from 'viem';
import { writeContract, readContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/lib/wagmi';
import DirectInvestmentABI from '@/contracts/abis/DirectInvestment.json';
import cUSDTokenABI from '@/contracts/abis/cUSDToken.json';

const DIRECT_INVESTMENT_ADDRESS = process.env.NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS as `0x${string}`;
const CUSD_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS as `0x${string}`;

export interface InvestmentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class InvestmentService {
  /**
   * Check if user has sufficient cUSD balance and allowance
   */
  static async checkBalance(userAddress: string, amount: string): Promise<{
    hasBalance: boolean;
    hasAllowance: boolean;
    balance: string;
    allowance: string;
  }> {
    try {
      const amountWei = parseEther(amount);
      
      // Check balance
      const balance = await readContract(config, {
        address: CUSD_TOKEN_ADDRESS,
        abi: cUSDTokenABI.abi,
        functionName: 'balanceOf',
        args: [userAddress],
      }) as bigint;

      // Check allowance
      const allowance = await readContract(config, {
        address: CUSD_TOKEN_ADDRESS,
        abi: cUSDTokenABI.abi,
        functionName: 'allowance',
        args: [userAddress, DIRECT_INVESTMENT_ADDRESS],
      }) as bigint;

      return {
        hasBalance: balance >= amountWei,
        hasAllowance: allowance >= amountWei,
        balance: formatEther(balance),
        allowance: formatEther(allowance),
      };
    } catch (error) {
      console.error('Error checking balance:', error);
      return {
        hasBalance: false,
        hasAllowance: false,
        balance: '0',
        allowance: '0',
      };
    }
  }

  /**
   * Approve cUSD spending for the investment contract
   */
  static async approvecUSD(amount: string): Promise<InvestmentResult> {
    try {
      const amountWei = parseEther(amount);
      
      const hash = await writeContract(config, {
        address: CUSD_TOKEN_ADDRESS,
        abi: cUSDTokenABI.abi,
        functionName: 'approve',
        args: [DIRECT_INVESTMENT_ADDRESS, amountWei],
      });

      await waitForTransactionReceipt(config, { hash });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      console.error('Error approving cUSD:', error);
      return {
        success: false,
        error: error.message || 'Failed to approve cUSD',
      };
    }
  }

  /**
   * Make investment to a business
   */
  static async invest(businessId: string, amount: string): Promise<InvestmentResult> {
    try {
      const amountWei = parseEther(amount);
      
      const hash = await writeContract(config, {
        address: DIRECT_INVESTMENT_ADDRESS,
        abi: DirectInvestmentABI.abi,
        functionName: 'invest',
        args: [businessId, amountWei],
      });

      await waitForTransactionReceipt(config, { hash });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      console.error('Error making investment:', error);
      return {
        success: false,
        error: error.message || 'Failed to make investment',
      };
    }
  }

  /**
   * Get business details from contract
   */
  static async getBusiness(businessId: string) {
    try {
      const business = await readContract(config, {
        address: DIRECT_INVESTMENT_ADDRESS,
        abi: DirectInvestmentABI.abi,
        functionName: 'getBusiness',
        args: [businessId],
      });

      return business;
    } catch (error) {
      console.error('Error getting business:', error);
      return null;
    }
  }

  /**
   * Get investor history
   */
  static async getInvestorHistory(investorAddress: string) {
    try {
      const history = await readContract(config, {
        address: DIRECT_INVESTMENT_ADDRESS,
        abi: DirectInvestmentABI.abi,
        functionName: 'getInvestorHistory',
        args: [investorAddress],
      });

      return history;
    } catch (error) {
      console.error('Error getting investor history:', error);
      return [];
    }
  }

  /**
   * Register business on contract (admin only)
   */
  static async registerBusiness(businessId: string, walletAddress: string, goalAmount: string): Promise<InvestmentResult> {
    try {
      const goalWei = parseEther(goalAmount);
      
      const hash = await writeContract(config, {
        address: DIRECT_INVESTMENT_ADDRESS,
        abi: DirectInvestmentABI.abi,
        functionName: 'registerBusiness',
        args: [businessId, walletAddress, goalWei],
      });

      await waitForTransactionReceipt(config, { hash });

      return {
        success: true,
        transactionHash: hash,
      };
    } catch (error: any) {
      console.error('Error registering business:', error);
      return {
        success: false,
        error: error.message || 'Failed to register business',
      };
    }
  }
}