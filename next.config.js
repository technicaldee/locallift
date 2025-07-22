/** @type {import('next').NextConfig} */
const nextConfig = {
  //ignore typescript errors
  typescript: {
    ignoreBuildErrors: true,
  },
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
  },
  // Add headers for Farcaster Mini App
  async headers() {
    return [
      {
        source: '/.well-known/farcaster.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ]
  }
}

module.exports = nextConfig