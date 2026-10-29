import React from 'react'
import {
  LayoutDashboard,
  Trees,
  ShoppingBag,
  ArrowLeftRight,
  LineChart,
  Wallet,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Compass,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ExternalLink,
  LogOut,
  Power,
} from 'lucide-react'
import { MST_CHAIN_ID, MST_EXPLORER, explorerAddress } from '../../config/chain'
import { shortAddress } from '../../lib/format'

export type NavPage =
  | 'landing'
  | 'dashboard'
  | 'credits'
  | 'marketplace'
  | 'transactions'
  | 'analytics'
  | 'wallet'
  | 'settings'
  | 'verify'
  | 'admin'
  | 'submit'

interface SidebarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
  collapsed: boolean
  onToggleCollapse: () => void
  account?: string
  isVerifier: boolean
  isAdmin: boolean
  isPaused: boolean
  wrongNetwork: boolean
  onConnectClick: () => void
  onDisconnectClick: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  account,
  isVerifier,
  isAdmin,
  isPaused,
  wrongNetwork,
  onConnectClick,
  onDisconnectClick,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const mainNavItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" />, badge: 'Live' },
    { id: 'credits', label: 'Carbon Credits', icon: <Trees className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <LineChart className="w-5 h-5" /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ]

  const governanceNavItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'verify',
      label: 'Verifier Desk',
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: isVerifier ? 'Active' : undefined,
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: isAdmin ? 'Super' : undefined,
    },
  ]

  const handleNav = (page: NavPage) => {
    onNavigate(page)
    onCloseMobile()
  }

  return (
    <>
      {mobileOpen && <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-brand">
          <button className="brand-button" onClick={() => handleNav('landing')}>
            <div className="brand-logo-hex">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            {!collapsed && (
              <div className="brand-text">
                <span className="brand-title">Carbon<span className="text-emerald-400">Ledger</span></span>
                <span className="brand-tag">Web3 Registry</span>
              </div>
            )}
          </button>
          <button
            className="sidebar-collapse-toggle desktop-only"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation scroll container */}
        <div className="sidebar-scroll">
          {/* Quick Landing Page link */}
          <div className="sidebar-section">
            <button
              className={`sidebar-nav-item ${currentPage === 'landing' ? 'active' : ''}`}
              onClick={() => handleNav('landing')}
              title={collapsed ? 'Landing Page' : undefined}
            >
              <span className="nav-item-icon">
                <Compass className="w-5 h-5" />
              </span>
              {!collapsed && <span className="nav-item-label">Home & Overview</span>}
            </button>
          </div>

          {/* Main App Navigation */}
          <div className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">PLATFORM</div>}
            <nav className="sidebar-nav">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-item-label">{item.label}</span>
                      {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Verification & Admin (Always accessible or prominent if authorized) */}
          <div className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">GOVERNANCE</div>}
            <nav className="sidebar-nav">
              {governanceNavItems.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNav(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-item-label">{item.label}</span>
                      {item.badge && <span className="nav-item-badge green">{item.badge}</span>}
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Network & Account Footer */}
        <div className="sidebar-footer">
          {isPaused && (
            <div className={`paused-status-badge ${collapsed ? 'icon-only' : ''}`} title="Contract is paused by administrator">
              <Power className="w-3.5 h-3.5 text-amber-400" />
              {!collapsed && <span>Registry Paused</span>}
            </div>
          )}

          <div className="network-status-indicator">
            <span className={`pulse-dot ${wrongNetwork ? 'warn' : 'green'}`} />
            {!collapsed && (
              <div className="network-info">
                <span className="network-name">MST Testnet</span>
                <span className="network-chain">ID: {MST_CHAIN_ID}</span>
              </div>
            )}
          </div>

          {account ? (
            <div className={`sidebar-account-box ${collapsed ? 'collapsed' : ''}`}>
              {!collapsed ? (
                <>
                  <div className="account-details">
                    <span className="account-role-label">Connected Wallet</span>
                    <a
                      href={explorerAddress(account)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="account-address-link"
                      title={account}
                    >
                      {shortAddress(account)}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <button
                    className="account-signout-btn"
                    onClick={onDisconnectClick}
                    title="Disconnect Wallet"
                    aria-label="Disconnect wallet"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  className="account-signout-btn center"
                  onClick={onDisconnectClick}
                  title={`Disconnect ${shortAddress(account)}`}
                  aria-label="Disconnect wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              className={`sidebar-connect-btn ${collapsed ? 'icon-only' : ''}`}
              onClick={onConnectClick}
              title="Connect Web3 Wallet"
            >
              <Wallet className="w-4 h-4" />
              {!collapsed && <span>Connect Wallet</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
