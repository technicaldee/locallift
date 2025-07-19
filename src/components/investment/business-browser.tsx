'use client'

import { useState, useEffect, useCallback } from 'react'
import { Business, FundingRequest, RiskAssessment } from '@/lib/types'
import { BUSINESS_CATEGORIES } from '@/lib/constants'
import { BusinessCard } from './business-card'
import { InvestmentModal } from './investment-modal'
import { Search, DollarSign } from 'lucide-react'

interface BusinessOpportunity {
  business: Business
  fundingRequest: FundingRequest
  riskAssessment?: RiskAssessment
}

export function BusinessBrowser() {
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<BusinessOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOpportunity | null>(null)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/investment/opportunities')
      if (response.ok) {
        const data = await response.json()
        setOpportunities(data)
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let filtered = [...opportunities]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.fundingRequest.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(opp => opp.business.type === selectedCategory)
    }

    // Risk level filter
    if (selectedRiskLevel) {
      filtered = filtered.filter(opp => {
        if (!opp.riskAssessment) return false
        const score = opp.riskAssessment.riskScore
        switch (selectedRiskLevel) {
          case 'low': return score >= 80
          case 'medium': return score >= 50 && score < 80
          case 'high': return score < 50
          default: return true
        }
      })
    }

    // Amount filters
    if (minAmount) {
      filtered = filtered.filter(opp => opp.fundingRequest.targetAmount >= parseInt(minAmount))
    }
    if (maxAmount) {
      filtered = filtered.filter(opp => opp.fundingRequest.targetAmount <= parseInt(maxAmount))
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.fundingRequest.createdAt).getTime() - new Date(a.fundingRequest.createdAt).getTime()
        case 'amount_high':
          return b.fundingRequest.targetAmount - a.fundingRequest.targetAmount
        case 'amount_low':
          return a.fundingRequest.targetAmount - b.fundingRequest.targetAmount
        case 'progress':
          const progressA = a.fundingRequest.currentAmount / a.fundingRequest.targetAmount
          const progressB = b.fundingRequest.currentAmount / b.fundingRequest.targetAmount
          return progressB - progressA
        case 'risk_low':
          if (!a.riskAssessment || !b.riskAssessment) return 0
          return b.riskAssessment.riskScore - a.riskAssessment.riskScore
        default:
          return 0
      }
    })

    setFilteredOpportunities(filtered)
  }, [opportunities, searchTerm, selectedCategory, selectedRiskLevel, minAmount, maxAmount, sortBy])

  useEffect(() => {
    fetchOpportunities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleInvest = (opportunity: BusinessOpportunity) => {
    setSelectedBusiness(opportunity)
    setShowInvestmentModal(true)
  }

  const handleInvestmentSuccess = (txHash: string) => {
    console.log('Investment successful:', txHash)
    // Refresh opportunities to show updated amounts
    fetchOpportunities()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
        <p className="text-gray-600">Discover and invest in local businesses in your community</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {BUSINESS_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Risk Level */}
          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk (80-100)</option>
            <option value="medium">Medium Risk (50-79)</option>
            <option value="high">High Risk (1-49)</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="amount_high">Highest Amount</option>
            <option value="amount_low">Lowest Amount</option>
            <option value="progress">Most Progress</option>
            <option value="risk_low">Lowest Risk</option>
          </select>
        </div>

        {/* Amount Range */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="100000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredOpportunities.length} opportunities found
        </p>
      </div>

      {/* Business Cards Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No investment opportunities found</p>
          <p className="text-gray-400">Try adjusting your filters or check back later for new opportunities</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity, index) => (
            <BusinessCard
              key={`${opportunity.business.id}-${index}`}
              business={opportunity.business}
              fundingRequest={opportunity.fundingRequest}
              riskAssessment={opportunity.riskAssessment}
              onInvest={() => handleInvest(opportunity)}
              onViewDetails={() => {
                // TODO: Navigate to business details page
                console.log('View details for:', opportunity.business.name)
              }}
            />
          ))}
        </div>
      )}

      {/* Investment Modal */}
      {selectedBusiness && (
        <InvestmentModal
          isOpen={showInvestmentModal}
          onClose={() => {
            setShowInvestmentModal(false)
            setSelectedBusiness(null)
          }}
          business={selectedBusiness.business}
          fundingRequest={selectedBusiness.fundingRequest}
          riskAssessment={selectedBusiness.riskAssessment}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  )
}