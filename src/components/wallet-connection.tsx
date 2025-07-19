'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Wallet, Connect, Avatar, Name } from "@composer-kit/ui/wallet"
import { SignInModal } from './auth/sign-in-modal'
import { UserProfileDropdown } from './auth/user-profile'
import { useAuth } from '@/contexts/auth-context'

export function WalletConnection() {
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isConnected } = useAccount()
  const { user, isLoading, signIn, signOut } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-show sign in modal when wallet connects but user isn't authenticated
  useEffect(() => {
    if (isConnected && !user && !isLoading) {
      const timer = setTimeout(() => {
        setShowSignInModal(true)
      }, 500) // Small delay to ensure everything is loaded
      return () => clearTimeout(timer)
    }
  }, [isConnected, user, isLoading])

  const handleConnect = () => {
    if (isConnected && !user) {
      setShowSignInModal(true)
    }
  }

  const handleSignInSuccess = (token: string) => {
    signIn(token)
    setShowSignInModal(false)
  }

  // Show loading state during SSR or while loading
  if (!mounted || isLoading) {
    return (
      <div className="bg-gray-200 animate-pulse px-4 py-2 rounded-lg">
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  // Show user profile if authenticated
  if (user) {
    return <UserProfileDropdown user={user} onSignOut={signOut} />
  }

  // Show sign in button if connected but not authenticated
  if (isConnected && !user) {
    return (
      <>
        <button
          onClick={() => setShowSignInModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Sign In
        </button>
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onSuccess={handleSignInSuccess}
        />
      </>
    )
  }

  // Show wallet connection
  return (
    <>
      <Wallet>
        <div className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer">
          <Connect
            label="Connect Wallet"
            onConnect={handleConnect}
          >
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6" />
              <Name isTruncated className="text-sm" />
            </div>
          </Connect>
        </div>
      </Wallet>
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </>
  )
}