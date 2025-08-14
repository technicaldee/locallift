'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFarcaster } from '@/hooks/useFarcaster';

interface LeaderboardUser {
  id: string;
  wallet: string;
  username?: string;
  avatar?: string;
  totalInvested: number;
  totalEarnings: number;
  rank: number;
}

export function LeaderboardView() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useFarcaster();

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('totalInvested', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      const leaderboardData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        rank: index + 1,
      })) as LeaderboardUser[];
      
      setLeaders(leaderboardData);

      // Find current user's rank
      if (user) {
        const userWallet = user.verifications[0] || `fid:${user.fid}`;
        const userIndex = leaderboardData.findIndex(u => u.wallet === userWallet);
        setUserRank(userIndex >= 0 ? userIndex + 1 : null);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Top Investors</h1>
          {userRank && (
            <p className="text-gray-600">Your rank: #{userRank}</p>
          )}
        </div>

        <div className="space-y-3">
          {leaders.map((leader) => (
            <Card key={leader.id} className="overflow-hidden glass-card soft-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(leader.rank)}
                  </div>
                  
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={leader.avatar} />
                    <AvatarFallback>
                      {leader.username?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {leader.username || `User ${leader.wallet.slice(-6)}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${leader.totalInvested.toLocaleString()} invested
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-emerald-500">
                      +${leader.totalEarnings.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leaders.length === 0 && (
          <div className="text-center py-12">
            <div className="h-16 w-16 glass rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              No investors yet
            </h3>
            <p className="text-slate-500">
              Be the first to start investing in businesses!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}