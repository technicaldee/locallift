export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { ClientOnly } from "@/components/client-only";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LocalLift - Community Micro-Investment Platform",
  description: "Invest in local businesses with AI-powered risk assessment on Celo blockchain",
  icons: [
    { rel: "icon", url: "/favicon.svg" },
    { rel: "apple-touch-icon", url: "/favicon.svg" }
  ],
  openGraph: {
    title: "LocalLift - Community Micro-Investment Platform",
    description: "Invest in local businesses with AI-powered risk assessment on Celo blockchain",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary",
    title: "LocalLift - Community Micro-Investment Platform",
    description: "Invest in local businesses with AI-powered risk assessment on Celo blockchain",
    images: ["/favicon.svg"],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://locallift.xyz/og-image.png",
      button: {
        title: "Open LocalLift",
        action: {
          type: "launch_miniapp",
          name: "LocalLift",
          url: "https://locallift.xyz",
          splashImageUrl: "https://locallift.xyz/logo.png",
          splashBackgroundColor: "#0f172a"
        }
      }
    }),
    // For backward compatibility
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://locallift.xyz/og-image.png",
      button: {
        title: "Open LocalLift",
        action: {
          type: "launch_frame",
          name: "LocalLift",
          url: "https://locallift.xyz",
          splashImageUrl: "https://locallift.xyz/logo.png",
          splashBackgroundColor: "#0f172a"
        }
      }
    })
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientOnly>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ClientOnly>
      </body>
    </html>
  );
}
