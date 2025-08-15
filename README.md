# Swipevest 💰

**Swipe. Invest. Earn.** - A revolutionary investment platform for local businesses built with Next.js, Firebase, and Celo blockchain.

![Swipevest Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=Swipevest+-+Swipe.+Invest.+Earn.)

## 🚀 Features

### Core Functionality
- **Swipe-to-Invest**: Tinder-like interface for discovering and investing in local businesses
- **Direct Payments**: Instant cUSD transfers to business wallets via smart contracts
- **Real-time Tracking**: Live investment history and portfolio management
- **Farcaster Integration**: Optimized for Farcaster frames and miniapps
- **Mobile-First**: PWA-ready with smooth animations and gestures

### Business Features
- **Business Registration**: Easy onboarding with wallet integration
- **Goal Setting**: Customizable funding targets and return percentages
- **Verification System**: Community-driven business verification
- **Analytics Dashboard**: Track investments and manage business profiles

### Investment Features
- **Smart Contracts**: Secure, transparent transactions on Celo blockchain
- **Flexible Amounts**: Invest from $1 to $100 per swipe
- **Portfolio Tracking**: Complete investment history with ROI calculations
- **Risk Management**: Customizable investment settings and limits

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and gestures
- **Radix UI** - Accessible component primitives

### Backend & Database
- **Firebase Firestore** - Real-time database
- **Firebase Storage** - File uploads and media
- **Firebase Auth** - User authentication

### Blockchain
- **Celo Network** - Carbon-negative blockchain
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **cUSD** - Stable cryptocurrency for payments

### Deployment
- **Vercel** - Serverless deployment platform
- **Hardhat** - Smart contract development

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase      │    │   Celo Chain    │
│   (Next.js)     │◄──►│   (Database)    │    │   (Payments)    │
│                 │    │                 │    │                 │
│ • Swipe UI      │    │ • Business Data │    │ • Smart Contract│
│ • Wallet Connect│    │ • User Profiles │    │ • cUSD Transfers│
│ • Farcaster     │    │ • Investments   │    │ • Transaction   │
│   Integration   │    │ • Media Storage │    │   History       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- A Celo wallet (like Valora or MetaMask)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swipevest.git
   cd swipevest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Wallet Connect
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

   # Celo Network
   NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
   NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
   NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS=your_deployed_contract_address

   # Contract Deployment
   PRIVATE_KEY=your_private_key_for_deployment
   ```

4. **Deploy smart contracts**
   ```bash
   npm run compile
   npm run deploy
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Farcaster Integration

Swipevest is optimized for Farcaster frames and miniapps:

### Frame Meta Tags
```html
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://swipevest.app/frame-image.png" />
<meta property="fc:frame:button:1" content="Start Investing" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://swipevest.app" />
```

### Miniapp Features
- Automatic user detection from Farcaster context
- Optimized mobile interface
- Social sharing integration
- Frame-compatible routing

## 🔧 Smart Contract Development

### Contract Structure
```solidity
contract DirectInvestment {
    // Direct investment functionality
    function invest(string businessId, uint256 amount) external;
    
    // Business registration
    function registerBusiness(string businessId, address wallet, uint256 goal) external;
    
    // Investment tracking
    function getInvestorHistory(address investor) external view returns (Investment[]);
}
```

### Deployment Commands
```bash
# Compile contracts
npm run compile

# Deploy to Alfajores testnet
npm run deploy

# Deploy to Celo mainnet
npm run deploy:mainnet

# Verify contracts
npm run verify
```

## 🎨 UI Components

### Swipe Card Component
```tsx
<SwipeCard
  business={business}
  onSwipe={(direction, business) => handleSwipe(direction, business)}
  onVerify={(business) => handleVerify(business)}
  onComment={(business) => handleComment(business)}
  isInvesting={investing}
/>
```

### Investment Flow
1. User swipes right on a business
2. Wallet connection check
3. cUSD balance and allowance verification
4. Smart contract interaction
5. Transaction confirmation
6. Firebase record update

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add all environment variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📊 Analytics & Monitoring

### Key Metrics
- Total investments processed
- Active businesses
- User engagement rates
- Transaction success rates
- Average investment amounts

### Monitoring Tools
- Vercel Analytics for performance
- Firebase Analytics for user behavior
- Celo Explorer for blockchain transactions

## 🔒 Security

### Smart Contract Security
- ReentrancyGuard protection
- Access control mechanisms
- Input validation
- Emergency pause functionality

### Frontend Security
- Environment variable protection
- Input sanitization
- XSS prevention
- CSRF protection

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.swipevest.app](https://docs.swipevest.app)
- **Discord**: [Join our community](https://discord.gg/swipevest)
- **Twitter**: [@swipevest](https://twitter.com/swipevest)
- **Email**: support@swipevest.app

## 🙏 Acknowledgments

- [Celo Foundation](https://celo.org) for the carbon-negative blockchain
- [Farcaster](https://farcaster.xyz) for the decentralized social protocol
- [Vercel](https://vercel.com) for the deployment platform
- [Firebase](https://firebase.google.com) for the backend infrastructure

---

**Built with ❤️ for the future of community-driven investing**