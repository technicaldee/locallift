# LocalLift Platform

A decentralized platform for local business investment using Celo blockchain and Firebase.

## Features

- **Business Registration**: Local businesses can register and get verified
- **Investment Opportunities**: Browse and invest in local businesses
- **Smart Contracts**: Secure investment pools with milestone-based fund release
- **Portfolio Management**: Track your investments and returns
- **Risk Assessment**: AI-powered risk analysis for investment decisions

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Celo (Alfajores Testnet), Solidity, Hardhat
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Wallet-based auth with Firebase
- **UI Components**: Composer Kit UI

## Setup Instructions

### Prerequisites

- Node.js 18+ and yarn
- A Celo wallet with Alfajores testnet tokens
- Firebase project setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd locallift-platform
yarn install
```

### 2. Environment Setup

Copy `.env.local` and update with your values:

```bash
cp .env.local.example .env.local
```

Update the following variables:
- Firebase configuration
- Private key for contract deployment
- JWT secret for authentication

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Storage
4. Enable Authentication
5. Update Firebase config in `.env.local`

### 4. Smart Contract Deployment

Compile contracts:
```bash
yarn compile
```

Deploy to Celo Alfajores:
```bash
yarn deploy
```

Update `.env.local` with the deployed contract addresses.

Verify contracts (optional):
```bash
yarn verify
```

### 5. Run the Application

```bash
yarn dev
```

Visit http://localhost:3000

## Project Structure

```
locallift-platform/
├── contracts/                 # Solidity smart contracts
│   ├── BusinessRegistry.sol
│   ├── InvestmentPool.sol
│   └── EscrowManager.sol
├── src/
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── lib/                  # Utilities and configurations
│   ├── services/             # Firebase and blockchain services
│   └── hooks/                # Custom React hooks
├── scripts/                  # Deployment scripts
└── public/                   # Static assets
```

## Smart Contracts

### BusinessRegistry
- Register and verify local businesses
- Store business metadata and verification status
- Track business statistics

### InvestmentPool
- Create investment pools for businesses
- Handle investments and fund distribution
- Manage milestone-based fund release
- Process repayments to investors

### EscrowManager
- Secure escrow for transactions
- Release funds based on conditions
- Handle disputes and refunds

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Wallet-based authentication
- `GET /api/auth/profile` - Get user profile

### Business Management
- `POST /api/businesses/register` - Register a business
- `GET /api/businesses/my-businesses` - Get user's businesses

### Investment
- `GET /api/investment/opportunities` - Get investment opportunities
- `POST /api/investment/invest` - Make an investment
- `GET /api/portfolio/stats` - Get portfolio statistics
- `GET /api/portfolio/investments` - Get user's investments

### Funding Requests
- `POST /api/funding-requests/create` - Create funding request
- `GET /api/funding-requests/my-requests` - Get user's funding requests

## Firebase Collections

### users
- User profiles and authentication data

### businesses
- Business registration and verification data
- Document URLs and metadata

### fundingRequests
- Business funding requests
- Target amounts and terms

### investments
- Investment records
- Transaction hashes and amounts

### riskAssessments
- AI-generated risk assessments
- Risk scores and factors

## Development

### Adding New Features

1. Update smart contracts if needed
2. Create/update Firebase services
3. Add API routes
4. Create/update React components
5. Update types and interfaces

### Testing

```bash
# Run tests (when implemented)
yarn test

# Test smart contracts
npx hardhat test
```

### Deployment

1. Deploy smart contracts to mainnet
2. Update environment variables
3. Deploy frontend to Vercel/Netlify
4. Configure Firebase for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## Roadmap

- [ ] Mobile app development
- [ ] Advanced risk assessment models
- [ ] Multi-language support
- [ ] Integration with more blockchains
- [ ] Advanced analytics dashboard
- [ ] Community governance features