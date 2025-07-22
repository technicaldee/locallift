'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { useAuth } from '@/hooks/use-auth'

export function FarcasterAuth() {
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)
  const { user, login } = useAuth()

  useEffect(() => {
    const checkFarcaster = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp()
        setIsInMiniApp(inMiniApp)
        
        if (inMiniApp && !user) {
          // Get capabilities to check if signIn is supported
          const capabilities = await sdk.getCapabilities()
          
          if (capabilities.includes('actions.signIn')) {
            // Generate a nonce (in production, this should come from your backend)
            const nonce = Math.random().toString(36).substring(2, 15)
            
            try {
              // Request sign-in
              const result = await sdk.actions.signIn({ 
                nonce,
                acceptAuthAddress: true
              })
              
              // Send to your backend for verification
              if (result) {
                const response = await fetch('/api/auth/farcaster-signin', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    message: result.message,
                    signature: result.signature
                  }),
                })
                
                if (response.ok) {
                  const data = await response.json()
                  // Use your existing auth system to log in the user
                  login(data.token)
                }
              }
            } catch (error) {
              console.error('Farcaster sign-in error:', error)
              // User rejected or other error
            }
          }
        }
      } catch (error) {
        console.error('Error checking Farcaster environment:', error)
        setIsInMiniApp(false)
      }
    }
    
    checkFarcaster()
  }, [user, login])

  // This component doesn't render anything, it just handles auth
  return null
}