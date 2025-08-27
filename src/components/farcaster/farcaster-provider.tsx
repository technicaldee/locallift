'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null)

  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp()
        setIsMiniApp(isInMiniApp)
        
        if (isInMiniApp) {
          // Wait for DOM to be ready and then hide splash screen
          if (document.readyState === 'complete') {
            await sdk.actions.ready()
            console.log('Farcaster Mini App splash screen hidden')
          } else {
            window.addEventListener('load', async () => {
              await sdk.actions.ready()
              console.log('Farcaster Mini App splash screen hidden after load')
            })
          }
        }
      } catch (error) {
        console.error('Error checking Farcaster environment:', error)
        setIsMiniApp(false)
      }
    }
    
    checkFarcaster()
  }, [])

  // Return children while we're checking or if we're in a mini app
  if (isMiniApp === null || isMiniApp) {
    return <>{children}</>
  }

  // If we're not in a mini app, render children normally
  return <>{children}</>
}