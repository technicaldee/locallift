'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { isInFarcasterMiniApp } from '@/lib/farcaster-utils'

interface ShareButtonProps {
  text?: string
  url: string
  className?: string
  children?: React.ReactNode
}

export function FarcasterShareButton({ text, url, className, children }: ShareButtonProps) {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null)

  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        const inMiniApp = await isInFarcasterMiniApp()
        setIsMiniApp(inMiniApp)
      } catch (error) {
        console.error('Error checking Farcaster environment:', error)
        setIsMiniApp(false)
      }
    }
    
    checkFarcaster()
  }, [])

  const handleShare = async () => {
    if (isMiniApp) {
      try {
        // Use Farcaster compose cast action
        await sdk.actions.composeCast({
          text: text || `Check out this investment opportunity on LocalLift!`,
          embeds: [url]
        })
      } catch (error) {
        console.error('Error sharing to Farcaster:', error)
      }
    } else {
      // Fallback to regular share if not in a mini app
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'LocalLift',
            text: text || 'Check out this investment opportunity on LocalLift!',
            url
          })
        } catch (error) {
          console.error('Error sharing:', error)
        }
      } else {
        // Copy to clipboard if Web Share API is not available
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      }
    }
  }

  // Don't render until we've checked if we're in a mini app
  if (isMiniApp === null) {
    return null
  }

  return (
    <button
      onClick={handleShare}
      className={className || 'bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'}
    >
      {children || (isMiniApp ? 'Share on Farcaster' : 'Share')}
    </button>
  )
}