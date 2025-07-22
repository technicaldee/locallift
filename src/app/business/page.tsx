'use client'

export const dynamic = 'force-dynamic'

import { useAuth } from '@/contexts/auth-context'
import { BusinessDashboard } from '@/components/business/business-dashboard'
import { BusinessRegistrationForm } from '@/components/business/business-registration-form'
import { useState, useEffect } from 'react'
// Remove these imports if not used elsewhere
// import { Metadata } from 'next'
// import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

// Remove the generateMetadata function
// export const generateMetadata = (): Metadata => { ... }

export default function BusinessPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const { user, isLoading } = useAuth()
  const [showRegistration, setShowRegistration] = useState(false)

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet and sign in to access the business dashboard.</p>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (user.role !== 'business_owner') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This page is only accessible to business owners.</p>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BusinessRegistrationForm
          onSuccess={(businessId) => {
            console.log('Business registered:', businessId)
            setShowRegistration(false)
          }}
          onCancel={() => setShowRegistration(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessDashboard />
    </div>
  )
}