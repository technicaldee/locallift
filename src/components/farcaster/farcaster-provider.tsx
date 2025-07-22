'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
import { useConfig } from 'wagmi'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null)
  const config = useConfig()

  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp()
        setIsMiniApp(isInMiniApp)
        
        if (isInMiniApp) {
          // Hide splash screen
          await sdk.actions.ready()
          
          // Add Farcaster connector to Wagmi
          if (config.connectors) {
            const hasConnector = config.connectors.some(
              c => c.id === 'farcasterMiniApp'
            )
            
            if (!hasConnector) {
              config.connectors.push(farcasterMiniApp())
            }
          }
        }
      } catch (error) {
        console.error('Error checking Farcaster environment:', error)
        setIsMiniApp(false)
      }
    }
    
    checkFarcaster()
  }, [config])

  // Return children while we're checking or if we're in a mini app
  if (isMiniApp === null || isMiniApp) {
    return <>{children}</>
  }

  // If we're not in a mini app, render children normally
  return <>{children}</>
}