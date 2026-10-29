import React, { useState } from 'react'
import {
  LineChart,
  BarChart,
  TrendingUp,
  PieChart,
  Trees,
  ShieldCheck,
  Globe2,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import {
  PLATFORM_STATS,
  MONTHLY_ACTIVITY_DATA,
  CATEGORY_DISTRIBUTION,
} from '../../lib/mockData'
import { formatNumber, formatTons } from '../../lib/format'

export function AnalyticsView() {
  const [range, setRange] = useState<'30D' | '90D' | '1Y'>('1Y')

  const totalIssued = PLATFORM_STATS.creditsIssued
  const totalRetired = PLATFORM_STATS.creditsRetired
  const retirementRatio = ((totalRetired / totalIssued) * 100).toFixed(1)

  return (
    <div className="analytics-view">
      {/* Header */}
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Platform & Climate Analytics</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Verified Telemetry
            </span>
          </div>
          <p className="dashboard-subtitle">
            Cryptographic ledger analytics, cumulative CO₂ sequestration curves, and verifier operational benchmarks.
          </p>
        </div>
      </div>

      {/* Top 3 Analytical Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Cumulative Sequestration</span>
            <div className="kpi-icon-box bg-emerald-500/10 text-emerald-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{formatNumber(totalIssued)}</span>
            <span className="kpi-unit">kg CO₂e</span>
          </div>
          <span className="kpi-trend positive">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Equal to {formatTons(totalIssued)}
          </span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Retirement Velocity Ratio</span>
            <div className="kpi-icon-box bg-lime-500/10 text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{retirementRatio}%</span>
            <span className="kpi-unit">Burn Rate</span>
          </div>
          <span className="kpi-context text-xs text-slate-400">
            {formatNumber(totalRetired)} kg permanently retired
          </span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Average Verifier Node Latency</span>
            <div className="kpi-icon-box bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{PLATFORM_STATS.avgVerifierTimeHours}h</span>
            <span className="kpi-unit">Audit Time</span>
          </div>
          <span className="kpi-trend positive">
            99.8% On-Chain Sampling Pass Rate
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="dashboard-charts-grid">
        {/* Cumulative Trend Graph */}
        <div className="dashboard-panel chart-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Cumulative Carbon Offset Timeline</h3>
              <p className="panel-subtitle">Total verified kg CO₂e captured over time</p>
            </div>
            <div className="time-toggle-group">
              {(['30D', '90D', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  className={`time-toggle-btn ${range === r ? 'active' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="analytics-timeline-chart">
            <div className="chart-bars-container h-48 flex items-end gap-3 pt-6">
              {MONTHLY_ACTIVITY_DATA.map((item, idx) => {
                const cumVal = MONTHLY_ACTIVITY_DATA.slice(0, idx + 1).reduce((sum, d) => sum + d.minted, 0)
                const maxCum = 300000
                const h = Math.round((cumVal / maxCum) * 100)

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-900 rounded-t overflow-hidden flex flex-col justify-end" style={{ height: '160px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-500 hover:brightness-110 relative group"
                        style={{ height: `${h}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap">
                          {formatNumber(cumVal)} kg
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{item.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Methodology & Species Breakdown */}
        <div className="dashboard-panel distribution-panel">
          <div className="panel-header-row">
            <div>
              <h3 className="panel-title">Methodology Sequestration Yield</h3>
              <p className="panel-subtitle">Average annual absorption per registered hectare</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-white">Coastal Mangroves (Blue Carbon)</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">12.5 t / ha / yr</span>
              </div>
              <p className="text-[11px] text-slate-400">High biomass accumulation in root sediment</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-white">Native Teak & Shola Canopy</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">8.2 t / ha / yr</span>
              </div>
              <p className="text-[11px] text-slate-400">Endemic Western Ghats agro-forestry model</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-white">Arid Afforestation (Khejri & Neem)</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">4.8 t / ha / yr</span>
              </div>
              <p className="text-[11px] text-slate-400">Desert border green wall buffer program</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
