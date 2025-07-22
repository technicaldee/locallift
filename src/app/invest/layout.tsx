import { Metadata } from 'next'
import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

export const metadata: Metadata = {
  title: "LocalLift - Investment Opportunities",
  description: "Discover and invest in local businesses with AI-powered risk assessment",
  openGraph: {
    title: "LocalLift - Investment Opportunities",
    description: "Discover and invest in local businesses with AI-powered risk assessment",
    images: ["/investment-opportunities.png"],
  },
  other: generateFarcasterEmbed({
    imageUrl: "https://locallift.xyz/investment-opportunities.png",
    buttonTitle: "Browse Investments",
    targetUrl: "https://locallift.xyz/invest"
  })
}

export default function InvestLayout({ children }: { children: React.ReactNode }) {
  return children
}