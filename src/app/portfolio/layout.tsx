import { Metadata } from 'next'
import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

export const metadata: Metadata = {
  title: "LocalLift - Investment Portfolio",
  description: "Track and manage your investments in local businesses",
  openGraph: {
    title: "LocalLift - Investment Portfolio",
    description: "Track and manage your investments in local businesses",
    images: ["/portfolio-dashboard.png"],
  },
  other: generateFarcasterEmbed({
    imageUrl: "https://locallift.xyz/portfolio-dashboard.png",
    buttonTitle: "View Portfolio",
    targetUrl: "https://locallift.xyz/portfolio"
  })
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children
}