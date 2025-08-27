'use client'

import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { X, Loader2 } from 'lucide-react'
import { generateNonce } from '@/lib/auth'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (token: string) => void
}

export function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step] = useState<'connect' | 'sign' | 'profile'>('connect')
  const [userRole, setUserRole] = useState<'investor' | 'business_owner'>('investor')

  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const handleSignMessage = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const nonce = generateNonce()
      const message = `Sign in to Swipevest\n\nAddress: ${address}\nNonce: ${nonce}`

      const signature = await signMessageAsync({ message })

      // Send to backend for verification and JWT creation
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          message,
          signature,
          role: userRole
        })
      })

      if (response.ok) {
        const { token } = await response.json()
        onSuccess(token)
        onClose()
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black font-semibold">Welcome to Swipevest</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'connect' && !isConnected && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Connect your wallet to get started with Swipevest
            </p>
            <p className="text-sm text-gray-500">
              Please connect your wallet using the button in the header
            </p>
          </div>
        )}

        {step === 'connect' && isConnected && (
          <div>
            <p className="text-gray-600 mb-4">
              Choose your role on Swipevest:
            </p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="investor"
                  checked={userRole === 'investor'}
                  onChange={(e) => setUserRole(e.target.value as 'investor')}
                  className="text-black"
                />
                <div>
                  <div className="text-black font-medium">Investor</div>
                  <div className="text-sm text-gray-500">
                    Invest in local businesses and earn returns
                  </div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="business_owner"
                  checked={userRole === 'business_owner'}
                  onChange={(e) => setUserRole(e.target.value as 'business_owner')}
                  className="text-black"
                />
                <div>
                  <div className="text-black font-medium">Business Owner</div>
                  <div className="text-sm text-gray-500">
                    Raise funding for your local business
                  </div>
                </div>
              </label>
            </div>
            <button
              onClick={handleSignMessage}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing...</span>
                </>
              ) : (
                <span>Sign Message to Continue</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}