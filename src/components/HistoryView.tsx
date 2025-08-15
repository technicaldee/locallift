'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';
import { useAccount } from 'wagmi';
import { InvestmentService } from '@/lib/investmentService';
import { Investment } from '@/types';

export function HistoryView() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { user } = useFarcaster();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      loadInvestments();
    }
  }, [isConnected, address]);

  const loadInvestments = async () => {
    if (!address) return;

    try {
      // Load from blockchain
      const blockchainHistory = await InvestmentService.getInvestorHistory(address);
      
      // Load from Firebase for additional metadata
      const investmentsRef = collection(db, 'investments');
      const q = query(
        investmentsRef,
        where('investorAddress', '==', address),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const firebaseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      
      // Merge blockchain and Firebase data
      const mergedInvestments = blockchainHistory.map((blockchainInv: any) => {
        const firebaseInv = firebaseData.find(fb => 
          fb.transactionHash === blockchainInv.transactionHash ||
          (fb.businessId === blockchainInv.businessId && 
           Math.abs(fb.amount - parseFloat(blockchainInv.amount)) < 0.01)
        );
        
        return {
          id: firebaseInv?.id || `${blockchainInv.businessId}-${blockchainInv.timestamp}`,
          businessId: blockchainInv.businessId,
          amount: parseFloat(blockchainInv.amount),
          timestamp: new Date(blockchainInv.timestamp * 1000),
          transactionHash: firebaseInv?.transactionHash,
          expectedReturn: firebaseInv?.expectedReturn || parseFloat(blockchainInv.amount) * 1.15, // 15% default return
          status: firebaseInv?.status || 'completed',
        };
      });
      
      setInvestments(mergedInvestments);
      
      // Calculate totals
      const invested = mergedInvestments.reduce((sum, inv) => sum + inv.amount, 0);
      const earnings = mergedInvestments.reduce((sum, inv) => sum + (inv.expectedReturn - inv.amount), 0);
      
      setTotalInvested(invested);
      setTotalEarnings(earnings);
    } catch (error) {
      console.error('Error loading investments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-3xl mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-2xl mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Investment History</h1>

        {/* Stats Card */}
        <Card className="mb-6 glass-card soft-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-slate-500">Total Invested</p>
                <p className="text-2xl font-bold text-slate-700">${totalInvested.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">Total Earnings</p>
                <p className="text-2xl font-bold flex items-center justify-center text-slate-700">
                  {totalEarnings >= 0 ? (
                    <TrendingUp className="h-5 w-5 mr-1 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 mr-1 text-red-400" />
                  )}
                  ${Math.abs(totalEarnings).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment List */}
        <div className="space-y-3">
          {investments.map((investment) => (
            <Card key={investment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 glass rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Investment</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {investment.timestamp?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${investment.amount}</p>
                    <p className="text-sm text-emerald-500">
                      +${(investment.expectedReturn - investment.amount).toFixed(2)} expected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {investments.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No investments yet
            </h3>
            <p className="text-gray-600">
              Start swiping to make your first investment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}