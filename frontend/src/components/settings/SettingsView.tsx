import React, { useState } from 'react'
import {
  Settings,
  Shield,
  Layers,
  Bell,
  Coins,
  ExternalLink,
  Check,
  FileCode,
  Info,
} from 'lucide-react'
import { MST_CHAIN_ID, MST_EXPLORER, MST_FAUCET, explorerAddress } from '../../config/chain'
import { REGISTRY_ADDRESS, isRegistryConfigured } from '../../lib/registry'
import { useToast } from '../../context/ToastContext'

export function SettingsView() {
  const [currencyPref, setCurrencyPref] = useState<'tMSTC' | 'USD'>('tMSTC')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRefetch, setAutoRefetch] = useState(true)
  const toast = useToast()

  const saveSettings = () => {
    toast.success('Preferences Updated', 'Settings saved to local storage.')
  }

  return (
    <div className="settings-view">
      <div className="marketplace-header-row">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="dashboard-title">Platform Settings & Network Configuration</h1>
            <span className="live-status-chip">
              <span className="pulse-dot green" />
              Configuration
            </span>
          </div>
          <p className="dashboard-subtitle">
            Configure RPC endpoints, contract registry addresses, display preferences, and notification rules.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Network & RPC Information */}
        <div className="dashboard-panel">
          <h3 className="panel-title flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Blockchain Network Configuration
          </h3>
          <p className="panel-subtitle">Target EVM network for transactions and cryptographic proofs</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="detail-item-box">
              <span className="text-xs text-slate-400 block mb-0.5">Network Name</span>
              <span className="text-sm font-semibold text-white">MST Testnet</span>
            </div>

            <div className="detail-item-box">
              <span className="text-xs text-slate-400 block mb-0.5">Chain ID</span>
              <span className="text-sm font-mono text-emerald-300">{MST_CHAIN_ID}</span>
            </div>

            <div className="detail-item-box">
              <span className="text-xs text-slate-400 block mb-0.5">RPC Endpoint</span>
              <span className="text-xs font-mono text-slate-300">https://testnetrpc.mstblockchain.com</span>
            </div>

            <div className="detail-item-box">
              <span className="text-xs text-slate-400 block mb-0.5">Block Explorer</span>
              <a
                href={MST_EXPLORER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                testnet.mstscan.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Smart Contract Registry Details */}
        <div className="dashboard-panel">
          <h3 className="panel-title flex items-center gap-2">
            <Layers className="w-4 h-4 text-lime-400" />
            CarbonCreditRegistry Contract
          </h3>
          <p className="panel-subtitle">ERC-1155 smart contract managing project states and token mints</p>

          <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Contract Address</span>
            <div className="flex items-center justify-between">
              <code className="text-xs font-mono text-emerald-300 break-all">{REGISTRY_ADDRESS}</code>
              {isRegistryConfigured && (
                <a
                  href={explorerAddress(REGISTRY_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-sm ml-2"
                >
                  View on MSTScan
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Display & Notification Preferences */}
        <div className="dashboard-panel">
          <h3 className="panel-title flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            Display & Preferences
          </h3>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-sm font-medium text-white block">Default Valuation Currency</span>
                <span className="text-xs text-slate-400">Display credit costs in tMSTC or estimated USD equivalent</span>
              </div>
              <div className="action-toggle-seg">
                <button
                  className={`action-seg-btn ${currencyPref === 'tMSTC' ? 'active' : ''}`}
                  onClick={() => setCurrencyPref('tMSTC')}
                >
                  tMSTC
                </button>
                <button
                  className={`action-seg-btn ${currencyPref === 'USD' ? 'active' : ''}`}
                  onClick={() => setCurrencyPref('USD')}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-sm font-medium text-white block">Real-time Polling & Sync</span>
                <span className="text-xs text-slate-400">Automatically poll contract state every 15 seconds</span>
              </div>
              <input
                type="checkbox"
                checked={autoRefetch}
                onChange={(e) => setAutoRefetch(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-sm font-medium text-white block">Ledger Toast Notifications</span>
                <span className="text-xs text-slate-400">Show floating feedback on transaction writes and approvals</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <button className="btn-primary-action mt-5" onClick={saveSettings}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}
