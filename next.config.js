/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle node modules that need to be polyfilled for the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Handle WalletConnect and other wallet libraries
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    
    return config
  },
  // Disable static optimization for pages that use wallet connections
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig