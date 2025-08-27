'use client'

import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { sdk } from '@farcaster/miniapp-sdk'

export function FarcasterAutoConnect() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    const autoConnect = async () => {
      try {
        // Check if we're in a Farcaster miniapp
        const isInMiniApp = await sdk.isInMiniApp()
        
        if (isInMiniApp && !isConnected) {
          // Find the Farcaster connector
          const farcasterConnector = connectors.find((c: any) => c.id === 'farcasterMiniApp')
          
          if (farcasterConnector) {
            console.log('Auto-connecting to Farcaster wallet...')
            connect({ connector: farcasterConnector })
          }
        }
      } catch (error) {
        console.error('Error auto-connecting to Farcaster wallet:', error)
      }
    }

    autoConnect()
  }, [isConnected, connect, connectors])

  return null // This component doesn't render anything
}