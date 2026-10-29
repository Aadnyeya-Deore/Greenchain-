import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { createConfig, http, injected } from 'wagmi'
import { mstTestnet, MST_CHAIN_ID } from './chain'

export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID?.trim() || ''
const rpc = import.meta.env.VITE_MST_RPC_URL || 'https://testnetrpc.mstblockchain.com'

/**
 * Dedicated BridgeKey wallet connector for the MST Blockchain ecosystem.
 * Targets window.bridgekey or fallback to window.ethereum.
 */
export const bridgeKeyConnector = injected({
  target() {
    return {
      id: 'bridgekey',
      name: 'BridgeKey Wallet',
      provider(window) {
        if (typeof window === 'undefined') return undefined
        return (window as any).bridgekey || (window as any).ethereum
      },
    }
  },
})

export const genericInjectedConnector = injected()

export const defaultConnectors = [bridgeKeyConnector, genericInjectedConnector]

/**
 * Wallet + social login setup.
 * Uses Reown AppKit when a project ID is present, and falls back to standard
 * Wagmi injected/browser connectors (including BridgeKey) so the application is always fully interactive.
 */
export const wagmiAdapter = projectId
  ? new WagmiAdapter({ networks: [mstTestnet], projectId, ssr: false })
  : null

if (wagmiAdapter && projectId) {
  try {
    createAppKit({
      adapters: [wagmiAdapter],
      networks: [mstTestnet],
      defaultNetwork: mstTestnet,
      projectId,
      metadata: {
        name: 'CarbonLedger',
        description: 'Verified tree carbon credits on MST Testnet',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://carbonledger.mst',
        icons: ['https://testnet.mstscan.com/favicon.ico'],
      },
      features: { email: true, socials: ['google'], emailShowWallets: true, analytics: false },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#10b981',
        '--w3m-color-mix': '#0a120e',
        '--w3m-border-radius-master': '8px',
      },
    })
  } catch (err) {
    console.warn('AppKit init notice:', err)
  }
}

export const fallbackWagmiConfig = createConfig({
  chains: [mstTestnet as any],
  transports: { [MST_CHAIN_ID]: http(rpc) },
  connectors: defaultConnectors,
})

export const activeWagmiConfig = wagmiAdapter?.wagmiConfig ?? fallbackWagmiConfig
export const hasAppKit = Boolean(wagmiAdapter && projectId)
