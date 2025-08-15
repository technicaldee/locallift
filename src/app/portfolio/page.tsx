'use client'

import { useAuth } from '@/contexts/auth-context'
import { PortfolioDashboard } from '@/components/portfolio/portfolio-dashboard'
import { useState, useEffect } from 'react'
// import { Metadata } from 'next'
// import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Generate metadata for this page
// export const generateMetadata = (): Metadata => {
//   const title = "LocalLift - Investment Portfolio"
//   const description = "Track and manage your investments in local businesses"
  
//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       images: ["/portfolio-dashboard.png"],
//     },
//     other: generateFarcasterEmbed({
//       imageUrl: "https://locallift.xyz/portfolio-dashboard.png",
//       buttonTitle: "View Portfolio",
//       targetUrl: "https://locallift.xyz/portfolio"
//     })
//   }
// }

import { ClientOnly } from '@/components/client-only';

export default function PortfolioPage() {
  return (
    <ClientOnly>
      <PortfolioPageContent />
    </ClientOnly>
  );
}

function PortfolioPageContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const { user, isLoading } = useAuth()

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet and sign in to view your portfolio.</p>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (user.role !== 'investor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This page is only accessible to investors.</p>
          <a href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortfolioDashboard />
    </div>
  )
}