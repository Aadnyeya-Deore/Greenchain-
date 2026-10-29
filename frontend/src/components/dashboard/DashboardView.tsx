import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Trees,
  Flame,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  ArrowLeftRight,
  Leaf,
  Layers,
  Globe2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Filter,
  Car,
  Droplets,
  Sparkles,
} from 'lucide-react'
import {
  PLATFORM_STATS,
  MONTHLY_ACTIVITY_DATA,
  CATEGORY_DISTRIBUTION,
  SAMPLE_TRANSACTIONS,
  BlockchainTransaction,
} from '../../lib/mockData'
import { formatNumber, formatTons, formatRelativeTime, shortHash, shortAddress } from '../../lib/format'
import { MST_EXPLORER, explorerAddress, explorerTx } from '../../config/chain'
import { useProjects } from '../../hooks/useRegistry'
import { STATUS, type ProjectWithId } from '../../lib/registry'
import { useToast } from '../../context/ToastContext'

interface DashboardViewProps {
  onNavigateToCredits: () => void
  onNavigateToMarketplace: () => void
  onNavigateToTransactions: () => void
  onSubmitProjectClick: () => void
  onSelectTx: (tx: BlockchainTransaction) => void
  account?: string
}

export function DashboardView({
  onNavigateToCredits,
  onNavigateToMarketplace,
  onNavigateToTransactions,
  onSubmitProjectClick,
  onSelectTx,
  account,
}: DashboardViewProps) {
  const { projects, total: onChainCount, isLoading: loadingOnChain } = useProjects()
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const toast = useToast()

  // Blend on-chain data if available
  const onChainIssued = projects.reduce((acc, p) => acc + (p.status >= STATUS.Verified ? Number(p.creditsIssued) : 0), 0)
  const onChainTrees = projects.reduce((acc, p) => acc + Number(p.submittedTreeCount), 0)
  const verifiedProjectsCount = projects.filter((p) => p.status === STATUS.Verified).length

  const totalCredits = onChainIssued > 0 ? onChainIssued : PLATFORM_STATS.totalCarbonCredits
  const creditsRetired = PLATFORM_STATS.creditsRetired
  const co2OffsetTons = (creditsRetired / 1000).toFixed(1)
  const txCount = onChainCount > 0 ? PLATFORM_STATS.blockchainTxCount + onChainCount : PLATFORM_STATS.blockchainTxCount

  const handleCopyHash = async (hash: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      toast.success('Transaction hash copied', shortHash(hash))
      setTimeout(() => setCopiedHash(null), 1800)
    } catch {
      toast.info('Transaction Hash', hash)
    }
  }

  // Interactive activity chart calculation
  const maxVolume = Math.max(...MONTHLY_ACTIVITY_DATA.map((d) => d.volume))

  return (
    <div className="dashboard-view">
      {/* Dashboard Top Header */}
      <div className="dashboard-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Executive Climate Dashboard</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Live Sync
            </span>
          </div>
          <p className="dashboard-subtitle">
            Real-time telemetry of verified tree planting, Merkle proof registries, and on-chain credit retirement.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button className="btn-secondary-subtle" onClick={onNavigateToMarketplace}>
            Marketplace
          </button>
          <button className="btn-primary-action" onClick={onSubmitProjectClick}>
            <Trees className="w-4 h-4 mr-1.5" />
            Submit Tree Dataset
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Total Carbon Credits */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Carbon Credits</span>
            <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{formatNumber(totalCredits)}</span>
            <span className="kpi-unit">kg CO₂e</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +18.4%
            </span>
            <span className="kpi-context">vs previous quarter</span>
          </div>
        </div>

        {/* KPI 2: Credits Issued */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Credits Issued</span>
            <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">
              {formatNumber(onChainIssued > 0 ? onChainIssued : PLATFORM_STATS.creditsIssued)}
            </span>
            <span className="kpi-unit">kg CO₂e</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-badge-pill green">
              {verifiedProjectsCount > 0 ? `${verifiedProjectsCount} verified on-chain` : '18 verified projects'}
            </span>
          </div>
        </div>

        {/* KPI 3: Credits Retired */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Credits Retired</span>
            <div className="kpi-icon-box bg-lime-500/10 text-lime-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{formatNumber(creditsRetired)}</span>
            <span className="kpi-unit">kg CO₂e</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              100% Permanently Burned
            </span>
          </div>
        </div>

        {/* KPI 4: Total CO2 Offset */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total CO₂ Offset</span>
            <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{co2OffsetTons}</span>
            <span className="kpi-unit">Tonnes CO₂</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-context">Equivalent to {PLATFORM_STATS.carsOffsetEquivalent} cars off the road</span>
          </div>
        </div>

        {/* KPI 5: Blockchain Tx Count */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Transactions Recorded</span>
            <div className="kpi-icon-box bg-slate-800 text-slate-300">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{formatNumber(txCount)}</span>
            <span className="kpi-unit">Tx</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-context">MST Testnet Block Height: ~4,892,100</span>
          </div>
        </div>

        {/* KPI 6: Active Projects */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Active Registry Projects</span>
            <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{Math.max(onChainCount, PLATFORM_STATS.activeProjectsCount)}</span>
            <span className="kpi-unit">Projects</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-badge-pill">
              {onChainTrees > 0 ? `${formatNumber(onChainTrees)} trees tagged` : '34,700 trees tagged'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Activity */}
      <div className="dashboard-charts-grid">
        {/* Left Column: Interactive Carbon Activity Graph */}
        <div className="dashboard-panel chart-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Carbon Credit Activity & Issuance Volume</h3>
              <p className="panel-subtitle">Monthly breakdown of minted credits vs. permanent retirements (kg CO₂e)</p>
            </div>

            <div className="time-toggle-group">
              {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map((r) => (
                <button
                  key={r}
                  className={`time-toggle-btn ${timeRange === r ? 'active' : ''}`}
                  onClick={() => setTimeRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="activity-chart-wrapper">
            <div className="chart-legend-row">
              <div className="legend-item">
                <span className="legend-swatch bg-emerald-500" />
                <span>Credits Minted</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch bg-lime-400" />
                <span>Credits Retired</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch border-dashed" />
                <span>Total Volume</span>
              </div>
            </div>

            <div className="activity-chart-bars">
              {MONTHLY_ACTIVITY_DATA.map((item, idx) => {
                const mintedHeight = Math.round((item.minted / maxVolume) * 100)
                const retiredHeight = Math.round((item.retired / maxVolume) * 100)

                return (
                  <div key={item.month} className="chart-col-group">
                    <div className="chart-bars-container">
                      {/* Minted bar */}
                      <div
                        className="chart-bar minted"
                        style={{ height: `${mintedHeight}%` }}
                        title={`${item.month}: ${formatNumber(item.minted)} kg minted`}
                      >
                        <span className="bar-tooltip">{formatNumber(item.minted)}</span>
                      </div>
                      {/* Retired bar */}
                      <div
                        className="chart-bar retired"
                        style={{ height: `${retiredHeight}%` }}
                        title={`${item.month}: ${formatNumber(item.retired)} kg retired`}
                      >
                        <span className="bar-tooltip">{formatNumber(item.retired)}</span>
                      </div>
                    </div>
                    <span className="chart-col-label">{item.month}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel-bottom-stats">
            <div className="bottom-stat">
              <span className="stat-sub">Monthly Issuance Growth</span>
              <span className="stat-val text-emerald-400">+42.8%</span>
            </div>
            <div className="bottom-stat">
              <span className="stat-sub">Avg Retirement Velocity</span>
              <span className="stat-val text-lime-400">18.2k kg/mo</span>
            </div>
            <div className="bottom-stat">
              <span className="stat-sub">Validity Ratio</span>
              <span className="stat-val text-white">99.4% Verified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Category Distribution */}
        <div className="dashboard-panel distribution-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Credit Distribution by Category</h3>
              <p className="panel-subtitle">Share of on-chain carbon credits by methodology</p>
            </div>
          </div>

          <div className="distribution-list">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="distribution-item">
                <div className="distribution-item-header">
                  <div className="flex items-center gap-2">
                    <span className="dist-color-dot" style={{ backgroundColor: cat.color }} />
                    <span className="dist-name">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="dist-credits">{formatNumber(cat.credits)} kg</span>
                    <span className="dist-percentage">{cat.share}%</span>
                  </div>
                </div>
                <div className="distribution-bar-bg">
                  <div
                    className="distribution-bar-fill"
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="distribution-footer-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Strict Verification Matrix</h4>
                <p className="text-[11px] text-slate-400">
                  All credits require randomized on-chain tree proof audits before unlocking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Statistics Section */}
      <div className="dashboard-panel impact-section-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Environmental Impact & Biodiversity Metrics</h3>
            <p className="panel-subtitle">Tangible real-world ecological dividends verified by blockchain telemetry</p>
          </div>
        </div>

        <div className="impact-metrics-grid">
          <div className="impact-metric-box">
            <div className="impact-icon-circle bg-emerald-500/10 text-emerald-400">
              <Trees className="w-5 h-5" />
            </div>
            <div className="impact-metric-info">
              <span className="impact-val">{PLATFORM_STATS.verifiedLandHectares} ha</span>
              <span className="impact-label">Native Forest Re-established</span>
              <p className="impact-sub">High-density canopy restoration across 4 eco-regions</p>
            </div>
          </div>

          <div className="impact-metric-box">
            <div className="impact-icon-circle bg-lime-500/10 text-lime-400">
              <Car className="w-5 h-5" />
            </div>
            <div className="impact-metric-info">
              <span className="impact-val">{PLATFORM_STATS.carsOffsetEquivalent} Cars</span>
              <span className="impact-label">Passenger Vehicles Offset</span>
              <p className="impact-sub">Equivalent annual tailpipe emissions neutralized</p>
            </div>
          </div>

          <div className="impact-metric-box">
            <div className="impact-icon-circle bg-sky-500/10 text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="impact-metric-info">
              <span className="impact-val">1.8M Liters</span>
              <span className="impact-label">Groundwater Retention</span>
              <p className="impact-sub">Riparian root zones preventing topsoil runoff</p>
            </div>
          </div>

          <div className="impact-metric-box">
            <div className="impact-icon-circle bg-amber-500/10 text-amber-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="impact-metric-info">
              <span className="impact-val">98.6%</span>
              <span className="impact-label">Audit Accuracy Index</span>
              <p className="impact-sub">Calculated via on-chain Merkle tree sampling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blockchain Transactions Table */}
      <div className="dashboard-panel transactions-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Recent Blockchain Transactions</h3>
            <p className="panel-subtitle">Real-time ledger entries from the CarbonCreditRegistry smart contract</p>
          </div>
          <button className="btn-secondary-subtle" onClick={onNavigateToTransactions}>
            <span>View All Transactions</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="table-responsive">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>Type</th>
                <th>Project / Reason</th>
                <th>Amount</th>
                <th>Age</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_TRANSACTIONS.slice(0, 5).map((tx) => (
                <tr
                  key={tx.hash}
                  className="table-row-hover clickable"
                  onClick={() => onSelectTx(tx)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-300 font-medium">{shortHash(tx.hash)}</span>
                      <button
                        className="copy-btn-inline"
                        onClick={(e) => handleCopyHash(tx.hash, e)}
                        title="Copy hash"
                      >
                        {copiedHash === tx.hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-tx-type ${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-300 truncate max-w-[200px] block" title={tx.projectName}>
                      {tx.projectName || 'Carbon Ledger Operation'}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-xs text-white">
                      {formatNumber(tx.amount)} {tx.currency}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400">{formatRelativeTime(tx.timestamp)}</span>
                  </td>
                  <td>
                    <span className="badge-status-confirmed">
                      <span className="pulse-dot green small" />
                      {tx.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={explorerTx(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="table-action-icon"
                        onClick={(e) => e.stopPropagation()}
                        title="View on MSTScan"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
