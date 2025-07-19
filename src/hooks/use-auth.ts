'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { UserProfile } from '@/lib/auth'

export function useAuthState() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Load user from localStorage on mount
  useEffect(() => {
    // Add a small delay to ensure localStorage is available
    const initAuth = () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        fetchUserProfile(token)
      } else {
        setIsLoading(false)
      }
    }
    
    // Use setTimeout to ensure this runs after hydration
    setTimeout(initAuth, 100)
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        console.log('User profile loaded:', userData)
      } else {
        console.log('Failed to fetch profile, removing token')
        localStorage.removeItem('auth_token')
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
    disconnect()
  }, [disconnect])

  const signIn = (token: string) => {
    try {
      localStorage.setItem('auth_token', token)
      fetchUserProfile(token)
    } catch (error) {
      console.error('Failed to save auth token:', error)
    }
  }

  // Clear user when wallet disconnects
  useEffect(() => {
    if (!isConnected && user) {
      signOut()
    }
  }, [isConnected, user, signOut])

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  return {
    user,
    isLoading,
    signIn,
    signOut,
    updateUser
  }
}