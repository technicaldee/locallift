'use client'

export const dynamic = 'force-dynamic'

import { useAuth } from '@/contexts/auth-context'
import { BusinessBrowser } from '@/components/investment/business-browser'
import { useState, useEffect } from 'react'
// Remove these imports if not used elsewhere
// import { Metadata } from 'next'
// import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

// Remove the generateMetadata function

export default function InvestPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const { isLoading } = useAuth()

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Allow browsing even without authentication - auth will be required for actual investing
  return (
    <div className="min-h-screen bg-gray-50">
      <BusinessBrowser />
    </div>
  )
}