'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { UserProfile } from '@/lib/auth'

interface UserProfileProps {
  user: UserProfile | null
  onSignOut: () => void
}

export function UserProfileDropdown({ user, onSignOut }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { address } = useAccount()

  if (!user) return null
  
  const displayAddress = address || user.walletAddress

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border border-green-600 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">
            {displayAddress.slice(0, 6)}...{displayAddress.slice(-4)}
          </div>
          <div className="text-xs text-green-100 capitalize">
            {user.role.replace('_', ' ')}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">
              {displayAddress}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Role: {user.role.replace('_', ' ')}
            </div>
            <div className="text-xs text-gray-500">
              KYC Status: <span className={`capitalize ${
                user.kycStatus === 'verified' ? 'text-green-600' : 
                user.kycStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {user.kycStatus}
              </span>
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Open profile settings modal
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false)
                onSignOut()
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}