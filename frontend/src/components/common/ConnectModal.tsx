import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { hasAppKit } from '../../config/wagmi'
import { MST_CHAIN_ID, MST_FAUCET } from '../../config/chain'
import { shortAddress } from '../../lib/format'
import {
  X,
  Wallet,
  Shield,
  ExternalLink,
  Check,
  Sparkles,
  KeyRound,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDemoWallet?: (address: string) => void
  demoAddress?: string | null
}

function AppKitOption({ onClose }: { onClose: () => void }) {
  const { open } = useAppKit()
  return (
    <div className="connect-group">
      <label className="connect-group-label">Social & Web3 Modal</label>
      <button
        className="connect-option-btn primary-highlight"
        onClick={() => {
          onClose()
          open({ view: 'Connect' })
        }}
      >
        <div className="flex items-center gap-3">
          <div className="provider-icon google-icon">G</div>
          <div className="text-left">
            <div className="wallet-name">Google & Social Login</div>
            <div className="wallet-desc">Instant embedded wallet via email</div>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  )
}

export function ConnectModal({ isOpen, onClose, onSelectDemoWallet, demoAddress }: ConnectModalProps) {
  const { isConnected, address } = useAccount()
  const { connectors, connect, isPending, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  const [hasInjectedProvider, setHasInjectedProvider] = useState(false)
  const [hasBridgeKeyProvider, setHasBridgeKeyProvider] = useState(false)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as any
      const hasEth = Boolean(win.ethereum)
      const hasBk = Boolean(win.bridgekey || (win.ethereum && win.ethereum.isBridgeKey))
      setHasInjectedProvider(hasEth || hasBk)
      setHasBridgeKeyProvider(hasBk)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConnectBridgeKey = async () => {
    // Look for connector specifically named BridgeKey or the first injected connector
    const bridgeKeyConnector = connectors.find((c) => c.name.toLowerCase().includes('bridgekey')) || connectors[0]
    
    if (typeof window !== 'undefined' && !hasInjectedProvider) {
      setShowInstallGuide(true)
      return
    }

    try {
      if (bridgeKeyConnector) {
        await connect({ connector: bridgeKeyConnector, chainId: MST_CHAIN_ID })
        onClose()
      }
    } catch (err) {
      console.error('BridgeKey connection error:', err)
      setShowInstallGuide(true)
    }
  }

  const handleInjectedConnect = async (connector: any) => {
    try {
      await connect({ connector, chainId: MST_CHAIN_ID })
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDemoSelect = (addr: string) => {
    if (onSelectDemoWallet) {
      onSelectDemoWallet(addr)
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="modal-header-icon">
              <KeyRound className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="modal-title">Connect Wallet</h3>
              <p className="modal-subtitle">BridgeKey, MetaMask, or Evaluator Demo Mode</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          {isConnected && address && (
            <div className="connected-alert">
              <div className="flex items-center gap-2">
                <span className="pulse-dot green" />
                <span className="connected-address-text">
                  Connected: <strong>{shortAddress(address)}</strong>
                </span>
              </div>
              <button
                className="btn-outline-sm disconnect-btn"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Primary Option: BridgeKey Wallet (MST Ecosystem Native) */}
          <div className="connect-group">
            <div className="flex items-center justify-between mb-2">
              <label className="connect-group-label mb-0">MST Native Wallet</label>
              <span className="badge-recommended">Recommended</span>
            </div>

            <button
              className="connect-option-btn bridgekey-highlight"
              disabled={isPending}
              onClick={handleConnectBridgeKey}
            >
              <div className="flex items-center gap-3">
                <div className="provider-icon bridgekey-icon">
                  <KeyRound className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="wallet-name flex items-center gap-1.5">
                    <span>BridgeKey Wallet</span>
                    {hasBridgeKeyProvider && (
                      <span className="badge-detected">Detected</span>
                    )}
                  </div>
                  <div className="wallet-desc">
                    Official MST Blockchain Wallet (Testnet Chain ID: {MST_CHAIN_ID})
                  </div>
                </div>
              </div>
              {isPending ? (
                <span className="text-xs text-emerald-400 font-medium">Connecting…</span>
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            {showInstallGuide && !hasInjectedProvider && (
              <div className="install-notice-box">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-white mb-1">BridgeKey Extension Not Detected in this Browser</p>
                    <p className="mb-2">
                      To connect your real BridgeKey wallet on MST Testnet:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-300">
                      <li>Install the <strong>BridgeKey Wallet</strong> extension in Chrome/Brave.</li>
                      <li>Or select <strong>Auditor & Evaluator Demo Mode</strong> below to test all features instantly!</li>
                    </ol>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://mstblockchain.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <Download className="w-3 h-3" /> Get BridgeKey
                      </a>
                      <button
                        className="text-slate-400 hover:text-white"
                        onClick={() => setShowInstallGuide(false)}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Option: Other Browser / Injected Wallets */}
          <div className="connect-group">
            <label className="connect-group-label">Browser & Injected Web3</label>
            <div className="connect-options-grid">
              {connectors
                .filter((c) => !c.name.toLowerCase().includes('bridgekey'))
                .map((connector) => (
                  <button
                    key={connector.id}
                    className="connect-option-btn"
                    disabled={isPending}
                    onClick={() => handleInjectedConnect(connector)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="provider-icon wallet-icon">🦊</div>
                      <div className="text-left">
                        <div className="wallet-name">{connector.name}</div>
                        <div className="wallet-desc">Browser extension (MetaMask, Brave)</div>
                      </div>
                    </div>
                    {isPending ? (
                      <span className="text-xs text-emerald-400">Connecting…</span>
                    ) : (
                      <Check className="w-4 h-4 opacity-0 group-hover:opacity-100 text-slate-400" />
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Reown AppKit Social Option (if configured) */}
          {hasAppKit && <AppKitOption onClose={onClose} />}

          {/* Tertiary Option: Auditor & Evaluator Demo Mode (Instant Preview) */}
          <div className="connect-group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="connect-group-label mb-0">Evaluator & Auditor Demo Mode</label>
              <span className="badge-demo">Instant Preview</span>
            </div>
            <p className="wallet-desc mb-2">
              Explore all landowner submission, verifier audit, and admin workflows immediately.
            </p>
            <div className="demo-accounts-grid">
              <button
                className={`demo-account-btn ${demoAddress === '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' ? 'selected' : ''}`}
                onClick={() => handleDemoSelect('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')}
              >
                <div>
                  <div className="demo-role-title">Project Landowner</div>
                  <div className="demo-role-address">0x742d…f44e (Has credits)</div>
                </div>
                <span className="demo-select-tag">Select Account</span>
              </button>

              <button
                className={`demo-account-btn ${demoAddress === '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE' ? 'selected' : ''}`}
                onClick={() => handleDemoSelect('0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE')}
              >
                <div>
                  <div className="demo-role-title">Certified Verifier Node</div>
                  <div className="demo-role-address">0x3F5C…f0bE (Verifier Role)</div>
                </div>
                <span className="demo-select-tag">Select Account</span>
              </button>
            </div>
          </div>

          {/* Modal Footer info */}
          <div className="modal-footer-info">
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Target Network: <strong>MST Testnet</strong> (Chain ID {MST_CHAIN_ID}, RPC: testnetrpc.mstblockchain.com). Need testnet gas?{' '}
                <a
                  href={MST_FAUCET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-0.5 font-medium"
                >
                  Get free tMSTC <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
