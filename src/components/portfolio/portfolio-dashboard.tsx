'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Investment } from '@/lib/types'
import { getInvestmentsByInvestor } from '@/lib/firebase-services'
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  Building,
  Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'

interface PortfolioStats {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  completedInvestments: number
  averageReturn: number
  businessesHelped: number
}

interface InvestmentWithBusiness extends Investment {
  businessName: string
  businessType: string
  expectedReturn: number
  monthlyPayment: number
  nextPaymentDate: Date
}

export function PortfolioDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [investments, setInvestments] = useState<InvestmentWithBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  useEffect(() => {

  const fetchPortfolioData = async () => {
    if (!user) return;
    setIsLoading(true)
    setError(null)
    try {
      // 1. Fetch investments for the user from Firestore
      const investmentsData = (await getInvestmentsByInvestor(user.id)) as Investment[]
      setInvestments(investmentsData as InvestmentWithBusiness[])

      // 2. Aggregate stats
      const totalInvested = investmentsData.reduce((sum, inv) => sum + inv.amount, 0)
      const totalReturns = investmentsData.reduce((sum, inv) => sum + (inv.amount * (inv.interestRate / 100) * (inv.duration / 12)), 0)
      const activeInvestments = investmentsData.filter(inv => inv.status === 'active').length
      const completedInvestments = investmentsData.filter(inv => inv.status === 'completed').length
      const averageReturn = investmentsData.length > 0 ? (totalReturns / totalInvested) * 100 : 0
      const businessesHelped = new Set(investmentsData.map(inv => inv.businessId)).size
      setStats({ totalInvested, totalReturns, activeInvestments, completedInvestments, averageReturn, businessesHelped })
    } catch (err) {
      console.log(err)
      setError('Failed to load portfolio data')
      setStats(null)
      setInvestments([])
    } finally {
      setIsLoading(false)
    }
  }
    if (user) {
      fetchPortfolioData()
    }
  }, [user])


  // Generate real performance data (by month)
  const performanceData = (() => {
    if (!investments.length) return [];
    const monthly: { [key: string]: number } = {};
    (investments as Investment[]).forEach(inv => {
      const date = new Date(inv.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`
      monthly[key] = (monthly[key] || 0) + inv.amount
    })
    return Object.entries(monthly).map(([month, value]) => ({ month, value }))
  })()

  // Generate real allocation data (by business type)
  const allocationData = (() => {
    if (!investments.length) return [];
    const byType: { [key: string]: number } = {};
    (investments as InvestmentWithBusiness[]).forEach(inv => {
      const type = (inv as InvestmentWithBusiness).businessType || 'Other'
      byType[type] = (byType[type] || 0) + inv.amount
    })
    const total = Object.values(byType).reduce((a, b) => a + b, 0)
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#6B7280']
    return Object.entries(byType).map(([name, value], i) => ({ name, value: Math.round((value / total) * 100), color: colors[i % colors.length] }))
  })()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12 text-red-600 font-semibold">
        <p>{error || 'Failed to load portfolio data'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Portfolio</h1>
        <p className="text-gray-600">Track your investments and returns</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalInvested.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalReturns.toLocaleString()}</p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+{stats.averageReturn.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Investments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInvestments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Businesses Helped</p>
              <p className="text-2xl font-bold text-gray-900">{stats.businessesHelped}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Portfolio Performance</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="1m">1 Month</option>
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Allocation</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Investments */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Investments</h2>
        </div>
        <div className="p-6">
          {investments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active investments yet</p>
              <a
                href="/invest"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Investing
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => (
                <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{investment.businessName}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {investment.businessType}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${investment.status === 'active' ? 'bg-green-100 text-green-800' :
                          investment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {investment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Invested:</span>
                          <div className="font-medium">${investment.amount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Expected Return:</span>
                          <div className="font-medium text-green-600">${investment.expectedReturn.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <div className="font-medium">{investment.interestRate}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <div className="font-medium">{investment.duration} months</div>
                        </div>
                      </div>

                      {investment.status === 'active' && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Next payment: {investment.nextPaymentDate.toLocaleDateString()}</span>
                          <span className="ml-4">Amount: ${investment.monthlyPayment.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}