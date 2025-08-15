import { createConfig, http } from 'wagmi';
import { celo, celoAlfajores } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { farcasterMiniappConnector } from '@farcaster/miniapp-wagmi-connector';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const config = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    farcasterMiniappConnector(),
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [celoAlfajores.id]: http('https://alfajores-forno.celo-testnet.org'),
    [celo.id]: http('https://forno.celo.org'),
  },
});

export const CONTRACTS = {
  DIRECT_INVESTMENT: process.env.NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS as `0x${string}`,
  CUSD_TOKEN: process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS as `0x${string}`,
  BUSINESS_REGISTRY: process.env.NEXT_PUBLIC_BUSINESS_REGISTRY_ADDRESS as `0x${string}`,
};

export const CHAIN_ID = process.env.NODE_ENV === 'production' ? celo.id : celoAlfajores.id;