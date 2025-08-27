import { Metadata } from 'next'
import { generateFarcasterEmbed } from '@/lib/farcaster-utils'

export const metadata: Metadata = {
  title: "Swipevest - Business Dashboard",
  description: "Manage your business and funding requests on Swipevest",
  openGraph: {
    title: "Swipevest - Business Dashboard",
    description: "Manage your business and funding requests on Swipevest",
    images: ["/business-dashboard.png"],
  },
  other: generateFarcasterEmbed({
    imageUrl: "https://swipevest.xyz/business-dashboard.png",
    buttonTitle: "Open Business Dashboard",
    targetUrl: "https://swipevest.xyz/business"
  })
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return children
}