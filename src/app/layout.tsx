import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swipevest - Swipe. Invest. Earn.",
  description: "Discover and invest in local businesses with a simple swipe. Join the community of investors supporting entrepreneurs.",
  keywords: "investment, business, startup, funding, swipe, local business",
  authors: [{ name: "Swipevest" }],
  creator: "Swipevest",
  publisher: "Swipevest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#ec4899",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Swipevest - Swipe. Invest. Earn.",
    description: "Discover and invest in local businesses with a simple swipe.",
    url: "https://swipevest.site",
    siteName: "Swipevest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Swipevest - Investment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swipevest - Swipe. Invest. Earn.",
    description: "Discover and invest in local businesses with a simple swipe.",
    images: ["/og-image..png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}