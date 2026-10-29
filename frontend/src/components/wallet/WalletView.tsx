import React, { useState } from 'react'
import {
  Wallet,
  Coins,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Flame,
  Send,
  ShieldCheck,
  RefreshCw,
  Trees,
} from 'lucide-react'
import { shortAddress, formatNumber, formatCurrency } from '../../lib/format'
import { MST_CHAIN_ID, MST_FAUCET, explorerAddress } from '../../config/chain'
import { useProjects, useBalance1155 } from '../../hooks/useRegistry'
import { STATUS } from '../../lib/registry'
import { useToast } from '../../context/ToastContext'
import type { Address } from 'viem'

interface WalletViewProps {
  account?: string
  balance?: string
  onConnectClick: () => void
  onDisconnectClick: () => void
  onNavigateToCredits: () => void
}

export function WalletView({
  account,
  balance,
  onConnectClick,
  onDisconnectClick,
  onNavigateToCredits,
}: WalletViewProps) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const { projects } = useProjects()

  const copyAddress = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      toast.success('Address copied to clipboard', shortAddress(account))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info('Address', account)
    }
  }

  return (
    <div className="wallet-view">
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Web3 Carbon Portfolio & Wallet</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              MST Testnet
            </span>
          </div>
          <p className="dashboard-subtitle">
            Manage your tMSTC gas balance and your ERC-1155 Verified Tree Carbon Credit holdings.
          </p>
        </div>
      </div>

      {account ? (
        <div className="space-y-6">
          {/* Main Account Card */}
          <div className="dashboard-panel wallet-hero-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Connected Web3 Account
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-base md:text-lg font-bold text-white break-all">
                    {account}
                  </span>
                  <button className="copy-btn-inline" onClick={copyAddress} title="Copy Address">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="pulse-dot green small" /> MST Testnet (ID: {MST_CHAIN_ID})
                  </span>
                  <span>•</span>
                  <a
                    href={explorerAddress(account)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-slate-300 flex items-center gap-1"
                  >
                    View on MSTScan <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={MST_FAUCET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-subtle"
                >
                  <Coins className="w-4 h-4 mr-1 text-emerald-400" />
                  Get tMSTC
                </a>
                <button className="btn-outline-sm text-rose-400 border-rose-500/30 hover:bg-rose-950/20" onClick={onDisconnectClick}>
                  Disconnect
                </button>
              </div>
            </div>

            {/* Balances Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Native Gas Currency</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {balance || '0.00 tMSTC'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Used for signing Merkle datasets and on-chain transactions</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Carbon Credits Held</span>
                <div className="text-2xl font-bold font-mono text-white">
                  50,000 <span className="text-sm text-slate-400 font-normal">kg CO₂e</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Valid ERC-1155 certificates in your account</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="dashboard-panel">
              <h3 className="panel-title flex items-center gap-2">
                <Flame className="w-4 h-4 text-lime-400" />
                Retire Carbon Credits
              </h3>
              <p className="panel-subtitle">Burn credits to offset emissions and generate a certificate</p>
              <button className="btn-primary-action mt-4 w-full justify-center" onClick={onNavigateToCredits}>
                Open Credit Portfolio
              </button>
            </div>

            <div className="dashboard-panel">
              <h3 className="panel-title flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Transfer to Another Wallet
              </h3>
              <p className="panel-subtitle">Transfer verified credits to another address on MST Testnet</p>
              <button className="btn-secondary-subtle mt-4 w-full justify-center" onClick={onNavigateToCredits}>
                Select Credits to Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state-card py-16">
          <div className="empty-icon-circle">
            <Wallet className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="empty-title">Connect your Web3 Wallet</h3>
          <p className="empty-description max-w-md mx-auto">
            Connect using Google / Social Login or your browser wallet (MetaMask, Brave, WalletConnect) to view your token balances and carbon credits.
          </p>
          <button className="btn-primary-action mt-6" onClick={onConnectClick}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet Now
          </button>
        </div>
      )}
    </div>
  )
}
