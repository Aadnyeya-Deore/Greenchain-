import React, { useState } from 'react'
import {
  Search,
  PlusCircle,
  Coins,
  ExternalLink,
  Menu,
  Copy,
  Check,
  ChevronDown,
  Bell,
  Sparkles,
  ShieldAlert,
} from 'lucide-react'
import { MST_CHAIN_ID, MST_FAUCET, explorerAddress } from '../../config/chain'
import { shortAddress } from '../../lib/format'
import { useToast } from '../../context/ToastContext'

interface TopNavbarProps {
  onOpenMobileSidebar: () => void
  account?: string
  balance?: string
  wrongNetwork: boolean
  onSwitchNetwork: () => void
  onConnectClick: () => void
  onSubmitProjectClick: () => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
}

export function TopNavbar({
  onOpenMobileSidebar,
  account,
  balance,
  wrongNetwork,
  onSwitchNetwork,
  onConnectClick,
  onSubmitProjectClick,
  onSearch,
  searchPlaceholder = 'Search projects, tree records, transaction hashes…',
}: TopNavbarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [copied, setCopied] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const toast = useToast()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchValue)
    }
  }

  const copyAddress = async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      toast.success('Address copied to clipboard', shortAddress(account))
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info('Wallet Address', account)
    }
  }

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button
          className="mobile-hamburger-btn"
          onClick={onOpenMobileSidebar}
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form className="global-search-form" onSubmit={handleSearchSubmit}>
          <Search className="search-icon w-4 h-4" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              if (onSearch) onSearch(e.target.value)
            }}
            placeholder={searchPlaceholder}
            className="global-search-input"
          />
          {searchValue && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setSearchValue('')
                if (onSearch) onSearch('')
              }}
            >
              ×
            </button>
          )}
        </form>
      </div>

      <div className="top-navbar-right">
        {/* Network status pill / switch button */}
        {wrongNetwork ? (
          <button className="network-pill-warning" onClick={onSwitchNetwork}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Switch to MST Testnet</span>
          </button>
        ) : (
          <div className="network-pill">
            <span className="pulse-dot green" />
            <span className="network-pill-label">MST Testnet</span>
          </div>
        )}

        {/* Faucet Link */}
        <a
          href={MST_FAUCET}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-action-btn subtle"
          title="Get testnet tMSTC tokens"
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span className="desktop-only text-xs font-medium">Faucet</span>
          <ExternalLink className="w-3 h-3 opacity-60 desktop-only" />
        </a>

        {/* Submit Project Quick CTA */}
        <button className="nav-action-btn primary" onClick={onSubmitProjectClick}>
          <PlusCircle className="w-4 h-4" />
          <span className="font-semibold text-xs">Submit Project</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            className={`icon-button ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="notif-badge" />
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <span className="font-semibold text-sm text-white">Ledger Notifications</span>
                <span className="text-xs text-emerald-400 font-medium">Live Feed</span>
              </div>
              <div className="notifications-list">
                <div className="notification-item">
                  <div className="notif-icon bg-emerald-500/10 text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="notif-text">
                    <p className="notif-title">New project verified</p>
                    <p className="notif-desc">Western Ghats Restoration approved 5,000 credits</p>
                    <span className="notif-time">18m ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notif-icon bg-lime-500/10 text-lime-400">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div className="notif-text">
                    <p className="notif-title">Carbon credits retired</p>
                    <p className="notif-desc">1,500 kg CO₂e burned for flight offset</p>
                    <span className="notif-time">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Button / Connect Wallet */}
        {account ? (
          <div className="account-pill-group">
            {balance && (
              <span className="account-balance-chip desktop-only">
                {balance}
              </span>
            )}
            <button
              className="account-address-chip"
              onClick={copyAddress}
              title={`Click to copy: ${account}`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-white">{shortAddress(account)}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        ) : (
          <button className="connect-wallet-nav-btn" onClick={onConnectClick}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  )
}
