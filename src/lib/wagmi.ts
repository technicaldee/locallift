import { createConfig, http } from 'wagmi';
import { celo, celoAlfajores } from 'wagmi/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Create wagmi config
export const config = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Swipevest',
      appLogoUrl: 'https://swipevest.app/logo.png',
    }),
    ...(projectId ? [walletConnect({
      projectId,
      metadata: {
        name: 'Swipevest',
        description: 'Swipe. Invest. Earn.',
        url: 'https://swipevest.app',
        icons: ['https://swipevest.app/logo.png'],
      },
    })] : []),
  ],
  transports: {
    [celoAlfajores.id]: http(process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://alfajores-forno.celo-testnet.org'),
    [celo.id]: http('https://forno.celo.org'),
  },
});