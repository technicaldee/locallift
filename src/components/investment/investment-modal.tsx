'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Payment, PaymentDialog } from "@composer-kit/ui/payment"
import { Business, FundingRequest, RiskAssessment } from '@/lib/types'
import { TOKEN_ADDRESSES, PLATFORM_CONFIG } from '@/lib/constants'
import { celo } from 'wagmi/chains'
import { X, DollarSign, TrendingUp, Shield, AlertTriangle } from 'lucide-react'

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  business: Business
  fundingRequest: FundingRequest
  riskAssessment?: RiskAssessment
  onSuccess: (txHash: string) => void
}

export function InvestmentModal({
  isOpen,
  onClose,
  business,
  fundingRequest,
  riskAssessment,
  onSuccess
}: InvestmentModalProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(5)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { } = useAccount()

  if (!isOpen) return null

  const handleInvestmentSuccess = async (txHash: string) => {
    try {
      // Call our API to record the investment
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/investment/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: business.id,
          poolId: fundingRequest.id,
          poolContractAddress: fundingRequest.poolContractAddress,
          amount: investmentAmount,
          interestRate: fundingRequest.interestRate,
          duration: fundingRequest.duration
        })
      })

      if (response.ok) {
        setShowPaymentDialog(false)
        onSuccess(txHash)
        onClose()
      } else {
        throw new Error('Failed to record investment')
      }
    } catch (error) {
      console.error('Error recording investment:', error)
      // Still close modal and show success since blockchain transaction succeeded
      setShowPaymentDialog(false)
      onSuccess(txHash)
      onClose()
    }
  }

  const handleInvestmentError = (error: Error) => {
    console.error('Investment error:', error)
    setShowPaymentDialog(false)
  }

  const expectedReturn = investmentAmount * (1 + (fundingRequest.interestRate / 100) * (fundingRequest.duration / 12))
  const totalReturn = expectedReturn - investmentAmount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
              <p className="text-gray-600">{fundingRequest.purpose}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Investment Details */}
        <div className="p-6 space-y-6">
          {/* Risk Assessment */}
          {riskAssessment && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">AI Risk Assessment</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Risk Score:</span>
                  <span className="font-semibold text-blue-900 ml-2">
                    {riskAssessment.riskScore}/100
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Recommended Rate:</span>
                  <span className="font-semibold text-blue-900 ml-2">
                    {riskAssessment.recommendedInterestRate}%
                  </span>
                </div>
              </div>
              {riskAssessment.riskFactors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-blue-700 mb-2">Key Risk Factors:</p>
                  <div className="space-y-1">
                    {riskAssessment.riskFactors.slice(0, 3).map((factor, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          factor.impact === 'positive' ? 'bg-green-400' :
                          factor.impact === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-blue-800">{factor.factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Investment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (cUSD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min={PLATFORM_CONFIG.MIN_INVESTMENT}
                max={Math.min(PLATFORM_CONFIG.MAX_INVESTMENT, fundingRequest.targetAmount - fundingRequest.currentAmount)}
                step="1"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Min: ${PLATFORM_CONFIG.MIN_INVESTMENT}</span>
              <span>Max: ${Math.min(PLATFORM_CONFIG.MAX_INVESTMENT, fundingRequest.targetAmount - fundingRequest.currentAmount)}</span>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Investment Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Investment Amount:</span>
                <span className="font-medium">${investmentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-medium">{fundingRequest.interestRate}% annually</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{fundingRequest.duration} months</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return:</span>
                  <span className="font-medium text-green-600">+${totalReturn.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Expected:</span>
                  <span className="text-green-600">${expectedReturn.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-medium text-yellow-800 mb-2">Investment Risks</h4>
                <ul className="text-yellow-700 space-y-1 text-xs">
                  <li>• Investments in local businesses carry inherent risks</li>
                  <li>• Returns are not guaranteed and depend on business performance</li>
                  <li>• You may lose some or all of your investment</li>
                  <li>• Funds will be locked for the investment duration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I understand the risks involved and agree to the{' '}
              <a href="#" className="text-green-600 hover:text-green-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-green-600 hover:text-green-700 underline">
                Investment Agreement
              </a>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            
            <Payment
              amount={investmentAmount.toString()}
              tokenAddress={TOKEN_ADDRESSES.cUSD}
              recipientAddress={(fundingRequest.poolContractAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`}
              chain={celo}
              onSuccess={handleInvestmentSuccess}
              onError={handleInvestmentError}
            >
              <button
                onClick={() => setShowPaymentDialog(true)}
                disabled={!agreedToTerms || investmentAmount < PLATFORM_CONFIG.MIN_INVESTMENT}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Invest ${investmentAmount.toFixed(2)}
              </button>
              
              <PaymentDialog
                open={showPaymentDialog}
                onOpenChange={setShowPaymentDialog}
              />
            </Payment>
          </div>
        </div>
      </div>
    </div>
  )
}