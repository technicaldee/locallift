import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { celo, celoAlfajores } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Swipevest',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [celoAlfajores, celo],
  ssr: true,
});

export const CONTRACTS = {
  BUSINESS_REGISTRY: process.env.NEXT_PUBLIC_BUSINESS_REGISTRY_ADDRESS as `0x${string}`,
  INVESTMENT_POOL: process.env.NEXT_PUBLIC_INVESTMENT_POOL_ADDRESS as `0x${string}`,
  ESCROW_MANAGER: process.env.NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS as `0x${string}`,
  CUSD_TOKEN: process.env.NEXT_PUBLIC_CUSD_TOKEN_ADDRESS as `0x${string}`,
};