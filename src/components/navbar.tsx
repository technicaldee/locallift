'use client'

import { WalletConnection } from './wallet-connection'

export function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LL</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LocalLift</h1>
            </a>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/invest" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Invest
              </a>
              <a href="/portfolio" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Portfolio
              </a>
              <a href="/business" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                For Business
              </a>
            </div>
          </div>
          <WalletConnection />
        </nav>
      </div>
    </header>
  )
}