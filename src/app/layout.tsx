import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swipevest - Swipe. Invest. Earn.",
  description: "Discover and invest in local businesses with a simple swipe. Support your community while earning returns on your investments.",
  keywords: ["investment", "local business", "community", "swipe", "earn", "celo", "defi"],
  authors: [{ name: "Swipevest Team" }],
  creator: "Swipevest",
  publisher: "Swipevest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://swipevest.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Swipevest - Swipe. Invest. Earn.",
    description: "Discover and invest in local businesses with a simple swipe. Support your community while earning returns on your investments.",
    url: 'https://swipevest.app',
    siteName: 'Swipevest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swipevest - Swipe. Invest. Earn.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Swipevest - Swipe. Invest. Earn.",
    description: "Discover and invest in local businesses with a simple swipe. Support your community while earning returns on your investments.",
    images: ['/og-image.png'],
    creator: '@swipevest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://swipevest.app/frame-image.png',
    'fc:frame:button:1': 'Start Investing',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://swipevest.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Swipevest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://swipevest.app/frame-image.png" />
        <meta property="fc:frame:button:1" content="Start Investing" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://swipevest.app" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://alfajores-forno.celo-testnet.org" />
      </head>
      <body className={inter.className} style={{color: "black"}}>
        <ErrorBoundary>
          <Providers>
            <OfflineBanner />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}