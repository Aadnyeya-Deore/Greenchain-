import { useEffect, useState } from 'react'
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi'
import { MST_CHAIN_ID, MST_FAUCET, explorerAddress } from './config/chain'
import { REGISTRY_ADDRESS, isRegistryConfigured } from './lib/registry'
import { useRoles } from './hooks/useRegistry'
import { ToastProvider, useToast } from './context/ToastContext'
import { Sidebar, NavPage } from './components/layout/Sidebar'
import { TopNavbar } from './components/layout/TopNavbar'
import { LandingPage } from './components/landing/LandingPage'
import { DashboardView } from './components/dashboard/DashboardView'
import { MarketplaceView } from './components/marketplace/MarketplaceView'
import { ProjectsView } from './components/ProjectsView'
import { SubmitProject } from './components/SubmitProject'
import { TransactionsView } from './components/transactions/TransactionsView'
import { AnalyticsView } from './components/analytics/AnalyticsView'
import { WalletView } from './components/wallet/WalletView'
import { SettingsView } from './components/settings/SettingsView'
import { VerifierPanel } from './components/VerifierPanel'
import { AdminPanel } from './components/AdminPanel'
import { ConnectModal } from './components/common/ConnectModal'
import { MarketplaceItem, BlockchainTransaction } from './lib/mockData'
import type { Address } from 'viem'
import { ShieldAlert, ExternalLink, Power, AlertTriangle, ArrowRight } from 'lucide-react'

function AppContent() {
  const { address, isConnected, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: switching } = useSwitchChain()

  // Evaluator demo address allows previewing landowner or verifier mode instantly
  const [demoAddress, setDemoAddress] = useState<string | null>(null)
  const activeAddress = (demoAddress || address) as Address | undefined

  const roles = useRoles(activeAddress)
  const balance = useBalance({
    address: activeAddress,
    chainId: MST_CHAIN_ID,
    query: { enabled: !!activeAddress, refetchInterval: 15_000 },
  })

  const [page, setPage] = useState<NavPage>('landing')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [connectModalOpen, setConnectModalOpen] = useState(false)

  // Selection states for deep-link modals
  const [selectedMarketplaceItem, setSelectedMarketplaceItem] = useState<MarketplaceItem | null>(null)
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null)

  const wrongNetwork = isConnected && chainId !== MST_CHAIN_ID
  const locked = wrongNetwork || roles.paused

  const formattedBalance = balance.data
    ? `${Number(balance.data.formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${balance.data.symbol}`
    : undefined

  // Route to marketplace with preselected item
  const handleSelectMarketplaceProject = (item: MarketplaceItem) => {
    setSelectedMarketplaceItem(item)
    setPage('marketplace')
  }

  // Open modal for transaction
  const handleSelectTx = (tx: BlockchainTransaction) => {
    setSelectedTx(tx)
    setPage('transactions')
  }

  // Fall back to landing or dashboard if a protected tab stops being available
  useEffect(() => {
    if (page === 'verify' && activeAddress && !roles.isVerifier) {
      setPage('dashboard')
    }
    if (page === 'admin' && activeAddress && !roles.isAdmin) {
      setPage('dashboard')
    }
  }, [activeAddress, roles.isVerifier, roles.isAdmin, page])

  const handleDisconnect = () => {
    setDemoAddress(null)
    disconnect()
  }

  return (
    <div className="app-shell">
      {/* Sidebar Navigation (Visible on all pages except fullscreen landing, or accessible anytime) */}
      <Sidebar
        currentPage={page}
        onNavigate={(targetPage) => setPage(targetPage)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        account={activeAddress}
        isVerifier={roles.isVerifier}
        isAdmin={roles.isAdmin}
        isPaused={roles.paused}
        wrongNetwork={wrongNetwork}
        onConnectClick={() => setConnectModalOpen(true)}
        onDisconnectClick={handleDisconnect}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div className={`app-main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Navbar */}
        <TopNavbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          account={activeAddress}
          balance={formattedBalance}
          wrongNetwork={wrongNetwork}
          onSwitchNetwork={() => switchChain({ chainId: MST_CHAIN_ID })}
          onConnectClick={() => setConnectModalOpen(true)}
          onSubmitProjectClick={() => setPage('submit')}
          onSearch={(query) => {
            if (query.trim()) {
              if (page !== 'marketplace' && page !== 'credits' && page !== 'transactions') {
                setPage('marketplace')
              }
            }
          }}
        />

        {/* Global Warnings / Network Alerts */}
        <div className="app-alert-container">
          {wrongNetwork && (
            <div className="app-banner banner-warning" role="alert">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Your Web3 wallet is connected to an unsupported network. Switch to MST Testnet to submit transactions.</span>
              </div>
              <button
                className="btn-outline-sm text-amber-300 border-amber-400/40"
                disabled={switching}
                onClick={() => switchChain({ chainId: MST_CHAIN_ID })}
              >
                {switching ? 'Switching…' : 'Switch Network'}
              </button>
            </div>
          )}

          {roles.paused && (
            <div className="app-banner banner-danger" role="status">
              <div className="flex items-center gap-2">
                <Power className="w-5 h-5 text-rose-400 shrink-0" />
                <span>The Carbon Ledger registry contract is currently paused by admin. Writes are temporarily disabled.</span>
              </div>
            </div>
          )}

          {demoAddress && (
            <div className="app-banner banner-demo" role="status">
              <div className="flex items-center gap-2 text-xs">
                <span className="pulse-dot green small" />
                <span>
                  <strong>Evaluator Preview Mode:</strong> Active as {demoAddress.slice(0, 10)}…
                  {demoAddress.includes('3F5C') ? ' (Verifier Role)' : ' (Landowner Mode)'}
                </span>
              </div>
              <button
                className="btn-outline-sm text-xs py-1"
                onClick={() => setDemoAddress(null)}
              >
                Exit Demo
              </button>
            </div>
          )}
        </div>

        {/* Content View Router */}
        <main className="app-content-body">
          {page === 'landing' && (
            <LandingPage
              onExploreDashboard={() => setPage('dashboard')}
              onExploreMarketplace={() => setPage('marketplace')}
              onSelectProject={handleSelectMarketplaceProject}
              onConnectWallet={() => setConnectModalOpen(true)}
            />
          )}

          {page === 'dashboard' && (
            <DashboardView
              onNavigateToCredits={() => setPage('credits')}
              onNavigateToMarketplace={() => setPage('marketplace')}
              onNavigateToTransactions={() => setPage('transactions')}
              onSubmitProjectClick={() => setPage('submit')}
              onSelectTx={handleSelectTx}
              account={activeAddress}
            />
          )}

          {page === 'marketplace' && (
            <MarketplaceView
              account={activeAddress}
              locked={locked}
              selectedItem={selectedMarketplaceItem}
              onSelectItem={(item) => setSelectedMarketplaceItem(item)}
            />
          )}

          {page === 'credits' && activeAddress && (
            <ProjectsView
              account={activeAddress}
              locked={locked}
              onSubmitClick={() => setPage('submit')}
            />
          )}

          {page === 'credits' && !activeAddress && (
            <div className="empty-state-card py-16">
              <div className="empty-icon-circle">
                <ShieldAlert className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="empty-title">Connect Wallet to View Carbon Credits</h3>
              <p className="empty-description">
                Sign in with Google, MetaMask, or use Demo Mode to view and manage your verified credit holdings.
              </p>
              <button className="btn-primary-action mt-4" onClick={() => setConnectModalOpen(true)}>
                Connect Wallet
              </button>
            </div>
          )}

          {page === 'submit' && <SubmitProject locked={locked} />}

          {page === 'transactions' && (
            <TransactionsView
              selectedTx={selectedTx}
              onSelectTx={(tx) => setSelectedTx(tx)}
            />
          )}

          {page === 'analytics' && <AnalyticsView />}

          {page === 'wallet' && (
            <WalletView
              account={activeAddress}
              balance={formattedBalance}
              onConnectClick={() => setConnectModalOpen(true)}
              onDisconnectClick={handleDisconnect}
              onNavigateToCredits={() => setPage('credits')}
            />
          )}

          {page === 'settings' && <SettingsView />}

          {page === 'verify' && activeAddress && (
            <VerifierPanel account={activeAddress} locked={wrongNetwork} />
          )}

          {page === 'verify' && !activeAddress && (
            <div className="empty-state-card py-16">
              <h3 className="empty-title">Verifier Role Required</h3>
              <p className="empty-description">Connect an authorized verifier address or choose Verifier Demo Mode in the wallet dialog.</p>
              <button className="btn-primary-action mt-4" onClick={() => setConnectModalOpen(true)}>
                Connect Verifier Account
              </button>
            </div>
          )}

          {page === 'admin' && (
            <AdminPanel
              paused={roles.paused}
              creditsPerTree={roles.creditsPerTree}
              locked={wrongNetwork}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="app-global-footer">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>Carbon Ledger v2.0</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="pulse-dot green small" /> MST Testnet (Chain {MST_CHAIN_ID})
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isRegistryConfigured && (
                <a
                  href={explorerAddress(REGISTRY_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  Contract on MSTScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <a
                href={MST_FAUCET}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                Faucet <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Wallet Connect Modal */}
      <ConnectModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onSelectDemoWallet={(addr) => setDemoAddress(addr)}
        demoAddress={demoAddress}
      />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
