'use client'

import { Business, FundingRequest, RiskAssessment } from '@/lib/types'
import { MapPin, DollarSign, TrendingUp, Users, Clock, Shield, Share2 } from 'lucide-react'
import { RISK_RANGES } from '@/lib/constants'
import { FarcasterShareButton } from '@/components/farcaster/share-button'

interface BusinessCardProps {
  business: Business
  fundingRequest: FundingRequest
  riskAssessment?: RiskAssessment
  onInvest: () => void
  onViewDetails: () => void
}

export function BusinessCard({ 
  business, 
  fundingRequest, 
  riskAssessment, 
  onInvest, 
  onViewDetails 
}: BusinessCardProps) {
  const progressPercentage = (fundingRequest.currentAmount / fundingRequest.targetAmount) * 100
  
  const getRiskLevel = (score: number) => {
    if (score >= RISK_RANGES.LOW.min) return { level: 'Low', color: 'text-green-600 bg-green-100' }
    if (score >= RISK_RANGES.MEDIUM.min) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' }
    return { level: 'High', color: 'text-red-600 bg-red-100' }
  }

  const risk = riskAssessment ? getRiskLevel(riskAssessment.riskScore) : null

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      {/* Business Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{business.name}</h3>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {business.location.city}
              </span>
              <span>{business.type}</span>
            </div>
          </div>
          {risk && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${risk.color}`}>
              {risk.level} Risk
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{business.description}</p>
      </div>

      {/* Funding Details */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">{fundingRequest.purpose}</h4>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Raised: ${fundingRequest.currentAmount.toLocaleString()}</span>
            <span>Goal: ${fundingRequest.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-600 mt-1">
            {progressPercentage.toFixed(1)}% funded
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Revenue</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              ${(business.monthlyRevenue / 1000).toFixed(0)}K/mo
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-gray-700">Duration</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {fundingRequest.duration} months
            </div>
          </div>
        </div>

        {/* AI Risk Assessment */}
        {riskAssessment && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">AI Risk Score</span>
              </div>
              <span className="text-lg font-bold text-blue-900">
                {riskAssessment.riskScore}/100
              </span>
            </div>
            <div className="text-xs text-blue-700">
              Recommended rate: {riskAssessment.recommendedInterestRate}% annually
            </div>
          </div>
        )}

        {/* Business Stats */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{business.yearsInOperation} years</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{business.employeeCount} employees</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-3">
          <button
            onClick={onViewDetails}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Details
          </button>
          <button
            onClick={onInvest}
            disabled={fundingRequest.status !== 'active'}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Invest Now
          </button>
        </div>
        
        {/* Share Button */}
        <FarcasterShareButton 
          text={`Check out ${business.name} on LocalLift! They're raising $${fundingRequest.targetAmount.toLocaleString()} for ${fundingRequest.purpose}.`}
          url={`https://locallift.xyz/invest?business=${business.id}`}
          className="w-full flex items-center justify-center border border-purple-300 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors font-medium"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share on Farcaster
        </FarcasterShareButton>
      </div>
    </div>
  )
}