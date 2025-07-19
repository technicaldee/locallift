'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuthState } from '@/hooks/use-auth'
import { UserProfile } from '@/lib/auth'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  signIn: (token: string) => void
  signOut: () => void
  updateUser: (updates: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthState()
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}