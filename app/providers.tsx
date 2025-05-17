'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { metaMask, coinbaseWallet } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';
import { ModalProvider } from './providers/ModalProvider';

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({ 
      appName: 'Zenith',
      chainId: baseSepolia.id,
      jsonRpcUrl: 'https://sepolia.base.org',
    }),
  ],
});

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
        config={{
          appearance: {
            mode: 'auto',
            theme: 'dark',
          },
          analytics: false,
        }}
      >
        {props.children}
        <ModalProvider />
      </OnchainKitProvider>
    </WagmiProvider>
  );
}

