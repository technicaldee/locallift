import { Metadata } from 'next'
import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

export const metadata: Metadata = {
  title: "LocalLift - Business Dashboard",
  description: "Manage your business and funding requests on LocalLift",
  openGraph: {
    title: "LocalLift - Business Dashboard",
    description: "Manage your business and funding requests on LocalLift",
    images: ["/business-dashboard.png"],
  },
  other: generateFarcasterEmbed({
    imageUrl: "https://locallift.xyz/business-dashboard.png",
    buttonTitle: "Open Business Dashboard",
    targetUrl: "https://locallift.xyz/business"
  })
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children
}