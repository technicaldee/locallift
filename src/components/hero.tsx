import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react"

export function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1683120859207-394049a3b46c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Invest in Your
            <span className="text-green-400 block">Local Community</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Support local businesses with micro-investments starting from just $1. 
            AI-powered risk assessment meets blockchain transparency on Celo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/invest" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <span>Start Investing</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/business" className="border border-gray-300 hover:border-gray-400 text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors text-center">
              List Your Business
            </a>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">AI Assessment</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze business risk and recommend optimal investment terms
              </p>
            </div>
            
            <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600">
                Transparent smart contracts on Celo ensure secure and automated transactions
              </p>
            </div>
            
            <div className="text-center bg-white bg-opacity-90 p-6 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Direct investment in local businesses creates jobs and strengthens communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}