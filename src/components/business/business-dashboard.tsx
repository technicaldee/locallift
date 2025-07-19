'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Business, FundingRequest } from '@/lib/types'
import { getBusinessesByOwner, getFundingRequestsByBusiness } from '@/lib/firebase-services'
import { getContract } from '@/lib/contracts'
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react'

export function BusinessDashboard() {
  const { user } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchBusinessData()
    }
  }, [user])

  const fetchBusinessData = async () => {
    if (!user) return;
    setIsLoading(true)
    setError(null)
    try {
      // 1. Fetch businesses from Firestore
      const businessesData = await getBusinessesByOwner(user.id)
      setBusinesses(businessesData as Business[])

      // 2. Fetch all funding requests for these businesses
      let allFundingRequests: FundingRequest[] = []
      for (const business of businessesData as Business[]) {
        const requests = (await getFundingRequestsByBusiness(business.id)) as FundingRequest[]
        // 3. Optionally fetch on-chain data for each funding request
        for (const req of requests) {
          if (req.poolContractAddress) {
            try {
              const contract = await getContract('InvestmentPool', req.poolContractAddress)
              // You can fetch on-chain state here and merge into req if needed
            } catch (e) {
              // Ignore contract errors for now
            }
          }
        }
        allFundingRequests = allFundingRequests.concat(requests)
      }
      setFundingRequests(allFundingRequests)
    } catch (err) {
      setError('Failed to load business data')
      setBusinesses([])
      setFundingRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64 text-red-600 font-semibold">{error}</div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Dashboard</h1>
        <p className="text-gray-600">Manage your businesses and funding requests</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Businesses</p>
              <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Funding</p>
              <p className="text-2xl font-bold text-gray-900">
                {fundingRequests.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Raised</p>
              <p className="text-2xl font-bold text-gray-900">
                ${fundingRequests.reduce((sum, r) => sum + r.currentAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {businesses.filter(b => b.verificationStatus === 'verified').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Businesses List */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Businesses</h2>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Business</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {businesses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No businesses registered yet</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Register Your First Business
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {businesses.map((business) => (
                <div key={business.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(business.verificationStatus)}`}>
                          {business.verificationStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{business.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{business.type}</span>
                        <span>•</span>
                        <span>{business.location.city}</span>
                        <span>•</span>
                        <span>${business.monthlyRevenue.toLocaleString()}/month</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(business.verificationStatus)}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Funding Requests */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Funding Requests</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Request</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {fundingRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No funding requests yet</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {fundingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{request.purpose}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>Target: ${request.targetAmount.toLocaleString()}</span>
                        <span>•</span>
                        <span>Raised: ${request.currentAmount.toLocaleString()}</span>
                        <span>•</span>
                        <span>{request.duration} months</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(request.currentAmount / request.targetAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
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