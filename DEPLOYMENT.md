# Deployment Guide

## Prerequisites

1. **Celo Wallet Setup**
   - Install Celo Wallet or MetaMask with Celo network
   - Get Alfajores testnet tokens from [Celo Faucet](https://faucet.celo.org/)
   - Export your private key (keep it secure!)

2. **Environment Configuration**
   - Copy `.env.local` and update with your values
   - Add your private key to `PRIVATE_KEY` variable
   - Never commit your private key to version control

## Deployment Steps

### 1. Compile Contracts
```bash
yarn compile
```

### 2. Deploy to Alfajores Testnet
```bash
yarn deploy
```

### 3. Verify Contracts (Optional)
```bash
yarn verify
```

### 4. Update Frontend Configuration
After deployment, update your `.env.local` with the deployed contract addresses:
```
NEXT_PUBLIC_BUSINESS_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_INVESTMENT_POOL_ADDRESS=0x...
NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=0x...
```

## Local Development

For local development without deploying to testnet:

### 1. Start Local Hardhat Network
```bash
npx hardhat node
```

### 2. Deploy to Local Network
```bash
yarn deploy:local
```

## Security Notes

- **Never commit private keys to version control**
- Use environment variables for sensitive data
- Consider using a hardware wallet for mainnet deployments
- Test thoroughly on testnet before mainnet deployment

## Troubleshooting

### Common Issues

1. **Insufficient Funds**
   - Get more testnet tokens from Celo faucet
   - Check your wallet balance

2. **Network Connection**
   - Verify RPC URL is correct
   - Check internet connection

3. **Gas Estimation Errors**
   - Increase gas limit in deployment script
   - Check contract size limits

4. **Compilation Errors**
   - Ensure Solidity version compatibility
   - Check OpenZeppelin version matches

### Getting Help

- Check Hardhat documentation
- Visit Celo developer resources
- Create an issue in the repository

## Contract Addresses

After successful deployment, your contract addresses will be saved to `deployment-addresses.json`.

### Alfajores Testnet
- BusinessRegistry: `[To be deployed]`
- InvestmentPool: `[To be deployed]`
- EscrowManager: `[To be deployed]`

### Mainnet
- BusinessRegistry: `[Not deployed]`
- InvestmentPool: `[Not deployed]`
- EscrowManager: `[Not deployed]`